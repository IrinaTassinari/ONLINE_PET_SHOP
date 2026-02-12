import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById } from "../../features/categories/categoriesThunks";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import style from "./SpecialCategoryPage.module.css";
import {
  filterAndSortProducts,
  hasDiscount,
  SORT_VALUES,
} from "../../utils/productFilters";
import SadFace from "../../assets/icons/sad-face.svg";
import { addToCart } from "../../features/shoppingCart/shoppingCartSlice";

const API_URL = "http://localhost:3333";

function SpecialCategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current, currentProducts, currentStatus, currentError } = useSelector(
    (state) => state.categories,
  );

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_VALUES.DEFAULT);

  const [addedById, setAddedById] = useState({});
  const timersRef = useRef({});

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

  useEffect(() => {
    if (id) dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

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
      filterAndSortProducts(currentProducts || [], {
        priceFrom,
        priceTo,
        discountedOnly,
        sortBy,
      }),
    [currentProducts, priceFrom, priceTo, discountedOnly, sortBy],
  );

  return (
    <section className="container">
      <Breadcrumbs />

      <h1 className={style.title}>{current?.title || "Category"}</h1>

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

      {currentStatus === "loading" && <p>Loading...</p>}
      {currentStatus === "failed" && (
        <p>{currentError || "Error loading category"}</p>
      )}

      {currentStatus === "succeeded" &&
        (visibleProducts.length === 0 ? (
          <div className={style.noFoundBox}>
            <img className={style.sadFace} src={SadFace} alt="Sad face" />
            <p className={style.noFoundText}>
              Sorry <br /> We haven&apos;t found anything
            </p>
          </div>
        ) : (
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

export default SpecialCategoryPage;
