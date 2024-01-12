import { Drawer, Space, Button, Form, Input, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { articlesApiHooks } from "../redux/articles/reducer";
import { useAppSelector } from "../redux/store";
import { selectUserId } from "../redux/core/selectors";
import { useEffect } from "react";

const ArticlesCreate = () => {
  const teacherId = useAppSelector(selectUserId);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [create, { isSuccess }] = articlesApiHooks.useCreateArticleMutation();

  const handleSubmitForm = () => {
    create({ ...form.getFieldsValue(), teacherId });
  };

  useEffect(() => {
    isSuccess && form.resetFields();
  }, [form, isSuccess]);

  return (
    <Drawer
      title="Создать новую статью"
      width={720}
      onClose={() => navigate(-1)}
      open={true}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          {isSuccess && (
            <Alert type="success" message="Статья успешно добавлена" />
          )}
          <Button onClick={handleSubmitForm}>Сохранить</Button>
        </Space>
      }
    >
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
            data="<p>введите описание</p>"
            onChange={(_event, editor) =>
              form.setFieldValue("text", editor.getData())
            }
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ArticlesCreate;
