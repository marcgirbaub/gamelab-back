import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import { loginUserErrors } from "../../utils/errors.js";
import { type UserRegisterCredentials, type UserCredentials } from "./types.js";
import { type CustomJwtPayload } from "../../../types.js";
import statusCodes from "../../utils/statusCodes.js";
import CustomError from "../../../CustomError/CustomError.js";

const {
  success: { okCode },
} = statusCodes;

const hashingPasswordLength = 10;

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password, username } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      next(loginUserErrors.userNotFound);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      next(loginUserErrors.wrongPassword);
      return;
    }

    const jwtPayload: CustomJwtPayload = {
      id: user._id.toString(),
      username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    res.status(okCode).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, hashingPasswordLength);

    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ message: "The user has been created" });
  } catch (error) {
    const customError = new CustomError(
      "The user couldn't be created",
      409,
      "There was a problem creating the user"
    );

    next(customError);
  }
};
