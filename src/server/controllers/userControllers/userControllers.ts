import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import { loginUserErrors } from "../../utils/errors.js";
import { type UserCredentials } from "./types.js";
import { type CustomJwtPayload } from "../../../types.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  success: { okCode },
} = statusCodes;

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

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(okCode).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};
