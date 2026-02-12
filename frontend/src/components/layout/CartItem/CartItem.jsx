import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { decreaseQuantity,increaseQuantity,removeFromCart,} from "../../../features/shoppingCart/shoppingCartSlice";
import style from "./CartItem.module.css";

const API_URL = "http://localhost:3333";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const hasDiscount =
    item.discont_price !== null &&
    item.discont_price !== undefined &&
    Number(item.discont_price) < Number(item.price);

  const unitPrice = hasDiscount ? Number(item.discont_price) : Number(item.price);
  const totalPrice = unitPrice * item.quantity;
  const oldTotalPrice = Number(item.price) * item.quantity;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(decreaseQuantity(item.id));
    }
  };

  return (
    <article className={style.card}>
      <Link to={`/products/${item.id}`} className={style.imageWrap}>
        <img src={`${API_URL}${item.image}`} alt={item.title} className={style.image} />
      </Link>

      <div className={style.content}>
        <div className={style.topRow}>
          <h3 className={style.title}>{item.title}</h3>
          <button
            type="button"
            className={style.removeBtn}
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label="Remove item"
          >
            ×
          </button>
        </div>

        <div className={style.bottomRow}>
          <div className={style.counter}>
            <button
              type="button"
              onClick={handleDecrease}
              className={style.counterBtn}
            >
              −
            </button>
            <span className={style.qty}>{item.quantity}</span>
            <button
              type="button"
              onClick={() => dispatch(increaseQuantity(item.id))}
              className={style.counterBtn}
            >
              +
            </button>
          </div>

          <div className={style.priceRow}>
            <span className={style.price}>${totalPrice}</span>
            {hasDiscount && <span className={style.oldPrice}>${oldTotalPrice}</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;

