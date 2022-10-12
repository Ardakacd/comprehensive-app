import axios from "axios";

const getProductsReq = async (header, queryParams = "?") => {
  try {
    if (!(queryParams === "?")) {
      if (!queryParams.trim().endsWith("&")) {
        queryParams = queryParams.concat("&");
      }
    }
    queryParams = queryParams.concat("page=1&limit=10");

    console.log(queryParams);

    if (header) {
      return await axios.get(
        `http://localhost:3001/api/v1/products${queryParams}`,
        {
          headers: header,
        }
      );
    } else {
      return await axios.get(
        `http://localhost:3001/api/v1/products${queryParams}`
      );
    }
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export default getProductsReq;
