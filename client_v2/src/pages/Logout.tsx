import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "../redux/store";
import coreReducer from "../redux/core/reducer";

const Logout = () => {
  const [_cookies, _setCookies, removeCookies] = useCookies(["token"]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(coreReducer.actions.RESET_STATE());
    removeCookies("token");
  }, [dispatch, removeCookies]);

  return null;
};

export default Logout;
