import { Layout, Flex, Menu, Typography } from "antd";
import { useMemo } from "react";
import { useMatches, Link, Outlet, useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { coursesApiHooks } from "../redux/courses/reducer";
import { selectUserId } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";
import ChooseMenuPanel from "../components/ChooseMenuPanel";

const CoursesStudent = () => {
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  const match = matches[matches.length - 1];

  const studentId = useAppSelector(selectUserId);

  const { data: coursesList = [] } =
    coursesApiHooks.useGetCoursesForStudentQuery(
      { studentId },
      { skip: !studentId }
    );

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
              search: `?course=${courseId}&user=${studentId}`,
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
    [courseId, studentId]
  );

  return (
    <Layout>
      <Flex>
        {!!coursesList.length && (
          <ChooseMenuPanel coursesList={coursesList} courseId={courseId} />
        )}
      </Flex>
      {courseId ? (
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
      ) : (
        <Typography.Text>курс не найден</Typography.Text>
      )}
    </Layout>
  );
};

export default CoursesStudent;
