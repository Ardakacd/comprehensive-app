import axios from "axios";

axios.defaults.withCredentials = true;
const logoutReq = async () => {
  try {
    return await axios.post("http://localhost:3001/api/v1/user/logout");
  } catch (error) {
    return error.response;
  }
};

export default logoutReq;
