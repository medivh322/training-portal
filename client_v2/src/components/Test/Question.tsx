import {
  Col,
  Card,
  Input,
  Row,
  Radio,
  Button,
  Form,
  FormListFieldData,
  FormListOperation,
  Checkbox,
  Flex,
  Space,
  FormInstance,
} from "antd";
import { FC, useEffect, useMemo, useState } from "react";

const Question: FC<{
  question: FormListFieldData;
  questionsOpt: FormListOperation;
  pathToAnswers?: any;
}> = ({ question, questionsOpt, pathToAnswers }) => {
  const [typeAnswer, setTypeAnswer] = useState<"single" | "multiple">("single");

  useEffect(
    () => setTypeAnswer(pathToAnswers ? pathToAnswers.answer_type : "single"),
    [pathToAnswers]
  );

  const typeAnswerOptions = useMemo(
    () => [
      {
        label: "Одиночный",
        value: "single",
      },
      {
        label: "Множественный",
        value: "multiple",
      },
    ],
    []
  );

  return (
    <Col span={6}>
      <Card>
        <Form.Item
          name={[question.name, "question_name"]}
          rules={[{ required: true, message: "введите название" }]}
        >
          <Input placeholder="вопрос" />
        </Form.Item>
        <Form.Item
          name={[question.name, "answer_type"]}
          rules={[{ required: true, message: "выберите один из вариантов" }]}
        >
          <Radio.Group
            options={typeAnswerOptions}
            onChange={(e) => setTypeAnswer(e.target.value)}
          />
        </Form.Item>
        <Form.List
          name={[question.name, "answersList"]}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(
                    new Error("добавьте по крайней мере два варианта ответа")
                  );
                }
              },
            },
          ]}
        >
          {(answers, answersOpt, { errors }) => (
            <>
              <Row>
                <Col span={3}>
                  {typeAnswer === "multiple" ? (
                    <Form.Item
                      name={[0, "multipleAnswers"]}
                      rules={[
                        {
                          required: true,
                          message: "выберите один из вариантов",
                        },
                      ]}
                    >
                      <Checkbox.Group>
                        <Space direction="vertical" size={25} align="center">
                          {answers.map((answer) => (
                            <Flex key={answer.name} style={{ height: 32 }}>
                              <Checkbox value={answer.name} />
                            </Flex>
                          ))}
                        </Space>
                      </Checkbox.Group>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={[0, "singleAnswer"]}
                      rules={[
                        {
                          required: true,
                          message: "выберите один из вариантов",
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Space direction="vertical" size={25} align="center">
                          {answers.map((answer) => (
                            <Flex key={answer.name} style={{ height: 32 }}>
                              <Radio value={answer.name} />
                            </Flex>
                          ))}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  )}
                </Col>
                <Col span={21}>
                  <Space direction="vertical" size={25} align="center">
                    {answers.map((answer) => (
                      <Flex key={answer.name} style={{ height: 32 }}>
                        <Form.Item
                          name={[answer.name, "valueInput"]}
                          style={{ marginBottom: "0" }}
                          rules={[
                            {
                              required: true,
                              message: "введите название ответа",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Button onClick={() => answersOpt.remove(answer.name)}>
                          удалить вариант
                        </Button>
                      </Flex>
                    ))}
                  </Space>
                </Col>
                <Col span={24}>
                  <Button
                    onClick={() => {
                      answersOpt.add();
                    }}
                  >
                    добавить вариант ответа
                  </Button>
                </Col>
              </Row>
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>
        <Button onClick={() => questionsOpt.remove(question.name)}>
          удалить вопрос
        </Button>
      </Card>
    </Col>
  );
};

export default Question;
