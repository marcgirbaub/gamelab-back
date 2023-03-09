import CustomError from "../../CustomError/CustomError.js";
import statusCodes from "./statusCodes.js";

const {
  clientError: { unauthorized, conflict },
} = statusCodes;

export const loginUserErrors = {
  userNotFound: new CustomError(
    "Username not found",
    unauthorized,
    "Wrong credentials"
  ),
  wrongPassword: new CustomError(
    "Wrong password",
    unauthorized,
    "Wrong credentials"
  ),
};

export const registerUserError = {
  userAlreadyExists: new CustomError(
    "The user already exists",
    conflict,
    "The username is already in use"
  ),
};
