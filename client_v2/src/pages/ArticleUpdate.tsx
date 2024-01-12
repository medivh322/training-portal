import { Drawer, Space, Button, Form, Input, Alert } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { articlesApiHooks } from "../redux/articles/reducer";
import { useEffect } from "react";

const ArticlesUpdate = () => {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("articleId");

  const navigate = useNavigate();
  const [update, { isSuccess }] = articlesApiHooks.useUpdateArticleMutation();
  const { data: dataArticle, isSuccess: successFetching } =
    articlesApiHooks.useGetArticleQuery({ articleId }, { skip: !articleId });
  const [form] = Form.useForm();

  const handleSubmitForm = () =>
    update({ ...form.getFieldsValue(), articleId });

  useEffect(() => {
    isSuccess && form.resetFields();
  }, [form, isSuccess]);

  useEffect(() => {
    successFetching &&
      typeof dataArticle !== "undefined" &&
      form.setFieldsValue(dataArticle);
  }, [dataArticle, form, successFetching]);

  return (
    <Drawer
      title="Обновить"
      width={720}
      onClose={() => navigate(-1)}
      open
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          {isSuccess && (
            <Alert type="success" message="Статья успешно обновлена" />
          )}
          <Button onClick={handleSubmitForm}>Сохранить</Button>
        </Space>
      }
    >
      {dataArticle && (
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Название:">
            <Input />
          </Form.Item>
          <Form.Item name={"text"} label="Текст статьи:">
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: [
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                ],
              }}
              data={dataArticle.text}
              onChange={(_event, editor) =>
                form.setFieldValue("text", editor.getData())
              }
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default ArticlesUpdate;
