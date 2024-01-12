import { useSearchParams } from "react-router-dom";
import { coursesApiHooks } from "../redux/courses/reducer";
import Layout from "antd/es/layout/layout";
import { Button, Card, Checkbox, Form, Radio, Space } from "antd";
import { v4 } from "uuid";

const PassingTest = () => {
  const [searchParams] = useSearchParams();

  const testId = searchParams.get("test");
  const studentId = searchParams.get("user");
  const courseId = searchParams.get("course");

  const { data: testData } = coursesApiHooks.useGetTestQuery(
    {
      testId,
      studentId,
    },
    {
      skip: !testId && !studentId,
    }
  );
  const [save] = coursesApiHooks.useSaveResultTestMutation();

  if (testData?.testCompleted) return <div>тест уже был пройден</div>;

  return (
    <Layout>
      <Form
        title={testData?.test?.title}
        onFinish={(values) =>
          save({ result: values, testId, userId: studentId, courseId })
        }
      >
        {testData?.test?.questions.map((question, i) => (
          <Card key={v4()} title={question.title}>
            <Form.Item
              name={i}
              rules={[
                { required: true, message: "Пожалуйста, выберите вариант(ы)" },
              ]}
            >
              {question.type === "single" ? (
                <Radio.Group>
                  <Space direction="vertical">
                    {question.answers.map((answer, i) => (
                      <Radio key={v4()} value={i}>
                        {answer.text}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              ) : (
                <Checkbox.Group>
                  <Space direction="vertical">
                    {question.answers.map((answer, i) => (
                      <Checkbox key={v4()} value={i}>
                        {answer.text}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Card>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            сохранить
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default PassingTest;
