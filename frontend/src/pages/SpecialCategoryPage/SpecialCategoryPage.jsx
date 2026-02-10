import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById } from "../../features/categories/categoriesThunks";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import style from "./SpecialCategoryPage.module.css";

const API_URL = "http://localhost:3333";

function SpecialCategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current, currentProducts, currentStatus, currentError } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (id) dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  return (
    <section className="container">
      <Breadcrumbs />

      {currentStatus === "loading" && <p>Loading...</p>}
      {currentStatus === "failed" && (
        <p>{currentError || "Error loading category"}</p>
      )}

      {currentStatus === "succeeded" && (
        <>
          <div className={style.header}>
            <h1 className={style.title}>{current?.title || "Category"}</h1>
          </div>

          <div className={style.productsGrid}>
            {currentProducts.map((product) => {
              const hasDiscount =
                product.discont_price !== null &&
                product.discont_price !== undefined &&
                product.discont_price < product.price;

              const discountPercent = hasDiscount
                ? Math.round(((product.price - product.discont_price) / product.price) * 100)
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
                    {hasDiscount && (
                      <span className={style.badge}>-{discountPercent}%</span>
                    )}
                  </div>

                  <h3 className={style.productTitle}>{product.title}</h3>

                  <div className={style.priceRow}>
                    {hasDiscount ? (
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
        </>
      )}
    </section>
  );
}

export default SpecialCategoryPage;
