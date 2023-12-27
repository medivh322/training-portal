import {
  Button,
  Flex,
  Form,
  Input,
  Menu,
  Select,
  Space,
  Typography,
} from "antd";
import Layout from "antd/es/layout/layout";
import { useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useMatches,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { v4 } from "uuid";
import { coursesApiHooks } from "../redux/courses/reducer";
import { useAppSelector } from "../redux/store";
import { selectUserId } from "../redux/core/selectors";
import ChooseMenuPanel from "./ChooseMenuPanel";

const Courses = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const matches = useMatches();
  const navigate = useNavigate();

  const match = matches[matches.length - 1];

  const [currentCourse, setCurrentSource] = useState<string | null>(courseId);

  const teacherId = useAppSelector(selectUserId);

  const { data: coursesList = [] } = coursesApiHooks.useGetCoursesQuery(
    { teacherId },
    { skip: !teacherId }
  );
  const [create, { isLoading }] = coursesApiHooks.useCreateCoursesMutation();

  const menuCourse = useMemo(
    () => [
      {
        label: (
          <Link
            to={{
              pathname: "tests",
              search: `?course=${currentCourse}`,
            }}
          >
            Тесты
          </Link>
        ),
        url: "tests",
        key: v4(),
      },
      {
        label: (
          <Link
            to={{
              pathname: "results",
              search: `?course=${currentCourse}`,
            }}
          >
            Результаты
          </Link>
        ),
        url: "results",
        key: v4(),
      },
      {
        label: (
          <Link
            to={{ pathname: "materials", search: `?course=${currentCourse}` }}
          >
            Материалы
          </Link>
        ),
        url: "materials",
        key: v4(),
      },
    ],
    [currentCourse]
  );

  return (
    <Layout>
      <Flex>
        {!!coursesList.length && (
          <ChooseMenuPanel coursesList={coursesList} courseId={courseId} />
        )}
        <Form
          style={{ display: "flex" }}
          disabled={isLoading}
          autoComplete="off"
          onFinish={({ title }) => teacherId && create({ teacherId, title })}
        >
          <Space size={[25, 0]} align="start">
            <Form.Item
              name="title"
              rules={[
                { required: true, message: "Пожалуйста, заполните поле" },
              ]}
            >
              <Input style={{ width: 400 }} />
            </Form.Item>
            <Form.Item>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Создать курс
              </Button>
            </Form.Item>
            <Button>
              <Link to={"/workshop/share"}>добавить ученика</Link>
            </Button>
          </Space>
        </Form>
      </Flex>
      {!!currentCourse && (
        <>
          <Menu
            mode="horizontal"
            items={menuCourse}
            selectedKeys={menuCourse
              .filter((item) => item.url === match.handle)
              .map((item) => item.key)}
          />
          <Outlet />
        </>
      )}
    </Layout>
  );
};

export default Courses;
