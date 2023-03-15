import { type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import { type CustomRequest } from "../../../types";
import auth from "./auth";

afterEach(() => jest.clearAllMocks());

const next = jest.fn() as NextFunction;
const res = {} as Response;

describe("Given an auth middleware", () => {
  describe("When called with a req, res and next and the verification of the token rejects", () => {
    test("Then it should call the next method with an error", async () => {
      const req = {
        header: jest.fn().mockReturnValue("Bearer 1234"),
      } as Partial<CustomRequest>;

      const customError = new CustomError(
        "The token is not valid",
        401,
        "Missing token"
      );

      await auth(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When called with a req, res and next", () => {
    test("Then it should add the id property of the token to the request and call the next method without an error", async () => {
      const req = {
        header: jest.fn().mockReturnValue("Bearer 1234wer213423wefdsvwe"),
      } as Partial<CustomRequest>;

      const customError = new CustomError(
        "Missing authorization header",
        401,
        "Missing token"
      );
      const id = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValue({ id });

      await auth(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(customError);
      expect(req).toHaveProperty("id", id);
    });
  });

  describe("When it receives a request without an authorization header", () => {
    test("Then it should call its next method with a 401 status error and a message `Missing token`", async () => {
      const expectedStatusCode = 401;
      const customError = new CustomError(
        "Authorization header missing",
        expectedStatusCode,
        "Missing token"
      );
      const req = {
        header: jest.fn().mockReturnValueOnce(undefined),
      } as Partial<CustomRequest>;

      await auth(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with an authorization header that does not start with `Bearer `", () => {
    test("Then it should call its next method with a 401 status error and a message `Missing token`", async () => {
      const req = {
        header: jest.fn().mockReturnValue("1234"),
      } as Partial<CustomRequest>;
      const expectedStatusCode = 401;
      const customError = new CustomError(
        "Missing bearer in Authorization header",
        expectedStatusCode,
        "Missing token"
      );

      await auth(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
