import { Button, Card, Image, Layout, List, Upload } from "antd";
import { useMemo } from "react";
import courseSlice, {
  coursesApi,
  coursesApiHooks,
} from "../redux/courses/reducer";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectUploadingFile } from "../redux/courses/selectors";
import { FileOutlined } from "@ant-design/icons";

const Materials = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const page = searchParams.get("page");

  const { data: fileList } = coursesApiHooks.useGetFilesQuery(
    { courseId, page },
    { skip: !courseId }
  );

  const uploadingFile = useAppSelector(selectUploadingFile);

  const attachments = useMemo(() => fileList?.files, [fileList?.files]);
  return (
    <Layout>
      <Upload
        disabled={uploadingFile}
        accept=".png, .jpeg, .docx, .doc, .pdf"
        showUploadList={{
          showRemoveIcon: false,
        }}
        action={`${API_BASE_URL}upload/${courseId}`}
        withCredentials
        onChange={(info) => {
          dispatch(
            courseSlice.actions.CHANGE_STATUS_UPLOAD_FILE({ status: true })
          );
          if (info.file.status === "done") {
            dispatch(coursesApi.util.invalidateTags(["Attachments"]));
          }
          dispatch(
            courseSlice.actions.CHANGE_STATUS_UPLOAD_FILE({ status: false })
          );
        }}
      >
        <Button disabled={uploadingFile} icon={<UploadOutlined />}>
          загрузить файлы
        </Button>
      </Upload>
      <List
        pagination={{
          position: "bottom",
          align: "center",
          defaultCurrent: Number(page) || 1,
          total: typeof attachments !== "undefined" ? attachments.length : 1,
          defaultPageSize: 10,
          onChange: (value) =>
            navigate({
              pathname: location.pathname,
              search: `?course=${courseId}&page=${value}`,
            }),
        }}
        grid={{ column: 5 }}
        dataSource={attachments}
        renderItem={(file) => (
          <Card title={file.filename}>
            {file.contentType === "image/png" ? (
              <Image
                src={file.metadata.url + file._id}
                width={100}
                height={80}
              />
            ) : (
              <Button
                style={{
                  width: 100,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                rel="noopener noreferrer"
                icon={<FileOutlined style={{ fontSize: 30 }} />}
                href={file.metadata.url + file._id}
                target="_blank"
              />
            )}
          </Card>
        )}
      />
    </Layout>
  );
};

export default Materials;
