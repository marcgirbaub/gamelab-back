import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import statusCodes from "../../utils/statusCodes";
import { generalError, notFoundError } from "./errors";

const {
  clientError: { notFound },
  serverError: { internalServer },
} = statusCodes;

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req = {} as Request;
const next: NextFunction = jest.fn();

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method with a status code 404, and message and public message `Endpoint not found`", () => {
      const expectedError = new CustomError(
        "Endpoint not found",
        notFound,
        "Endpoint not found"
      );

      notFoundError(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives a custom error with message `There was a problem`, a status code 404 and a public message `Seomthing went wrong`", () => {
    test("Then it should call the response's status method with 404 and json method with the public message received", () => {
      const error = new CustomError(
        "There was a problem",
        notFound,
        "Something went wrong"
      );

      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(notFound);
      expect(res.json).toHaveBeenCalledWith({ error: error.publicMessage });
    });
  });

  describe("When the error received is not a custom error", () => {
    test("Then it should call response's status method with 500 and the publicMessage `Something went wrong`", () => {
      const error = new Error();
      const expectedPublicMessage = "Something went wrong";

      generalError(error as CustomError, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(internalServer);
      expect(res.json).toHaveBeenCalledWith({ error: expectedPublicMessage });
    });
  });
});
