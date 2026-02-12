import { useSelector } from "react-redux";
import emptyCart from "../../../assets/icons/empty-cart.svg";
import {selectCartItemsCount} from "../../../features/shoppingCart/shoppingCartSlice"
import style from "./CartIcon.module.css";

function CartIcon() {
  const count = useSelector(selectCartItemsCount);

  return (
    <div className={style.wrap}>
      <img src={emptyCart} alt="Cart" className={style.icon} />
      {count > 0 && <span className={style.badge}>{count}</span>}
    </div>
  );
}

export default CartIcon;
