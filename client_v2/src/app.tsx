import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useMatches,
} from "react-router-dom";
import { coreApiHooks } from "./redux/core/reducer";
import LoginPage from "./pages/Login";
import { ConfigProvider, Spin, notification } from "antd";
import AppLayout from "./layout/AppLayout";
import Courses from "./components/Courses";
import Tests from "./pages/Tests";
import Logout from "./pages/Logout";
import Share from "./pages/Share";
import Reg from "./pages/Reg";
import { selectLoadingScreen, selectRole } from "./redux/core/selectors";
import { useAppSelector } from "./redux/store";
import { Role } from "./types/models";
import CoursesStudent from "./pages/CoursesStudent";
import TestsStudent from "./pages/TestsStudent";
import PassingTest from "./pages/PassingTest";
import Results from "./pages/Results";
import Materials from "./pages/Materials";
import { isUndefined } from "lodash";
import { useEffect, useMemo } from "react";
import { useCookies, withCookies } from "react-cookie";

const loggenInRouter = (role: Role | null) => (
  <Route path="/" element={<Root />}>
    {role === "Teacher" && (
      <>
        <Route path="courses" element={<Courses />}>
          <Route index path="tests" element={<Tests />} />
          <Route path="results" element={<Results />} />
          <Route path="materials" element={<Materials />} />
        </Route>
        <Route path="share" element={<Share />} />
        <Route index element={<Navigate to="courses" />} />
      </>
    )}
    {role === "Student" && (
      <>
        <Route path="passing-test" element={<PassingTest />} />
        <Route path="courses" element={<CoursesStudent />}>
          <Route path="tests" element={<TestsStudent />} />
          <Route path="results" element={<Results />} />
          <Route path="materials" element={<Materials />} />
        </Route>
        <Route index element={<Navigate to="courses" />} />
      </>
    )}
    {role === "Admin" && (
      <>
        <Route index path="reg" element={<Reg />} />
        <Route index element={<Navigate to="reg" />} />
      </>
    )}
    <Route path="login" element={<Navigate to="/" />} />
    <Route path="logout" element={<Logout />} />
    <Route
      path="*"
      handle={false}
      element={<div>404, такой страницы нет</div>}
    />
  </Route>
);

const noLoggenRouter = (
  <Route element={<RootNoLoggen />}>
    <Route path="login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="login" />} />
  </Route>
);

const App = () => {
  const role = useAppSelector(selectRole);
  const isLoadingFullScreen = useAppSelector(selectLoadingScreen);

  const [api, contextHolder] = notification.useNotification();

  const [token] = useCookies(["token"]);

  const { isFetching: fetchingCheckToken, isError } =
    coreApiHooks.useCheckTokenQuery(null, {
      skip: isUndefined(token.token),
    });

  useEffect(() => {
    if (isError) {
      api.error({
        message: "Ошибка проверки токена",
      });
    }
  }, [api, isError]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          !isError && !isUndefined(token.token) && role
            ? loggenInRouter(role)
            : noLoggenRouter
        )
      ),
    [isError, role, token.token]
  );

  console.log(role);

  if (fetchingCheckToken || isLoadingFullScreen)
    return <Spin spinning fullscreen />;

  return (
    <>
      <RouterProvider router={router} />
      {contextHolder}
    </>
  );
};

function Root() {
  const matches = useMatches();

  if (
    !matches[matches.length - 1].handle &&
    typeof matches[matches.length - 1].handle !== "undefined"
  )
    return <Outlet />;

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#001F3F",
            siderBg: "#CCCCCC",
            bodyBg: "#FFFFFF",
          },
        },
      }}
    >
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ConfigProvider>
  );
}

function RootNoLoggen() {
  return <Outlet />;
}

export default withCookies(App);
