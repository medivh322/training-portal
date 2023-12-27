import { Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const ChooseMenuPanel: React.FC<{
  coursesList: { value: string; label: string }[];
  courseId: string | null;
}> = ({ coursesList, courseId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return coursesList.length ? (
    <Select
      style={{ width: 300, marginRight: 20 }}
      options={coursesList}
      onChange={(value) => {
        navigate({
          pathname: `${location.pathname}${
            location.pathname === "/workshop/courses" ? `/tests` : ""
          }`,
          search: `?course=${value}`,
        });
      }}
      defaultValue={
        courseId
          ? coursesList.find((elem) => elem.value === courseId)?.value
          : "выберите нужный курс"
      }
    />
  ) : (
    <div>проекты не найдены</div>
  );
};

export default ChooseMenuPanel;
