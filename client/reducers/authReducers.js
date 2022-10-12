import { createReducer } from "reduxsauce";
import { UserTypes } from "../actions/authActions";

export const INITIAL_STATE = {
  userId: null,
  username: null,
  email: null,
  photo: "unknown.png",
  loginError: false,
  registerError: false,
  logoutError: false,
  getUserError: false,
  changePhotoError: false,
};

export const loginRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  return { ...state };
};

export const loginSuccess = (state = INITIAL_STATE, action) => {
  const { userId, username, email } = action;
  return { ...state, userId, username, email, loginError: null };
};

export const loginFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  console.log("Errorr log");
  console.log(error);
  return { ...state, loginError: error };
};

export const registerRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  return { ...state };
};

export const registerSuccess = (state = INITIAL_STATE, action) => {
  const { userId, username, email } = action;
  return { ...state, userId, username, email, registerError: null };
};

export const registerFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  return { ...state, registerError: error };
};

export const logoutRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  return { ...state };
};

export const logoutSuccess = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    userId: null,
    username: null,
    email: null,
    logoutError: false,
    photo: "unknown.png",
  };
};

export const logoutFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  return { ...state, logoutError: error };
};

export const userRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  return { ...state };
};

export const userSuccess = (state = INITIAL_STATE, action) => {
  const { userId, username, email } = action;
  return { ...state, userId, username, email, getUserError: null };
};

export const userFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  return { ...state, getUserError: error };
};

export const changePhotoRequest = (state = INITIAL_STATE, action) => {
  // spinnner ekle;
  return { ...state };
};

export const changePhotoSuccess = (state = INITIAL_STATE, action) => {
  const { photo } = action;
  return { ...state, photo, changePhotoError: null };
};

export const changePhotoFailure = (state = INITIAL_STATE, action) => {
  const { error } = action;
  return { ...state, changePhotoError: error };
};

export const HANDLERS = {
  [UserTypes.LOGIN_REQUEST]: loginRequest,
  [UserTypes.LOGIN_SUCCESS]: loginSuccess,
  [UserTypes.LOGIN_FAILURE]: loginFailure,
  [UserTypes.REGISTER_REQUEST]: registerRequest,
  [UserTypes.REGISTER_SUCCESS]: registerSuccess,
  [UserTypes.REGISTER_FAILURE]: registerFailure,
  [UserTypes.LOGOUT_REQUEST]: logoutRequest,
  [UserTypes.LOGOUT_SUCCESS]: logoutSuccess,
  [UserTypes.LOGOUT_FAILURE]: logoutFailure,
  [UserTypes.USER_REQUEST]: userRequest,
  [UserTypes.USER_SUCCESS]: userSuccess,
  [UserTypes.USER_FAILURE]: userFailure,
  [UserTypes.CHANGE_PHOTO_REQUEST]: changePhotoRequest,
  [UserTypes.CHANGE_PHOTO_SUCCESS]: changePhotoSuccess,
  [UserTypes.CHANGE_PHOTO_FAILURE]: changePhotoFailure,
};

export default createReducer(INITIAL_STATE, HANDLERS);
