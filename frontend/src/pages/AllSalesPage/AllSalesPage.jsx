import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../../features/sales/salesThunks";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import style from "./AllSalesPage.module.css";

const API_URL = "http://localhost:3333";

function AllSalesPage() {
  const dispatch = useDispatch();
  const { list, listStatus, listError } = useSelector((state) => state.sales);

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchSales());
  }, [dispatch, listStatus]);

  return (
    <section className="container">
      <Breadcrumbs />

      <div className={style.salesHeader}>
        <h1 className={style.title}>Discounted items</h1>
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && <p>{listError || "Error loading sales"}</p>}

      {listStatus === "succeeded" && (
        <div className={style.salesGrid}>
          {list.map((product) => {
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
      )}
    </section>
  );
}

export default AllSalesPage;
