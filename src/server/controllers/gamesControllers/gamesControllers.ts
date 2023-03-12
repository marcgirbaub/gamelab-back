import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Game from "../../../database/models/Game.js";
import { type Games } from "./types.js";

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pagination = {
    limit: 6,
    page: +req.query.page! || 0,
    filter: req.query.filter,
  };
  let games: Games;
  let totalGames: number;

  try {
    if (pagination.filter) {
      games = await Game.find({ categories: { $in: pagination.filter } })
        .limit(pagination.limit)
        .skip(pagination.limit * pagination.page)
        .exec();

      totalGames = await Game.countDocuments().exec();

      const totalNumberPages = Math.ceil(totalGames / pagination.limit);

      res.status(200).json({ games, totalNumberPages });
    } else {
      games = await Game.find()
        .limit(pagination.limit)
        .skip(pagination.limit * pagination.page)
        .exec();

      totalGames = await Game.countDocuments().exec();

      const totalNumberPages = Math.ceil(totalGames / pagination.limit);

      res.status(200).json({ games, totalNumberPages });
    }
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "There was an error"
    );

    next(customError);
  }
};
