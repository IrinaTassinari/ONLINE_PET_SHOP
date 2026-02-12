import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../../../features/sales/salesThunks";
import style from "./SaleBanner.module.css";

const API_URL = "http://localhost:3333";

function SaleBanner() {
  const dispatch = useDispatch(); //получает функцию dispatch из Redux, чтобы отправлять actions/thunks в store
  const { list, listStatus, listError } = useSelector((state) => state.sales);

  //чтобы SaleBanner загрузил товары со скидкой только когда данных ещё нет if (listStatus === "idle")
  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchSales());
  }, [dispatch, listStatus]);

  const saleProducts = list.slice(0, 4);

  return (
    <section className="container">
      <div className={style.saleHeader}>
        <h2 className={style.titleSale}>Sale</h2>
        <span className={style.headerLine}></span>
        <Link className={style.linkToAllSales} to="/sales">
          All sales
        </Link>
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && <p>{listError || "Error loading sales"}</p>}

      {listStatus === "succeeded" && (
        <div className={style.saleGrid}>
          {saleProducts.map((product) => {
            const discountPercent = Math.round(
              ((product.price - product.discont_price) / product.price) * 100,
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

                <h3 className={style.title}>{product.title}</h3>

                <div className={style.priceRow}>
                  <span className={style.newPrice}>
                    ${product.discont_price}
                  </span>
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

export default SaleBanner;
