import authSaga from "./authSaga";
import productSaga from "./productSaga";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([authSaga(), productSaga()]);
}
