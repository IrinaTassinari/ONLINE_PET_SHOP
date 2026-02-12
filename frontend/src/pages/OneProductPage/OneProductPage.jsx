import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import { hasDiscount } from "../../utils/productFilters";
import style from "./OneProductPage.module.css";

const API_URL = "http://localhost:3333";

function OneProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const fullDescription = product?.description || "";
  const PREVIEW_LIMIT = 280;
  const isLongText = fullDescription.length > PREVIEW_LIMIT;

  /**
 * Логика:
    Если isExpanded === true (нажали Read more)
    ИЛИ текст короткий (!isLongText)
        → показываем весь текст: fullDescription.
    Иначе (текст длинный и не раскрыт)
        → показываем кусок до лимита + ....
        fullDescription.slice(0, PREVIEW_LIMIT) = взять первые PREVIEW_LIMIT символов строки.
 */
  const visibleDescription =
    isExpanded || !isLongText
      ? fullDescription
      : `${fullDescription.slice(0, PREVIEW_LIMIT)}...`;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setStatus("loading");
        setError("");

        const { data } = await axios.get(`${API_URL}/products/${id}`);

        // backend может вернуть:
        // 1) массив: [product]
        // 2) объект ошибки: { status: "ERR", message: "..." }
        // 3) объект продукта (на будущее)
        if (Array.isArray(data)) {
          if (data.length === 0) {
            setStatus("failed");
            setError("Product not found");
            return;
          }
          setProduct(data[0]);
          setStatus("succeeded");
          return;
        }

        if (data?.status === "ERR") {
          setStatus("failed");
          setError(data.message || "Product not found");
          return;
        }

        setProduct(data);
        setStatus("succeeded");
      } catch (e) {
        setStatus("failed");
        setError("Error loading product");
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (status === "loading")
    return (
      <section className="container">
        <p>Loading...</p>
      </section>
    );
  if (status === "failed")
    return (
      <section className="container">
        <p>{error}</p>
      </section>
    );
  if (!product) return null;

  const discounted = hasDiscount(product);
 const discountPercent = discounted
  ? Math.round(((product.price - product.discont_price) / product.price) * 100)
  : 0;



  return (
    <section className="container">
      <Breadcrumbs
        productTitle={product?.title}
        productCategoryId={product?.categoryId}
      />

      <div className={style.wrapper}>
        <img
          src={`${API_URL}${product.image}`}
          alt={product.title}
          className={style.image}
        />

        <div className={style.info}>
          <h1 className={style.title}>{product.title}</h1>

          <div className={style.priceRow}>
            {discounted ? (
              <>
                <span className={style.newPrice}>${product.discont_price}</span>
                <span className={style.oldPrice}>${product.price}</span>
                <span className={style.badgeSale}>-{discountPercent}%</span>
              </>
            ) : (
              <span className={style.newPrice}>${product.price}</span>
            )}
          </div>

          <h3 className={style.descTitle}>Description</h3>
          <p className={style.description}>{visibleDescription}</p>

          {/* Значит: кнопку показываем только если текст длинный (isLongText === true).
Если текст короткий, кнопки вообще не будет. */}
          {isLongText && (
            <button
              type="button"
              className={style.readMoreBtn}
              onClick={() => setIsExpanded((prev) => !prev)}
              // onClick={() => setIsExpanded((prev) => !prev)}
              // При клике переключает состояние:
              // было false → станет true
              // было true → станет false
            >
              {isExpanded ? "Hide" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default OneProductPage;
