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
      style={{ width: 300 }}
      options={coursesList}
      onChange={(value) => {
        navigate({
          pathname: `${location.pathname}${
            location.pathname === "courses" ? `/tests` : ""
          }`,
          search: `?course=${value}`,
        });
      }}
      value={
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
