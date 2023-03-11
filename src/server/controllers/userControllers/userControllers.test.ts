import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../../database/models/User.js";
import { loginUserErrors, registerUserError } from "../../utils/errors.js";
import statusCodes from "../../utils/statusCodes";
import { type UserRegisterCredentials, type UserCredentials } from "./types.js";
import { loginUser, registerUser } from "./userControllers.js";
import {
  hashedPassword,
  mockUser,
  mockUserId,
  mockUserRegister,
} from "../../mocks/userMocks.js";
import { secret } from "../../../loadEnvironment.js";
import CustomError from "../../../CustomError/CustomError.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a loginUser controller", () => {
  const req = {} as Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >;
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

      req.body = mockUser;

      const token = jwt.sign(mockUserId, secret!);

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockUserId),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({ token });
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

describe("Given a registerUser controller", () => {
  const req = {} as Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >;

  describe("When it receives a request with a user to register correctly", () => {
    test("Then it should call its status method with 200 and its json method with the message `The user has been created`", async () => {
      const expectedMessage = { message: "The user has been created" };
      const expectedStatusCode = 201;

      req.body = mockUserRegister;
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockResolvedValue(mockUserRegister);

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with a user to register without username", () => {
    test("Then it should call its next method with and error message `The user couldn't be created`", async () => {
      const mockUserWithoutUsername = {
        ...mockUserRegister,
        username: "",
      };

      const expectedError = new CustomError(
        "The user couldn't be created",
        409,
        "There was a problem creating the user"
      );

      const error = new Error("The user couldn't be created");

      req.body = mockUserWithoutUsername;
      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with username  `mark4` and password `mark1234` and the username is already taken", () => {
    test("Then it should call its next method with a status code 409 and the message `The username is already in use`", async () => {
      const duplicateError = new Error("duplicate");

      req.body = mockUserRegister;

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockRejectedValue(duplicateError);

      await registerUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(registerUserError.userAlreadyExists);
    });
  });
});
