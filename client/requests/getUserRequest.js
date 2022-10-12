import axios from "axios";

axios.defaults.withCredentials = true;
const getUserReq = async () => {
  try {
    return await axios.get("http://localhost:3001/api/v1/user/me");
  } catch (error) {
    return error.response;
  }
};

export default getUserReq;
