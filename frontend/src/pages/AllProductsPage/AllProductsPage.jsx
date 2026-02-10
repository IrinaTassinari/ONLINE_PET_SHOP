import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import { fetchProducts } from "../../features/products/productsThunks";
import style from "./AllProductsPage.module.css";

const API_URL = "http://localhost:3333";

function AllProductsPage() {
  const dispatch = useDispatch();
  const { list, listStatus, listError } = useSelector((state) => state.products);

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchProducts());
  }, [dispatch, listStatus]);

  return (
    <section className="container">
      <Breadcrumbs />

      <div className={style.productsHeader}>
        <h1 className={style.title}>Products</h1>
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && <p>{listError || "Error loading products"}</p>}

      {listStatus === "succeeded" && (
        <div className={style.productsGrid}>
          {list.map((product) => {
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
      )}
    </section>
  );
}

export default AllProductsPage;
