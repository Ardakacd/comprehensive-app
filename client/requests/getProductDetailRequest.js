import axios from "axios";

const getProductDetailReq = async (slug) => {
  try {
    return await axios.get(`http://localhost:3001/api/v1/products/${slug}`);
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export default getProductDetailReq;
