import { Button, Form, Input, Radio } from "antd";
import { coreApiHooks } from "../redux/core/reducer";

const Reg = () => {
  const [signup, { isLoading }] = coreApiHooks.useSignupMemberMutation();
  return (
    <Form autoComplete="off" style={{ width: "500px" }} onFinish={signup}>
      <Form.Item
        label="Логин"
        name={"login"}
        rules={[{ required: true, message: "Пожалуйста, заполните поле" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Пароль"
        name={"password"}
        rules={[{ required: true, message: "Пожалуйста, заполните поле" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Роль"
        name={"role"}
        rules={[
          { required: true, message: "Пожалуйста, выберите один из вариантов" },
        ]}
      >
        <Radio.Group>
          <Radio value={"Teacher"}>Преподаватель</Radio>
          <Radio value={"Student"}>Ученик</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} type="primary" htmlType="submit">
          Регистрация
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Reg;
