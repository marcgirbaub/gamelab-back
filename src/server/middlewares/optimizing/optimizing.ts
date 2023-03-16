import { type NextFunction, type Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../CustomError/CustomError.js";
import { type CustomRequest } from "../../../types.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  clientError: { badRequest },
} = statusCodes;

const optimizing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const originalname = req.file?.originalname;
  const filename = req.file?.filename;

  const basePath = `${path.basename(
    originalname!,
    path.extname(originalname!)
  )}`;

  try {
    await sharp(path.join("uploads", filename!))
      .resize(200, 280, { fit: "cover" })
      .webp({ quality: 100 })
      .toFormat("webp")
      .toFile(path.join("uploads", `${basePath}.webp`));

    req.file!.originalname = `${basePath}.webp`;
    req.file!.filename = `${basePath}.webp`;

    next();
  } catch (error) {
    const newError = new CustomError(
      "Error optimizing the provided image",
      badRequest,
      "Error optimizing the provided image"
    );
    next(newError);
  }
};

export default optimizing;
