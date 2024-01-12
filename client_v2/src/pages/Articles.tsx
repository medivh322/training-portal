import { Button, Card, Col, Flex, Layout, List, Row, Typography } from "antd";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { articlesApiHooks } from "../redux/articles/reducer";
import { selectRole } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";
import { SettingFilled } from "@ant-design/icons";
import { format } from "date-fns";

const Articles = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const location = useLocation();
  const navigate = useNavigate();
  const role = useAppSelector(selectRole);
  const { data: articlesList } = articlesApiHooks.useGetArticlesQuery();
  console.log(articlesList);
  return (
    <>
      {role === "Teacher" && (
        <Button onClick={() => navigate("c")}>добавить статью</Button>
      )}
      <Layout style={{ display: "block" }}>
        <Row>
          <Col span={18}>
            <Typography.Text>Список статей:</Typography.Text>
            <List
              pagination={{
                position: "bottom",
                align: "center",
                defaultCurrent: Number(page) || 1,
                total:
                  typeof articlesList !== "undefined" ? articlesList.length : 1,
                defaultPageSize: 10,
                onChange: (value) =>
                  navigate({
                    pathname: location.pathname,
                    search: `?page=${value}`,
                  }),
              }}
              dataSource={articlesList}
              renderItem={(article) => (
                <Link to={"detail/" + article._id} style={{ display: "block" }}>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Typography.Title level={4}>
                          {article.name}
                        </Typography.Title>
                      }
                      description={
                        <Typography.Text>{article.author}</Typography.Text>
                      }
                    />
                    <div>{format(article.createdAt, "yyyy-MM-dd")}</div>
                  </List.Item>
                </Link>
              )}
            />
          </Col>
          {role === "Teacher" && (
            <Col span={6}>
              <Typography.Text>Список ваших статей:</Typography.Text>
              <List
                style={{ width: "80%", padding: "10px" }}
                dataSource={articlesList}
                renderItem={(article) => (
                  <Flex
                    align="center"
                    justify="space-between"
                    style={{ marginTop: "10px" }}
                  >
                    <Typography.Text>{article.name}</Typography.Text>
                    <SettingFilled
                      style={{ fontSize: "30px" }}
                      onClick={() =>
                        navigate({
                          pathname: `s`,
                          search: `?articleId=${article._id}`,
                        })
                      }
                    />
                  </Flex>
                )}
              />
            </Col>
          )}
        </Row>
      </Layout>
      <Outlet />
    </>
  );
};

export default Articles;
