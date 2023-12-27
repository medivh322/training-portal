import { Button, Card, Image, Layout, List, Upload } from "antd";
import { useMemo } from "react";
import { coursesApiHooks } from "../redux/courses/reducer";
import { coreApiHooks } from "../redux/core/reducer";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";

const Materials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course");
  const page = searchParams.get("page");

  const [upload] = coreApiHooks.useUploadFileMutation();
  const { data: fileList } = coreApiHooks.useGetFilesQuery(
    { courseId, page },
    { skip: !courseId }
  );

  const attachments = useMemo(() => fileList?.files, [fileList?.files]);
  console.log(location);
  return (
    <Layout>
      <Upload customRequest={({ file }) => upload({ courseId, file })}>
        <Button>загрузить</Button>
      </Upload>
      <List
        pagination={{
          position: "bottom",
          align: "center",
          defaultCurrent: Number(page) || 1,
          total: 10,
          defaultPageSize: 1,
          onChange: (value) =>
            navigate({
              pathname: location.pathname,
              search: `?course=${courseId}&page=${value}`,
            }),
        }}
        grid={{ column: 6 }}
        dataSource={attachments}
        renderItem={(file) => (
          <Card title={file.filename}>
            <Image src={`${API_BASE_URL}file/${file.filename}`} />
          </Card>
        )}
      />
    </Layout>
  );
};

export default Materials;
