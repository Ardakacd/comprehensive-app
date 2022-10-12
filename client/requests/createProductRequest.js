import axios from "axios";

const createProductReq = async (name, price, file) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (file) {
      formData.append("coverPhoto", file);
    }

    return await axios.post(
      "http://localhost:3001/api/v1/products/add",

      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export default createProductReq;
