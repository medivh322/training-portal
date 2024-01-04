import { ConfigProvider, Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { FC, ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import SearchPanel from "../components/SearchPanel";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const menuHeader = useMemo(
    () => [
      {
        label: <Link to={"/workshop"}>Рабочая среда</Link>,
        key: v4(),
      },
      {
        label: <Link to={"/logout"}>Выход</Link>,
        key: v4(),
      },
      {
        label: <SearchPanel />,
        key: v4(),
      },
    ],
    []
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
            items={menuHeader}
            mode="horizontal"
            style={{ background: "none" }}
          ></Menu>
        </Header>
      </ConfigProvider>
      {children}
    </Layout>
  );
};

export default AppLayout;
