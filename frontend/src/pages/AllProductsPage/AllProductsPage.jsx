import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import { fetchProducts } from "../../features/products/productsThunks";
import style from "./AllProductsPage.module.css";
import {
  filterAndSortProducts,
  hasDiscount,
  SORT_VALUES,
} from "../../utils/productFilters";
import SadFace from "../../assets/icons/sad-face.svg";
import { addToCart } from "../../features/shoppingCart/shoppingCartSlice";

const API_URL = "http://localhost:3333";

function AllProductsPage() {
  const dispatch = useDispatch();//получает функцию dispatch из Redux, чтобы отправлять actions/thunks в store
  const { list, listStatus, listError } = useSelector(
    (state) => state.products,
  );

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_VALUES.DEFAULT);

  const [addedById, setAddedById] = useState({});
  const timersRef = useRef({}); //это “контейнер” для хранения таймеров между рендерами, без вызова перерисовки
/** там хранится объект таймеров по product.id, например:
 timersRef.current = {
  3: 145,   // id setTimeout для товара 3
  8: 146
}
 */

  const handleAddToCart = (e, product) => {
    //e.preventDefault() и e.stopPropagation()
    //Нужны, потому что кнопка внутри Link. Без этого при клике откроется страница товара.
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ ...product, quantity: 1 })); //Добавляет 1 штуку товара в корзину.

    //В объекте addedById ставит флаг только для текущего товара.
    //Пример: было {1:false, 2:false}, нажали на товар 2 -> станет {1:false, 2:true}.
    //Поэтому только эта карточка показывает Added
    setAddedById((prev) => ({ ...prev, [product.id]: true })); //Для конкретной карточки включает состояние Added

    //Если по этому товару уже был запущен таймер, его отменяем. Это нужно, чтобы при повторном клике не работали два таймера одновременно.
    if (timersRef.current[product.id]) {
      clearTimeout(timersRef.current[product.id]);
    }

    timersRef.current[product.id] = setTimeout(() => {
      setAddedById((prev) => ({ ...prev, [product.id]: false }));
      delete timersRef.current[product.id];
    }, 2000);
  };

  //Очищает таймеры при размонтировании/обновлении, чтобы не было утечек и лишних срабатываний
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((id) => clearTimeout(id));
    };
  }, []);

  //Загружает товары со скидкой только один раз, когда статус idle
  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchProducts());
  }, [dispatch, listStatus]);

  /**
   * useMemo:
   * - запоминает результат вычисления
   * - oн НЕ запускает код заново при каждом рендере.
    - Пересчитывает только когда изменились зависимости из массива в конце

     зависимости [list, priceFrom, priceTo, sortBy]
      Если поменялся list (пришел новый ответ с сервера) → пересчёт.
      Если пользователь поменял from/to → пересчёт.
      Если выбрал другую сортировку → пересчёт.
      Если ничего из этого не менялось, React отдаст старый результат visibleProducts.
   */

  const visibleProducts = useMemo(
    () =>
      filterAndSortProducts(list, {
        priceFrom,
        priceTo,
        discountedOnly,
        sortBy,
      }),
    [list, priceFrom, priceTo, discountedOnly, sortBy],
  );

  return (
    <section className="container">
      <Breadcrumbs />

      <h1 className={style.title}>All products</h1>

      <div className={style.filtersBar}>
        <div className={style.filterGroup}>
          <span className={style.textPrice}>Price</span>
          <div className={style.inputsRow}>
            <input
              type="number"
              min="0"
              placeholder="from"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className={style.input}
            />
            <input
              type="number"
              min="0"
              placeholder="to"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className={style.input}
            />
          </div>
        </div>

        <label className={style.checkboxGroup}>
          <span className={style.textDisc}>Discounted items</span>
          <input
            type="checkbox"
            checked={discountedOnly}
            onChange={(e) => setDiscountedOnly(e.target.checked)}
            className={style.checkbox}
          />
        </label>

        <div className={style.filterGroup}>
          <span className={style.textSorted}>Sorted</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={style.select}
          >
            <option value={SORT_VALUES.DEFAULT}>by default</option>
            <option value={SORT_VALUES.PRICE_ASC}>price: low to high</option>
            <option value={SORT_VALUES.PRICE_DESC}>price: high to low</option>
            <option value={SORT_VALUES.TITLE_ASC}>title: A-Z</option>
            <option value={SORT_VALUES.TITLE_DESC}>title: Z-A</option>
          </select>
        </div>
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && (
        <p>{listError || "Error loading products"}</p>
      )}

      {listStatus === "succeeded" &&
        (visibleProducts.length === 0 ? (
          <div className={style.noFoundBox}>
            <img className={style.sadFace} src={SadFace} alt="Sad face" />
            <p className={style.noFoundText}>
              Sorry <br /> We haven&apos;t found anything
            </p>
          </div>
        ) : (

          /**
           * visibleProducts.map((product) => { ... }) Проходит по отфильтрованному списку и рендерит карточку для каждого товара.
           * Внутри для каждого product
           * 1)const isAdded = !!addedById[product.id];
                Проверяет, был ли нажат Add to cart у этой конкретной карточки.
                true -> показать Added, false -> Add to cart.
            2)const discounted = hasDiscount(product);
                Определяет, есть ли у товара реальная скидка (discont_price < price).
            3)const discountPercent = discounted ? ... : null;
                Если скидка есть, считает процент скидки: (price - discont_price) / price) * 100
                и округляет Math.round(...).
                Если скидки нет -> null (процент не показываем).
           */
          <div className={style.productsGrid}>
            {visibleProducts.map((product) => {
              const isAdded = !!addedById[product.id];
              const discounted = hasDiscount(product);
              const discountPercent = discounted
                ? Math.round(
                    ((Number(product.price) - Number(product.discont_price)) /
                      Number(product.price)) *
                      100,
                  )
                : null;

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={style.card}
                >
                  <div className={style.imageWrap}>
                    <img
                      src={`${API_URL}${product.image}`}
                      alt={product.title}
                      className={style.image}
                    />
                    <button
                      type="button"
                      className={`${style.cardAddBtn} ${isAdded ? style.cardAddedBtn : ""}`}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      {isAdded ? "Added" : "Add to cart"}
                    </button>
                    {discounted && (
                      <span className={style.badge}>-{discountPercent}%</span>
                    )}
                  </div>

                  <h3 className={style.productTitle}>{product.title}</h3>

                  <div className={style.priceRow}>
                    {discounted ? (
                      <>
                        <span className={style.newPrice}>
                          ${product.discont_price}
                        </span>
                        <span className={style.oldPrice}>${product.price}</span>
                      </>
                    ) : (
                      <span className={style.newPrice}>${product.price}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
    </section>
  );
}

export default AllProductsPage;
