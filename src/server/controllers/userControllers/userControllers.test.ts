import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../../database/models/User.js";
import { loginUserErrors } from "../../utils/errors.js";
import statusCodes from "../../utils/statusCodes";
import { type UserCredentials } from "./types.js";
import { loginUser } from "./userControllers.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;
const next = jest.fn();

describe("Given a loginUser controller", () => {
  const mockUser: UserCredentials = {
    username: "mark4",
    password: "mark1234",
  };

  describe("When it receives a request with username `mark4` and password `mark1234` and the user is not registered in the database", () => {
    test("Then it shpuld call its next method with status 401 and the message `Wrong credentials`", async () => {
      const expectedError = loginUserErrors.userNotFound;

      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a username `mark4` and password `mark1234` and the user is registered in the database", () => {
    test("Then it should call its status method with 200 and its json method with a token", async () => {
      const expectedStatusCode = statusCodes.success.okCode;
      const mockToken = "sadfh32434jhasdlfkh";

      const expectedBodyResponse = { token: mockToken };
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      await loginUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When it receives a request with a username `mark4` and password `mark1234` and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = loginUserErrors.wrongPassword;

      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the database responds with an error", () => {
    test("Then it should call its next method", async () => {
      const errorDatabase = new Error("error");

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(errorDatabase),
      }));

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(errorDatabase);
    });
  });
});
