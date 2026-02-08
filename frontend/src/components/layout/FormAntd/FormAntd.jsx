import { Form, Input, Button, Modal } from 'antd'
import styles from './FormAntd.module.css'
import { useState } from 'react'


function FormAntd() {
     const [form] = Form.useForm()
    //  const [isModalOpen, setIsModalOpen] = useState(false) // Вариант с <Modal/> и useState

    // onFinish - вызывает, если все данные в форме валидны
    // Параметр values принимает объект со всеми значениями формы
    const onFinish =  (values) => {
        console.log('Данные формы валидны');
        form.resetFields() 
        Modal.success({
        content: 'Check your email for the discount.',
        })
    // setIsModalOpen(true) // Вариант с <Modal/> и useState
    } 

  return (
  <>
    <Form 
    form={form}
     onFinish={onFinish} //срабатывает только если валидация успешна
    layout="vertical" //Расположение label относительно поля
    className={styles.discountForm}>
      <Form.Item
        name="name"
        rules={[
            { 
                required: true, 
                message: 'Please enter your name' 
            },
            {
                min: 2,
                message: 'Name must be longer than 2 symbols'

            }
        ]}
      >
        <Input placeholder="Name" className={styles.inputD} />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
            {
                required: true,
                message: 'Please enter your phone number',
            },
            {
                pattern: /^\+?[0-9\s\-()]{10,20}$/,
                message: 'Enter a valid phone number',
            },
        ]}
      >
        <Input placeholder="Phone number" className={styles.inputD} />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { 
            required: true, 
            message: 'Please enter your email' },
          { 
            type: 'email', 
            message: 'Invalid email address' },
        ]}
      >
        <Input placeholder="Email" className={styles.inputD} />
      </Form.Item>

      <Button htmlType="submit" block id='buttonD' className={styles.buttonD}>
        Get a discount
      </Button>
    </Form>

    {/* Вариант с <Modal/> и useState
    <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }} // Прячет кнопку Cancel
        className={styles.modal}
    >
        <p className={styles.modalText}>Check your email for the discount.</p>
    </Modal> */}

</>
  )
}

export default FormAntd
