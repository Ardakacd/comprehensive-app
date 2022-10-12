import { combineReducers } from "redux";
import authReducers from "./authReducers";
import filterReducers from "./filterReducers";
import productReducers from "./productReducers";

export default combineReducers({
  user: authReducers,
  filters: filterReducers,
  products: productReducers,
});
