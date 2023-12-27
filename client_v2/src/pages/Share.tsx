import { Select } from "antd";
import { selectUserId } from "../redux/core/selectors";
import { coursesApiHooks } from "../redux/courses/reducer";
import { useAppSelector } from "../redux/store";
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ShareTable from "../components/ShareTable";
import ChooseMenuPanel from "../components/ChooseMenuPanel";

const Share = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  const teacherId = useAppSelector(selectUserId);

  const { data: coursesList = [] } = coursesApiHooks.useGetCoursesQuery(
    { teacherId },
    { skip: !teacherId }
  );
  return (
    <>
      {coursesList.length ? (
        <ChooseMenuPanel coursesList={coursesList} courseId={courseId} />
      ) : (
        <div>проекты не найдены</div>
      )}
      {courseId && <ShareTable courseId={courseId} />}
    </>
  );
};

export default Share;
