import CustomError from "../../CustomError/CustomError.js";
import statusCodes from "./statusCodes.js";

const {
  clientError: { unauthorized },
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
