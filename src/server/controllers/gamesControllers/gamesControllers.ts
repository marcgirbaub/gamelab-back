import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pagination = {
    limit: 6,
    page: +req.query.page! || 0,
  };
  let games;

  try {
    games = await Game.find()
      .limit(pagination.limit)
      .skip(pagination.limit * pagination.page)
      .exec();

    res.status(200).json({ games });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "There was an error"
    );

    next(customError);
  }
};
