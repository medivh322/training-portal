import { Button, Flex, Form, Input } from "antd";
import { coreApiHooks } from "../redux/core/reducer";

type TLoginField = {
  login: string;
  password: string;
};

const LoginPage = () => {
  const [login] = coreApiHooks.useLoginMutation();

  return (
    <Flex style={{ height: "100vh" }} align="center" justify="center">
      <Form
        labelCol={{ span: 6 }}
        style={{ width: 500 }}
        initialValues={{ remember: true }}
        onFinish={login}
        autoComplete="off"
        labelAlign="left"
      >
        <Form.Item<TLoginField>
          label="Логин"
          name="login"
          rules={[{ required: true, message: "Пожалуйста, заполните поле" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TLoginField>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Пожалуйста, заполните поле" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Flex justify="right">
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
