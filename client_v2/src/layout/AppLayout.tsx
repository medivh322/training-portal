import { ConfigProvider, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { FC, ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import SearchPanel from "../components/SearchPanel";
import { selectRole } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const role = useAppSelector(selectRole);
  const adminMenu = useMemo(
    () => [
      {
        label: <Link to={"/reg"}>Регистрация</Link>,
        key: v4(),
      },
    ],
    []
  );
  const commonMenu = useMemo(
    () => [
      {
        label: <Link to={"/logout"}>Выход</Link>,
        key: v4(),
      },
    ],
    []
  );
  const menuHeader = useMemo(
    () =>
      [
        {
          label: <Link to={"/courses"}>Курсы</Link>,
          key: v4(),
        },
        role === "Student"
          ? {
              label: <SearchPanel />,
              key: v4(),
            }
          : null,
        role === "Teacher"
          ? [
              {
                label: <Link to={"/share"}>Добавить студента</Link>,
                key: v4(),
              },
            ]
          : null,
      ]
        .flat()
        .filter((item) => item !== null),
    [role]
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: "#ffffff",
              itemColor: "#ffffff",
              itemHoverColor: "#ffffff",
              algorithm: true,
            },
          },
        }}
      >
        <Header>
          <Menu
            items={[
              ...(role === "Admin" ? adminMenu : menuHeader),
              ...commonMenu,
            ]}
            mode="horizontal"
            style={{ background: "none" }}
          ></Menu>
        </Header>
      </ConfigProvider>
      <Content style={{ padding: "10px" }}>{children}</Content>
    </Layout>
  );
};

export default AppLayout;
