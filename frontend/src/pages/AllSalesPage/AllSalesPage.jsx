import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../../features/sales/salesThunks";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import style from "./AllSalesPage.module.css";
import { filterAndSortProducts, SORT_VALUES } from "../../utils/productFilters";
import SadFace from "../../assets/icons/sad-face.svg"

const API_URL = "http://localhost:3333";

function AllSalesPage() {
  const dispatch = useDispatch();
  const { list, listStatus, listError } = useSelector((state) => state.sales);

  const [priceFrom, setPriceFrom] = useState("")
  const [priceTo, setPriceTo] = useState("")
  const [sortBy, setSortBy] = useState(SORT_VALUES.DEFAULT)

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchSales());
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
      filterAndSortProducts(list, {     //list из Redux 
        priceFrom,
        priceTo,
        salesOnly: true, //Это страница AllSalesPage (скидочные товары). Значит независимо от других условий мы оставляем только товары со скидкой
        sortBy,
      }),
      [list, priceFrom, priceTo, sortBy] // зависимости [list, priceFrom, priceTo, sortBy]
  )

  return (
    <section className="container">
      <Breadcrumbs />

      <div className={style.salesHeader}>
        <h1 className={style.title}>Discounted items</h1>

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
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && <p>{listError || "Error loading sales"}</p>}

      {listStatus === "succeeded" &&
        (visibleProducts.length === 0 ? (
          <div className={style.noFoundBox}>
            <img className={style.sadFace} src={SadFace} alt="Sad face" />
            <p className={style.noFoundText}>Sorry <br />We haven&apos;t found anything</p>
          </div>
          
        ) : (
          <div className={style.salesGrid}>
            {visibleProducts.map((product) => {
              const discountPercent = Math.round(
                ((product.price - product.discont_price) / product.price) * 100
              );

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
                    <span className={style.badge}>-{discountPercent}%</span>
                  </div>

                  <h3 className={style.productTitle}>{product.title}</h3>

                  <div className={style.priceRow}>
                    <span className={style.newPrice}>${product.discont_price}</span>
                    <span className={style.oldPrice}>${product.price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
    </section>
  );
}

export default AllSalesPage;
