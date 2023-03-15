import { secret } from "../../../loadEnvironment.js";
import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError";
import { type CustomJwtPayload, type CustomRequest } from "../../../types";
import statusCodes from "../../utils/statusCodes";

const {
  clientError: { unauthorized },
} = statusCodes;

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const customError = new CustomError(
        "Authorization header missing",
        unauthorized,
        "Missing token"
      );
      next(customError);

      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const customError = new CustomError(
        "Missing bearer in Authorization header",
        unauthorized,
        "Missing token"
      );

      next(customError);

      return;
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const { id } = jwt.verify(token, secret!) as CustomJwtPayload;

    req.id = id;

    next();
  } catch (error: unknown) {
    const invalidTokenError = new CustomError(
      "The token is not valid",
      401,
      "Invalid token"
    );

    next(invalidTokenError);
  }
};

export default auth;
