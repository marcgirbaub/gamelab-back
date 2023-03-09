import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase.js";
import User from "../../../database/models/User.js";
import statusCodes from "../../utils/statusCodes.js";
import { app } from "../../app.js";
import { loginUserErrors } from "../../utils/errors.js";
import {
  type UserRegisterCredentials,
  type UserCredentials,
} from "../../controllers/userControllers/types.js";

const { success, clientError } = statusCodes;

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDatabase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST `/users/login` endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser: UserCredentials = {
    username: "mark4",
    password: "mark1234",
  };

  describe("When it receives a request with username `mark4` and password `mark1234`", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property `token`", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "asdfasdfasdfgsadf3242345",
      }));
      const expectedStatus = success.okCode;
      const hashedpassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({
        ...mockUser,
        password: hashedpassword,
        email: "mark@gmail.com",
      });

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with username `mark4` and password `mark1234` that doesn't exist in the database", () => {
    test("Then it should call its next method with a custom error", async () => {
      const expectedError = loginUserErrors.userNotFound;
      const expectedStatus = clientError.unauthorized;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        expectedError.publicMessage
      );
    });
  });
});

describe("Given a POST /users/register endpoint", () => {
  const registerUrl = "/users/register";

  describe("When it receives a request with a user to register properly", () => {
    test("Then it should response with a message `The user has been created`", async () => {
      const newUser: UserRegisterCredentials = {
        username: "mark4",
        password: "mark1234",
        email: "mark@gmail.com",
      };

      const expectedStatus = success.created;

      const response = await request(app)
        .post(registerUrl)
        .send(newUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "message",
        "The user has been created"
      );
    });
  });
});
