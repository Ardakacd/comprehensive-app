import axios from "axios";

axios.defaults.withCredentials = true;
const loginReq = async (email, password) => {
  try {
    if (email && password) {
      return await axios.post("http://localhost:3001/api/v1/user/login", {
        email,
        password,
      });
    }
  } catch (error) {
    return error.response;
  }
};

export default loginReq;
