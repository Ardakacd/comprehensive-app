import { put, takeEvery, all, call } from "redux-saga/effects";
import UserCreators, { UserTypes } from "../actions/authActions";
import loginRequest from "../requests/loginRequest";
import registerRequest from "../requests/registerRequest";
import logoutRequest from "../requests/logoutRequest";
import getUserRequest from "../requests/getUserRequest";
import changePhotoRequest from "../requests/changePhotoRequest";

function* loginSaga({ email, password }) {
  const { data, status } = yield call(loginRequest, email, password);
  if (status === 200) {
    let { user } = data.data;
    let { _id, username, email } = user;
    yield put(UserCreators.loginSuccess(_id, username, email));
    window.location.href = "http://localhost:3000";
  } else {
    console.log(data);
    let { message } = data;
    yield put(UserCreators.loginFailure(message));
  }
}

function* watchLoginSaga() {
  yield takeEvery(UserTypes.LOGIN_REQUEST, loginSaga);
}

function* registerSaga({ username, email, password }) {
  const { data, status } = yield call(
    registerRequest,
    username,
    email,
    password
  );
  console.log("Status:" + status);
  if (status === 201) {
    let { user } = data.data;
    let { _id, username, email } = user;
    yield put(UserCreators.registerSuccess(_id, username, email));
    window.location.href = "http://localhost:3000";
  } else {
    let { message } = data;
    yield put(UserCreators.registerFailure(message));
  }
}

function* watchRegisterSaga() {
  yield takeEvery(UserTypes.REGISTER_REQUEST, registerSaga);
}

function* logoutSaga() {
  const { data, status } = yield call(logoutRequest);
  console.log("Status:" + status);

  if (status === 200) {
    yield put(UserCreators.logoutSuccess());
  } else {
    let { message } = data;
    yield put(UserCreators.logoutFailure());
  }
}

function* watchLogoutSaga() {
  yield takeEvery(UserTypes.LOGOUT_REQUEST, logoutSaga);
}

function* getUserSaga() {
  const { data, status } = yield call(getUserRequest);
  console.log(data);
  console.log(status);
  if (status === 200) {
    let { user } = data.data;
    let { _id, username, email } = user;
    yield put(UserCreators.userSuccess(_id, username, email));
  } else {
    console.log(data);
    let { message } = data;
    yield put(UserCreators.userFailure(message));
  }
}

function* watchGetUserSaga() {
  yield takeEvery(UserTypes.USER_REQUEST, getUserSaga);
}

function* changePhotoSaga({ userId, file }) {
  console.log(userId);
  console.log(file);
  const { data, status } = yield call(changePhotoRequest, userId, file);
  console.log(data);
  console.log(status);
  if (status === 200) {
    let { filename } = data.data;
    yield put(UserCreators.changePhotoSuccess(filename));
  } else {
    console.log(data);
    let { message } = data;
    yield put(UserCreators.changePhotoFailure(message));
  }
}

function* watchPhotoSaga() {
  yield takeEvery(UserTypes.CHANGE_PHOTO_REQUEST, changePhotoSaga);
}
export default function* authSaga() {
  yield all([
    watchLoginSaga(),
    watchRegisterSaga(),
    watchLogoutSaga(),
    watchGetUserSaga(),
    watchPhotoSaga(),
  ]);
}
