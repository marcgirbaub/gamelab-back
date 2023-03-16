import { type Response, type NextFunction } from "express";
import fs from "fs/promises";
import CustomError from "../../../CustomError/CustomError";
import { type CustomRequest } from "../../../types";
import { mockWitcherGame } from "../../mocks/gamesMocks";
import statusCodes from "../../utils/statusCodes";
import optimizing from "./optimizing";

const { badRequest } = statusCodes.clientError;

beforeEach(() => jest.clearAllMocks());

let mockImageFile = jest.fn();

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({ toFile: mockImageFile }),
    }),
  }),
}));

const next = jest.fn() as NextFunction;

const res = {} as Response;

const file: Partial<Express.Multer.File> = {
  filename: "leagueoflegends",
  originalname: "leagueoflegends.jpg",
};

const req: Partial<CustomRequest> = {
  body: mockWitcherGame,
};

beforeAll(async () => {
  await fs.writeFile("uploads/leagueoflegends", "leagueoflegends");
});

afterAll(async () => {
  await fs.unlink("uploads/leagueoflegends");
});

describe("Given an optimizing middleware", () => {
  describe("When it receives a request with an image", () => {
    test("Then it should call its next method and put the optimized image to the request", async () => {
      const expectedImageName = "leagueoflegends.webp";
      req.file = file as Express.Multer.File;

      await optimizing(req as CustomRequest, res, next);

      expect(req.file.filename).toBe(expectedImageName);
    });
  });

  describe("When it receives a request without an image", () => {
    test("Then it should call its next method with an error", async () => {
      const newError = new CustomError(
        "Error optimizing the provided image",
        badRequest,
        "Error optimizing the provided image"
      );

      mockImageFile = jest.fn().mockRejectedValue(undefined);

      await optimizing(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
