import axios from "axios";

const addCommentReq = async (title, description, productId, userId) => {
  try {
    return await axios.post(
      `http://localhost:3001/api/v1/products/${productId}/review`,
      {
        title,
        description,
        user: userId,
        rating: 4,
      }
    );
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export default addCommentReq;
