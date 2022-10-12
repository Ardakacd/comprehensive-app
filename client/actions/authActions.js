import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  loginRequest: ["email", "password"],
  loginSuccess: ["userId", "username", "email"],
  loginFailure: ["error"],
  registerRequest: ["username", "email", "password"],
  registerSuccess: ["userId", "username", "email"],
  registerFailure: ["error"],
  logoutRequest: null,
  logoutSuccess: null,
  logoutFailure: null,
  userRequest: null,
  userSuccess: ["userId", "username", "email"],
  userFailure: ["error"],
  changePhotoRequest: ["userId", "file"],
  changePhotoSuccess: ["photo"],
  changePhotoFailure: ["error"],
});

export const UserTypes = Types;
export default Creators;
