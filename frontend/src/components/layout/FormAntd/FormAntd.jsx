import { Form, Input, Button, Modal } from "antd";
import style from "./FormAntd.module.css";
import { useDispatch } from "react-redux";
import { sendSaleCoupon } from "../../../features/sales/salesThunks";

function FormAntd() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      await dispatch(sendSaleCoupon(values)).unwrap(); //Отправляет данные формы на backend
      /**
       * unwrap() у dispatch(thunk) превращает результат в обычный Promise:
            если thunk fulfilled -> вернёт payload,
            если thunk rejected -> бросит error (попадёшь в catch).
       */
      form.resetFields();
      Modal.success({
        content: "Check your email for the discount.",
      });
    } catch (error) {
      Modal.error({
        content: "Failed to send request. Please try again.",
      });
    }
  };

  return (
      <Form
        form={form}
        onFinish={onFinish} //срабатывает только если валидация успешна
        layout="vertical" //Расположение label относительно поля
        className={style.discountForm}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your name",
            },
            {
              min: 2,
              message: "Name must be longer than 2 symbols",
            },
          ]}
        >
          <Input placeholder="Name" className={style.inputD} />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Please enter your phone number",
            },
            {
              pattern: /^\+?[0-9\s\-()]{10,20}$/,
              message: "Enter a valid phone number",
            },
          ]}
        >
          <Input placeholder="Phone number" className={style.inputD} />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            {
              type: "email",
              message: "Invalid email address",
            },
          ]}
        >
          <Input placeholder="Email" className={style.inputD} />
        </Form.Item>

        <Button htmlType="submit" block id="buttonD" className={style.buttonD}>
          Get a discount
        </Button>
      </Form>
  );
}

export default FormAntd;
