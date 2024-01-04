import { useEffect } from "react";
import { useCookies } from "react-cookie";

const Logout = () => {
  const [_cookies, _setCookies, removeCookies] = useCookies(["token"]);

  useEffect(() => {
    removeCookies("token");
  }, [removeCookies]);

  return null;
};

export default Logout;
