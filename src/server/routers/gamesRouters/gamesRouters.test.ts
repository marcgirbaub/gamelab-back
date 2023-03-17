/* eslint-disable @typescript-eslint/restrict-template-expressions */
import "../../../loadEnvironment";
import { secret } from "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import request from "supertest";
import mongoose from "mongoose";
import connectDatabase from "../../../database/connectDatabase";
import statusCodes from "../../utils/statusCodes";
import { app } from "../../app";
import Game from "../../../database/models/Game";
import { mockWitcherGame } from "../../mocks/gamesMocks";
import { mockUserId } from "../../mocks/userMocks";

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

beforeEach(async () => {
  await Game.create(mockWitcherGame);
});

afterEach(async () => {
  await Game.deleteMany();
  jest.clearAllMocks();
});

const user = mockUserId;

const requestToken = jwt.sign(
  {
    id: user._id.toString(),
    username: user.username,
  },
  secret!
);

const gamesUrl = "/games";
const deleteUrl = "/games/delete/";
const createUrl = "/games/create";

describe("Given a GET /games endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 200 and the games requested", async () => {
      const expectedStatus = success.okCode;

      await request(app).get(gamesUrl).expect(expectedStatus);
    });
  });
});

describe("Given a DELETE /games/delete/:gameId endpoint", () => {
  describe("When it receives a request to delete a game", () => {
    test("Then it should call the response method status with 200 and json with the game deleted", async () => {
      const gameToDelete = mockWitcherGame;

      const gamewithCreatedBy = { ...gameToDelete, createdBy: user._id };

      const game = await Game.create(gamewithCreatedBy);

      await request(app)
        .delete(`${deleteUrl}${game._id}`)
        .set("Authorization", `Bearer ${requestToken}`)
        .set("Content-Type", "application/json")
        .expect(success.okCode);
    });
  });
});

describe("Given a POST /games/create endpoint", () => {
  describe("When it receives a request with a game to create but the image is not uploaded properyl", () => {
    test("Then it should respond with status method 400", async () => {
      await request(app)
        .post(createUrl)
        .set("Authorization", `Bearer ${requestToken}`)
        .field("name", "test")
        .field("about", "test")
        .field("ageRating", "test")
        .field("categories", "test")
        .field("categories", "test")
        .field("developer", "test")
        .field("gameplayTime", 2)
        .field("platforms", "test")
        .field("platforms", "test")
        .field("releaseYear", 2)
        .attach("image", Buffer.from("uploads"), {
          filename: "uploadedImage.png",
        })
        .expect(clientError.badRequest);
    });
  });
});
