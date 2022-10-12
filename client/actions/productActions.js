import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  getProductsRequest: ["header", "queryParams"],
  getProductsSuccess: ["products", "result"],
  getProductsFailure: ["error"],
});

export const ProductTypes = Types;
export default Creators;
