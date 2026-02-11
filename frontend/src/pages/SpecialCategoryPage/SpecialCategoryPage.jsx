import { useEffect, useMemo, useState } from "react";
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

const API_URL = "http://localhost:3333";

function SpecialCategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current, currentProducts, currentStatus, currentError } = useSelector(
    (state) => state.categories
  );

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_VALUES.DEFAULT);

  useEffect(() => {
    if (id) dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  const visibleProducts = useMemo(
    () =>
      filterAndSortProducts(currentProducts || [], {
        priceFrom,
        priceTo,
        discountedOnly,
        sortBy,
      }),
    [currentProducts, priceFrom, priceTo, discountedOnly, sortBy]
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
              const discounted = hasDiscount(product);
              const discountPercent = discounted
                ? Math.round(
                    ((Number(product.price) - Number(product.discont_price)) /
                      Number(product.price)) *
                      100
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
                    {discounted && (
                      <span className={style.badge}>-{discountPercent}%</span>
                    )}
                  </div>

                  <h3 className={style.productTitle}>{product.title}</h3>

                  <div className={style.priceRow}>
                    {discounted ? (
                      <>
                        <span className={style.newPrice}>${product.discont_price}</span>
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
