import Cookies from "js-cookie";

const logout = (navigate) => {
  Cookies.remove("token");
  navigate("/login");
};

export default logout;