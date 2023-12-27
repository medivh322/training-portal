import {
  Button,
  Card,
  Form,
  FormInstance,
  FormListFieldData,
  FormListOperation,
  Input,
  Row,
} from "antd";
import { FC } from "react";
import Question from "./Question";

const Test: FC<{
  field: FormListFieldData;
  testsOpt: FormListOperation;
  form?: FormInstance<any>;
  pathToAnswers?: any;
}> = ({ field, testsOpt, form, pathToAnswers }) => {
  const formHooks = Form.useFormInstance();
  const deletePrevData = Form.useWatch("deleteTests", form);

  return (
    <Card>
      <Form.Item
        name={[field.name, "test_name"]}
        rules={[{ required: true, message: "введите название" }]}
      >
        <Input placeholder="название теста" style={{ width: 300 }} />
      </Form.Item>
      <Form.List
        name={[field.name, "test_list"]}
        rules={[
          {
            validator: async (_, names) => {
              if (typeof names === "undefined" || !names?.length) {
                return Promise.reject(
                  new Error("добавьте по крайней мере один вопрос")
                );
              }
            },
          },
        ]}
      >
        {(questions, questionsOpt, { errors }) => (
          <Row gutter={[12, 24]}>
            {questions.map((question) => (
              <Question
                key={question.name}
                question={question}
                questionsOpt={questionsOpt}
                pathToAnswers={
                  pathToAnswers && pathToAnswers.test_list[question.name]
                }
              />
            ))}
            <Button type="dashed" onClick={() => questionsOpt.add()} block>
              добавить вопрос
            </Button>
            <Form.ErrorList errors={errors} />
          </Row>
        )}
      </Form.List>
      <Button
        onClick={() => {
          if (!!deletePrevData) {
            formHooks.setFieldValue("deleteTests", [
              ...deletePrevData,
              pathToAnswers._id,
            ]);
          }

          testsOpt.remove(field.name);
        }}
      >
        удалить
      </Button>
    </Card>
  );
};

export default Test;
