import { type Request, type Response } from "express";
import Game from "../../../database/models/Game";
import { games } from "../../../mocks/gamesMocks";
import statusCodes from "../../utils/statusCodes";
import { getAllGames } from "./gamesControllers";

const {
  success: { okCode },
  serverError: { internalServer },
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

      Game.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockReturnValue(games) }),
        }),
      });

      await getAllGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ games });
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
