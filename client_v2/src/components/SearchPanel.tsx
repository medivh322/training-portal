import { Select } from "antd";
import { coursesApiHooks } from "../redux/courses/reducer";
import { useNavigate } from "react-router-dom";

const SearchPanel = () => {
  const [search, { data = [] }] = coursesApiHooks.useSearchCoursesMutation();
  const navigate = useNavigate();

  const handleChange = (newValue: string) => {
    navigate({
      pathname: "courses/tests",
      search: "?course=" + newValue,
    });
  };

  return (
    <Select
      allowClear
      notFoundContent={null}
      filterOption={false}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      options={
        typeof data !== "undefined"
          ? data.map((d) => ({
              value: d.value,
              label: d.label,
            }))
          : []
      }
      showSearch
      onChange={(value) => typeof value !== "undefined" && handleChange(value)}
      onSearch={(value) => {
        typeof value !== "undefined" && search({ query: value });
      }}
      style={{ width: 500 }}
    />
  );
};

export default SearchPanel;
