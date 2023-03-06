import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import { notFoundError } from "./errors";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req = {} as Request;
const next: NextFunction = jest.fn();

describe("Given a noutFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method with a status code 404, and message and public message `Endpoint not found`", () => {
      const expectedError = new CustomError(
        "Endpoint not found",
        404,
        "Endpoint not found"
      );

      notFoundError(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
