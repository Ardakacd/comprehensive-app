import { put, takeEvery, all, call } from "redux-saga/effects";
import ProductCreators, { ProductTypes } from "../actions/productActions";
import getProductsRequest from "../requests/getProductsRequest";

function* getProductsSaga({ header, queryParams }) {
  console.log(header);
  console.log(queryParams);

  let { data, status } = yield call(getProductsRequest, header, queryParams);

  if (status === 200) {
    let { products } = data.data;
    let { result } = data;
    console.log("Result");
    console.log(result);
    yield put(ProductCreators.getProductsSuccess(products, result));
  } else {
    console.log(data);
    let { message } = data;
    yield put(ProductCreators.getProductsFailure(message));
  }
}

function* watchGetProductsSaga() {
  yield takeEvery(ProductTypes.GET_PRODUCTS_REQUEST, getProductsSaga);
}

export default function* productSaga() {
  yield all([watchGetProductsSaga()]);
}
