import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";
import { hasDiscount } from "../../utils/productFilters";
import style from "./OneProductPage.module.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/shoppingCart/shoppingCartSlice";

const API_URL = "http://localhost:3333";

function OneProductPage() {
  const { id } = useParams(); //Берёт id товара из URL (/products/:id), чтобы понять какой товар грузить
  const [product, setProduct] = useState(null); //объект товара (title, price, image, description и т.д.)
  const [status, setStatus] = useState("loading"); //Состояние загрузки: loading, succeeded, failed
  const [error, setError] = useState(""); //Текст ошибки, если запрос товара не удался
  const [isExpanded, setIsExpanded] = useState(false); //Управляет описанием: свернуто или раскрыто (Read more / Hide).
  const [quantity, setQuantity] = useState(1); // кол-во изначально 1 на товаре
  const [isAdded, setIsAdded] = useState(false); // button Add To Cart
  const addedTimerRef = useRef(null);

  const fullDescription = product?.description || "";
  const PREVIEW_LIMIT = 280;
  const isLongText = fullDescription.length > PREVIEW_LIMIT;

  const dispatch = useDispatch(); //получает функцию dispatch из Redux, чтобы отправлять actions/thunks в store

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
    setQuantity(1);
    setIsExpanded(false);
    setIsAdded(false);
  }, [id]);

  /**
   * handleAddToCart Что делает:
      - берёт все поля товара (...product),
      - добавляет текущее выбранное количество quantity,
      - отправляет в shoppingCartSlice.
      - Без этого в корзину уйдёт товар с дефолтным количеством (обычно 1).
   */
  const handleAddToCart = () => {
  dispatch(addToCart({ ...product, quantity }));
  setIsAdded(true);

  if (addedTimerRef.current) {
    clearTimeout(addedTimerRef.current);
  }

  addedTimerRef.current = setTimeout(() => {
    setIsAdded(false);
    addedTimerRef.current = null;
  }, 2000);
};

  //При размонтировании компонента  очищает таймер, чтобы не было утечек и попыток обновить state после ухода со страницы
 useEffect(() => {
  return () => {
    if (addedTimerRef.current) {
      clearTimeout(addedTimerRef.current);
    }
  };
}, []);

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
            setStatus("failed"); //пустой массив
            setError("Product not found");
            return;
          }
          setProduct(data[0]); //иначе берёт data[0], кладёт в product, статус succeeded
          setStatus("succeeded");
          return;
        }

        //если пришёл объект ошибки { status: "ERR" }
        if (data?.status === "ERR") {
          setStatus("failed");
          setError(data.message || "Product not found");
          return;
        }

        setProduct(data); //иначе считает, что пришёл объект товара: кладёт в product, статус succeeded
        setStatus("succeeded");
      } catch (e) {
        setStatus("failed");
        setError("Error loading product");
      }
    };

    if (id) loadProduct(); //if (id) true -> запрос выполняется
  }, [id]); //id приходит из URL через useParams().

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
    ? Math.round(
        ((product.price - product.discont_price) / product.price) * 100,
      )
    : 0;
  //const discountPercent = discounted ? ... : null;
  //Если скидка есть, считает процент скидки: (price - discont_price) / price) * 100 и округляет Math.round(...)

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

          <div className={style.cartRow}>
            <div className={style.qtyBox}>
              <button
                type="button"
                className={style.qtyBtn}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>

              <span className={style.qtyValue}>{quantity}</span>

              <button
                type="button"
                className={style.qtyBtn}
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`${style.addToCartBtn} ${isAdded ? style.addedBtn : ""}`}
              onClick={handleAddToCart}
            >
              {isAdded ? "Added" : "Add to cart"}
            </button>
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
