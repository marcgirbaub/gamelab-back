import "../../../loadEnvironment.js";
import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";

const debug = createDebug("gamelab:server:middlewares:errors");

const {
  clientError: { notFound },
} = statusCodes;

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    "Endpoint not found",
    notFound,
    "Endpoint not found"
  );

  next(error);
};
