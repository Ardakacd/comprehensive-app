import { createReducer } from "reduxsauce";
import { ProductTypes } from "../actions/productActions";

export const INITIAL_STATE = {
  filteredProducts: null,
  result: 0,
  error: null,
};

export const getProductsRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  console.log("Productlar geldi");
  return { ...state };
};

export const getProductsSuccess = (state = INITIAL_STATE, action) => {
  const { products, result } = action;
  return { filteredProducts: products, error: null, result };
};

export const getProductsFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  return { filteredProducts: null, result: 0, error: error };
};

export const HANDLERS = {
  [ProductTypes.GET_PRODUCTS_REQUEST]: getProductsRequest,
  [ProductTypes.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [ProductTypes.GET_PRODUCTS_FAILURE]: getProductsFailure,
};

export default createReducer(INITIAL_STATE, HANDLERS);
