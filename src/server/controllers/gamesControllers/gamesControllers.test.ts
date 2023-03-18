import { type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";
import { type CustomRequest } from "../../../types";
import { games, mockWitcherGame } from "../../mocks/gamesMocks";
import statusCodes from "../../utils/statusCodes";
import {
  createGame,
  deleteGameById,
  getAllGames,
  getGameById,
  getUserGames,
} from "./gamesControllers";

const {
  success: { okCode, created },
  serverError: { internalServer },
  clientError: { badRequest, notFound },
} = statusCodes;

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<Request> = {
  query: { page: "0" },
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getAllGames controller", () => {
  describe("When it receives a request", () => {
    test("Then it should call its status method with 200 and its json method with games", async () => {
      const expectedStatus = okCode;
      const totalGames = 3;
      const totalNumberPages = 1;

      Game.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalGames),
      }));

      Game.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockReturnValue(games) }),
        }),
      });

      await getAllGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ games, totalNumberPages });
    });
  });

  describe("When it receives a request with a filtration for `Action`", () => {
    test("Then it should call its status method with 200 and its json method with only the games that correspond to `Action` category", async () => {
      const expectedStatus = okCode;
      const totalGames = 3;
      const totalNumberPages = 1;

      req.query!.filter = "Action";

      Game.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalGames),
      }));

      Game.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockReturnValue(games) }),
        }),
      });

      await getAllGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ games, totalNumberPages });
    });
  });

  describe("When it receives a request but the database doesn't respond with games", () => {
    test("Then it should call its next method with an error", async () => {
      const error = new Error("error");

      Game.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockRejectedValue(error) }),
        }),
      });

      await getAllGames(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteGameById controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockWitcherGame.id),
      };
      const req: Partial<CustomRequest> = {
        params: { id: mockWitcherGame.id! },
      };

      const expectedStatus = okCode;

      Game.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockWitcherGame),
      }));

      await deleteGameById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its status method", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockWitcherGame.id),
      };
      const req: Partial<CustomRequest> = {
        params: { id: mockWitcherGame.id! },
      };

      Game.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockWitcherGame),
      }));

      await deleteGameById(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ game: mockWitcherGame });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const req: Partial<CustomRequest> = {};

      req.params = {};

      const expectedError = new CustomError(
        "There was something wrong when deleting the games",
        internalServer,
        "The game could not be deleted"
      );

      Game.findByIdAndDelete = jest.fn().mockReturnValue(undefined);

      await deleteGameById(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createGame controller", () => {
  describe("When it receives a request without a game to create", () => {
    test("Then it should call its next method with an error", async () => {
      const customError = new CustomError(
        "There was a problem creating the game",
        badRequest,
        "Something went wrong"
      );

      req.body = {};

      await createGame(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with a game to create", () => {
    test("Then it should call its status method with 201 and a json with the game created", async () => {
      const expectedStatus = created;
      const gameToCreate = mockWitcherGame;

      req.body = gameToCreate;

      Game.create = jest.fn().mockReturnValue({
        ...gameToCreate,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        toJSON: jest.fn().mockReturnValue(gameToCreate),
      });

      await createGame(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(gameToCreate);
    });
  });
});

describe("Given a getGameById controller", () => {
  const req: Partial<CustomRequest> = {
    params: { gameId: mockWitcherGame.id! },
  };

  describe("When it receives a request with a game id and the user is authorized", () => {
    test("Then it should call its status method with 200 and json method with the game", async () => {
      Game.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockWitcherGame),
      }));

      await getGameById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({ game: mockWitcherGame });
    });
  });

  describe("When it receives a request with a game id and the user is authorized, but there is no game in the database", () => {
    test("Then it should call next with 404 status code and an error", async () => {
      const customError = new CustomError(
        "Game not found",
        notFound,
        "Game not found"
      );
      Game.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await getGameById(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with a game id and the user is authorized, but the database throws an error", () => {
    test("Then it should call next with 500 status code and an error", async () => {
      Game.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(new Error("")),
      }));

      await getGameById(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getUserGames controller", () => {
  const req: Partial<CustomRequest> = {};

  describe("When it receives a request", () => {
    test("Then it should call the status method with 200 and json method of the response", async () => {
      Game.find = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(games),
      }));
      req.id = "11234545";

      await getUserGames(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({ games });
    });
  });

  describe("When it receives a request and the database throws an error", () => {
    test("Then it should call the next method with an error", async () => {
      const customError = new CustomError(
        "Something went wrong",
        badRequest,
        "Something went wrong"
      );

      Game.find = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(undefined),
      }));
      req.id = "11234545";

      await getUserGames(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
