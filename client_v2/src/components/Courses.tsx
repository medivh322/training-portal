import { Button, Flex, Form, Input, Menu, Space } from "antd";
import Layout from "antd/es/layout/layout";
import { useMemo } from "react";
import { Link, Outlet, useMatches, useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { coursesApiHooks } from "../redux/courses/reducer";
import { useAppSelector } from "../redux/store";
import { selectUserId } from "../redux/core/selectors";
import ChooseMenuPanel from "./ChooseMenuPanel";

const Courses = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const matches = useMatches();

  const match = matches[matches.length - 1];

  const teacherId = useAppSelector(selectUserId);

  const { data: coursesList = [] } = coursesApiHooks.useGetCoursesQuery(
    { teacherId },
    { skip: !teacherId }
  );
  const [create, { isLoading }] = coursesApiHooks.useCreateCoursesMutation();
  const [deleteCourse, { isLoading: isLoadingDelete }] =
    coursesApiHooks.useDeleteCourseMutation();

  const menuCourse = useMemo(
    () => [
      {
        label: (
          <Link
            to={{
              pathname: "tests",
              search: `?course=${courseId}`,
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
              search: `?course=${courseId}`,
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
          <Link to={{ pathname: "materials", search: `?course=${courseId}` }}>
            Материалы
          </Link>
        ),
        url: "materials",
        key: v4(),
      },
    ],
    [courseId]
  );

  return (
    <Layout>
      <Space size={[10, 0]} align="start">
        {!!coursesList.length ? (
          <ChooseMenuPanel coursesList={coursesList} courseId={courseId} />
        ) : (
          <div>проекты не найдены</div>
        )}
        {courseId && (
          <Button onClick={() => deleteCourse({ courseId })}>
            <Link to={"/"}>Удалить проект</Link>
          </Button>
        )}
        <Form
          style={{ display: "flex" }}
          disabled={isLoading}
          autoComplete="off"
          onFinish={({ title }) => teacherId && create({ teacherId, title })}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Пожалуйста, заполните поле" }]}
          >
            <Input style={{ width: 400 }} />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Создать курс
            </Button>
          </Form.Item>
        </Form>
      </Space>

      {!!courseId && (
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
