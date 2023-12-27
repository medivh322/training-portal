import { Link, useParams, useSearchParams } from "react-router-dom";
import { coursesApiHooks } from "../redux/courses/reducer";
import { Divider, Layout, List } from "antd";
import { useMemo } from "react";
import { ITests } from "../types/models";
import { selectUserId } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";

const TestsStudent = () => {
  const studentId = useAppSelector(selectUserId);

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course");

  const { data: testsList } = coursesApiHooks.useGetTestsQuery<{
    data: ITests[];
  }>({ courseId }, { skip: !courseId });

  const menuItems = useMemo(
    () =>
      !!testsList &&
      testsList.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    [testsList]
  );
  return (
    <Layout>
      <Divider orientation="left">Тесты</Divider>
      {!!menuItems.length && (
        <List
          dataSource={menuItems}
          renderItem={(item) => (
            <List.Item>
              <Link
                to={{
                  pathname: "/workshop/passing-test",
                  search: `?test=${item.id}&user=${studentId}&course=${courseId}`,
                }}
              >
                {item.title}
              </Link>
            </List.Item>
          )}
        />
      )}
    </Layout>
  );
};

export default TestsStudent;
