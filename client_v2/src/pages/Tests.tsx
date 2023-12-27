import { useParams, useSearchParams } from "react-router-dom";
import { coursesApiHooks } from "../redux/courses/reducer";
import { Button, Collapse, Divider, Form, Layout, Spin } from "antd";
import Test from "../components/Test/Test";
import { IFormTest, ITests } from "../types/models";
import { Converter } from "../helper/converterTest";
import { useEffect } from "react";

const Tests = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  const { data: testsList } = coursesApiHooks.useGetTestsQuery<{
    data: IFormTest;
  }>({ courseId, convertData: true }, { skip: !courseId });
  const [create, { isLoading: creating }] =
    coursesApiHooks.useCreateTestsMutation();
  const [update] = coursesApiHooks.useUpdateTestsMutation();

  const [formUpdate] = Form.useForm();
  const path = Form.useWatch("testObj", formUpdate);

  const [formAdd] = Form.useForm();

  useEffect(() => {
    formUpdate.setFieldValue("testObj", testsList?.testObj);
  }, [testsList]);

  return (
    <Layout>
      {!!testsList?.testObj?.length && (
        <>
          <Divider orientation="left">Готовые тесты</Divider>
          <Form
            form={formUpdate}
            initialValues={testsList}
            onFinish={(values: IFormTest) => {
              if (courseId) {
                const schemaTest: ITests[] = Converter(values, courseId);
                update({ tests: schemaTest, deleteList: values.deleteTests });
              }
            }}
          >
            <Form.Item noStyle hidden name={"deleteTests"} initialValue={[]} />
            <Form.List name="testObj">
              {(tests, testsOpt, { errors }) => (
                <>
                  <Collapse>
                    {tests.map(
                      (field) =>
                        path &&
                        path[field.name] && (
                          <Collapse.Panel
                            key={field.key}
                            header={path[field.name].test_name}
                          >
                            <Test
                              field={field}
                              testsOpt={testsOpt}
                              pathToAnswers={path && path[field.name]}
                            />
                            <Form.Item hidden name={[field.name, "_id"]} />
                          </Collapse.Panel>
                        )
                    )}
                  </Collapse>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                обновить
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      <Spin spinning={creating}>
        <Divider orientation="left">Добавить тест</Divider>
        <Form
          form={formAdd}
          onFinish={(values: IFormTest) => {
            if (courseId) {
              const schemaTest: ITests[] = Converter(values, courseId);
              create(schemaTest);
              formAdd.resetFields();
            }
          }}
        >
          <Form.List
            name="testObj"
            rules={[
              {
                validator: async (_, names) => {
                  if (typeof names === "undefined" || !names?.length) {
                    return Promise.reject(
                      new Error("добавьте по крайней мере один тест")
                    );
                  }
                },
              },
            ]}
          >
            {(tests, testsOpt, { errors }) => (
              <>
                {tests.map((field) => (
                  <Test key={field.key} field={field} testsOpt={testsOpt} />
                ))}
                <Button onClick={testsOpt.add}>добавить</Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Layout>
  );
};

export default Tests;
