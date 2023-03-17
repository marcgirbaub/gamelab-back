import { supabaseId } from "../../../../loadEnvironment.js";
import { type Response, type NextFunction } from "express";
import fs from "fs/promises";
import { type CustomRequest } from "../../../../types.js";
import supabaseBackup, { supabase } from "./supabaseBackup.js";
import Game from "../../../../database/models/Game.js";

afterEach(async () => {
  jest.clearAllMocks();
});

const file: Partial<Express.Multer.File> = { filename: "image.jpg" };

const mockGame = new Game();
const mockImagePath = "uploads/image.jpg";

const req: Partial<CustomRequest> = {
  body: mockGame,
  file: file as Express.Multer.File,
};
const res = {} as Response;

const next = jest.fn() as NextFunction;

describe("Given a supabaseBackup middleware", () => {
  describe("When called with a request", () => {
    test("Then it should call the next method without error", async () => {
      fs.readFile = jest.fn().mockResolvedValueOnce(mockImagePath);

      supabase.storage.from(supabaseId!).upload = jest.fn();

      supabase.storage.from(supabaseId!).getPublicUrl = jest
        .fn()
        .mockReturnValueOnce({
          data: { publicUrl: mockImagePath },
        });

      await supabaseBackup(req as CustomRequest, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When called with an invalid request", () => {
    test("Then it should call next", async () => {
      const req: Partial<CustomRequest> = {};

      await supabaseBackup(req as CustomRequest, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
