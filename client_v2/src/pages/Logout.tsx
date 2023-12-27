import { Navigate } from "react-router-dom";
import { coreApiHooks } from "../redux/core/reducer";
import { useEffect } from "react";

const Logout = () => {
  const [logout] = coreApiHooks.useLogoutMutation();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to={"/"} />;
};

export default Logout;
