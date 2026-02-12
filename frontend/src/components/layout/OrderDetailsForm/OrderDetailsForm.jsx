import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "../../../features/shoppingCart/shoppingCartSlice";
import { sendOrder } from "../../../features/order/orderThunks";
import { resetOrderState } from "../../../features/order/orderSlice";
import style from "./OrderDetailsForm.module.css";

function OrderDetailsForm() {
  const dispatch = useDispatch(); //получает функцию dispatch из Redux, чтобы отправлять actions/thunks в store
  const [form] = Form.useForm();

  const items = useSelector(selectCartItems); //selectCartItems -> вернуть весь массив товаров корзины
  const itemsCount = useSelector(selectCartItemsCount); //selectCartItemsCount -> общее количество единиц товаров (sum of quantity) число всех штук (для бейджа на иконке корзины)
  const total = useSelector(selectCartTotal); // selectCartTotal -> общая сумма корзины: unitPrice * quantity по каждому товару, затем суммируется
  const orderStatus = useSelector((state) => state.order.status); // orderSlice.js   state.order = ветка из orderSlice,status и error = поля initialState в orderSlice.js.
  const orderError = useSelector((state) => state.order.error); // orderSlice.js

  const onFinish = async (values) => {
    const payload = {
      //const payload = { ... }  Формирует объект, который уйдёт на backend
      ...values, //values — данные из полей формы (name, phone, email)
      // Берёт товары из корзины и оставляет только нужные поля для заказа: id товара and quantity (сколько штук)
      products: items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      })),
      total, //Добавляет итоговую сумму заказа
    };

    try {
      await dispatch(sendOrder(payload)).unwrap();

      Modal.success({
        title: <span className="order-success-title">Congratulations!</span>,
        content: (
          <div className="order-success-text">
            <p>Your order has been successfully placed on the website.</p>
            <p>A manager will contact you shortly to confirm your order.</p>
          </div>
        ),
      });

      dispatch(clearCart());
      dispatch(resetOrderState());
      form.resetFields();
    } catch {
      Modal.error({
        title: "Order failed",
        content: orderError || "Please try again",
      });
    }
  };

  //toFixed(2) — это метод числа в JavaScript. Он форматирует число до 2 знаков после точки
  return (
    <aside className={style.panel}>
      <h2 className={style.title}>Order details</h2>
      <p className={style.items}>{itemsCount} items</p>

      <div className={style.totalRow}>
        <span className={style.totalLabel}>Total</span>
        <span className={style.totalValue}>${total.toFixed(2)}</span>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={style.form}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Enter your name",
            },
            {
              min: 2,
              message: "Name must be longer than 2 symbols",
            },
          ]}
        >
          <Input placeholder="Name" className={style.inputOrd} />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Enter phone number",
            },
            {
              pattern: /^\+?[0-9\s\-()]{10,20}$/,
              message: "Enter a valid phone number",
            },
          ]}
        >
          <Input placeholder="Phone number" className={style.inputOrd} />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Enter email" },
            { type: "email", message: "Email is not valid" },
          ]}
        >
          <Input placeholder="Email" className={style.inputOrd} />
        </Form.Item>

        <button
          type="submit"
          className={style.orderBtn}
          disabled={items.length === 0 || orderStatus === "loading"}
        >
          {orderStatus === "loading" ? "Sending..." : "Order"}
        </button>
      </Form>
    </aside>
  );
}

export default OrderDetailsForm;
