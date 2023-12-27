import {
  Layout,
  Flex,
  Select,
  Input,
  Button,
  Menu,
  Typography,
  Form,
} from "antd";
import { useState, useMemo } from "react";
import {
  useParams,
  useMatches,
  useNavigate,
  Link,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { v4 } from "uuid";
import { coursesApiHooks } from "../redux/courses/reducer";
import { selectUserId } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";
import ChooseMenuPanel from "../components/ChooseMenuPanel";

const CoursesStudent = () => {
  const matches = useMatches();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  const match = matches[matches.length - 1];

  const [currentCourse, setCurrentSource] = useState<string | null>(courseId);

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
              search: `?course=${currentCourse}`,
            }}
          >
            Результаты
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
              search: `?course=${currentCourse}&user=${studentId}`,
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
    [currentCourse, studentId]
  );

  return (
    <Layout>
      <Flex>
        {!!coursesList.length && (
          <ChooseMenuPanel coursesList={coursesList} courseId={courseId} />
        )}
      </Flex>
      {currentCourse ? (
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
