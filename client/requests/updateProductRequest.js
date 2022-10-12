import axios from "axios";

const updateProductReq = async (slug, name, price, file) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (file) {
      formData.append("coverPhoto", file);
    }
    for (let item of formData.entries()) {
      console.log(item);
    }
    console.log(file);
    return await axios.patch(
      `http://localhost:3001/api/v1/products/update/${slug}`,
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

export default updateProductReq;
