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
import { ConfigProvider, Spin } from "antd";
import AppLayout from "./layout/AppLayout";
import Workshop from "./pages/Workshop";
import Courses from "./components/Courses";
import Tests from "./pages/Tests";
import Logout from "./pages/Logout";
import Share from "./pages/Share";
import ShareTable from "./components/ShareTable";
import Reg from "./pages/Reg";
import { selectRole } from "./redux/core/selectors";
import { useAppSelector } from "./redux/store";
import { Role } from "./types/models";
import CoursesStudent from "./pages/CoursesStudent";
import TestsStudent from "./pages/TestsStudent";
import PassingTest from "./pages/PassingTest";
import Results from "./pages/Results";
import Materials from "./pages/Materials";

const loggenInRouter = (role: Role | null) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route path="workshop" element={<Workshop />}>
          {role === "Teacher" ? (
            <>
              <Route path="courses" handle={"courses"} element={<Courses />}>
                <Route handle={"tests"} path="tests" element={<Tests />} />
                <Route
                  handle={"results"}
                  path="results"
                  element={<Results />}
                />
                <Route
                  handle={"materials"}
                  path="materials"
                  element={<Materials />}
                />
              </Route>
              <Route path="share" element={<Share />} />
            </>
          ) : role === "Admin" ? (
            <>
              <Route path="reg" element={<Reg />} />
            </>
          ) : (
            <>
              <Route path="passing-test" element={<PassingTest />} />
              <Route
                path="courses"
                handle={"courses"}
                element={<CoursesStudent />}
              >
                <Route
                  handle={"tests"}
                  path="tests"
                  element={<TestsStudent />}
                />
                <Route
                  handle={"results"}
                  path="results"
                  element={<Results />}
                />
                <Route
                  handle={"materials"}
                  path="materials"
                  element={<Materials />}
                />
              </Route>
            </>
          )}
        </Route>
        <Route path="login" element={<Navigate to="/" />} />
        <Route path="logout" element={<Logout />} />
        <Route
          path="*"
          handle={false}
          element={<div>404, такой страницы нет</div>}
        />
      </Route>
    )
  );

const noLoggenRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootNoLoggen />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Route>
  )
);

const App = () => {
  const api = coreApiHooks.useCheckAuthUserQuery();
  const role = useAppSelector(selectRole);

  if (api.isFetching) return <Spin spinning={api.isFetching} fullscreen />;

  return (
    <RouterProvider
      router={!api.isError ? loggenInRouter(role) : noLoggenRouter}
    />
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

export default App;
