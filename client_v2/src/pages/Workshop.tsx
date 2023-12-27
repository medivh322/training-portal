import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import { v4 } from "uuid";
import { coreApiHooks } from "../redux/core/reducer";
import { useAppSelector } from "../redux/store";
import { selectRole } from "../redux/core/selectors";

const PersonalArea = () => {
  const role = useAppSelector(selectRole);
  const personalSidebarMenu = useMemo(
    () =>
      role === "Teacher"
        ? [
            {
              label: (
                <Link reloadDocument to={"courses"}>
                  Курсы
                </Link>
              ),
              key: v4(),
            },
            {
              label: <Link to={"share"}>Добавить студента</Link>,
              key: v4(),
            },
          ]
        : role === "Student"
        ? [
            {
              label: <Link to={"courses"}>Курсы</Link>,
              key: v4(),
            },
          ]
        : [
            {
              label: <Link to={"reg"}>Регистрация</Link>,
              key: v4(),
            },
          ],
    [role]
  );
  return (
    <Layout>
      <Sider>
        <Menu items={personalSidebarMenu} />
      </Sider>
      <Content style={{ padding: 10 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default PersonalArea;
