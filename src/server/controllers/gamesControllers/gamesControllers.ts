import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Game, {
  type GameSchemaStructure,
} from "../../../database/models/Game.js";
import statusCodes from "../../utils/statusCodes.js";
import { type GamesStructure } from "./types.js";
import { type CustomRequest } from "../../../types.js";

const {
  clientError: { badRequest, notFound },
  success: { okCode, created },
  serverError: { internalServer },
} = statusCodes;

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
  let games: GamesStructure;
  let totalGames: number;

  try {
    if (pagination.filter) {
      games = await Game.find({ categories: { $in: pagination.filter } })
        .limit(pagination.limit)
        .skip(pagination.limit * pagination.page)
        .exec();

      totalGames = await Game.countDocuments({
        categories: { $in: pagination.filter },
      }).exec();

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

export const createGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const game = req.body as GameSchemaStructure;
  const { id } = req;
  try {
    const newGame = await Game.create({
      ...game,
      createdBy: id,
    });

    res.status(created).json({ ...newGame.toJSON() });
  } catch (error) {
    const customError = new CustomError(
      "There was a problem creating the game",
      badRequest,
      "Something went wrong"
    );

    next(customError);
  }
};

export const deleteGameById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findByIdAndDelete({
      _id: gameId,
      createdBy: req.id,
    }).exec();

    res.status(okCode).json({ game });
  } catch (error) {
    const customError = new CustomError(
      "There was something wrong when deleting the games",
      internalServer,
      "The game could not be deleted"
    );

    next(customError);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId).exec();

    if (!game) {
      const customError = new CustomError(
        "Game not found",
        notFound,
        "Game not found"
      );

      next(customError);

      return;
    }

    res.status(okCode).json({ game });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      internalServer,
      "Something went wrong"
    );

    next(customError);
  }
};

export const getUserGames = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req;

  try {
    const games = await Game.find({ createdBy: id }).exec();

    res.status(200).json({ games });
  } catch {
    const customError = new CustomError(
      "Something went wrong",
      badRequest,
      "Something went wrong"
    );

    next(customError);
  }
};
