import axios from "axios";

axios.defaults.withCredentials = true;
const registerReq = async (username, email, password) => {
  try {
    if (username && email && password) {
      return await axios.post("http://localhost:3001/api/v1/user/register", {
        username,
        email,
        password,
      });
    }
  } catch (error) {
    return error.response;
  }
};

export default registerReq;
