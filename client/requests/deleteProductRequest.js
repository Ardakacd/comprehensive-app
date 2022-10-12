import axios from "axios";

const deleteProductReq = async (slug) => {
  try {
    return await axios.delete(
      `http://localhost:3001/api/v1/products/delete/${slug}`
    );
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export default deleteProductReq;
