import { Router } from "express";
import crypto from "crypto";
import path from "path";
import multer from "multer";
import {
  createGame,
  deleteGameById,
  getAllGames,
  getGameById,
  getUserGames,
} from "../../controllers/gamesControllers/gamesControllers.js";
import routes from "../routes.js";
import { validate } from "express-validation";
import createGameSchema from "../../schemas/Game/createGameSchema.js";
import auth from "../../middlewares/auth/auth.js";
import supabaseBackup from "../../middlewares/images/supabaseBackup/supabaseBackup.js";
import optimizing from "../../middlewares/images/optimizing/optimizing.js";

const { games } = routes;

const gamesRouter = Router();

const multerConfig = {
  storage: multer.diskStorage({
    destination: "uploads",
    filename(req, file, callback) {
      const suffix = crypto.randomUUID();

      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);

      const filename = `${basename}-${suffix}${extension}`;

      callback(null, filename);
    },
  }),
};

const upload = multer({ ...multerConfig, limits: { fileSize: 8000000 } });

gamesRouter.get("/", getAllGames);
gamesRouter.get(games.mygames, auth, getUserGames);
gamesRouter.delete(games.delete, auth, deleteGameById);
gamesRouter.get(games.detail, auth, getGameById);
gamesRouter.post(
  games.create,
  auth,
  upload.single("image"),
  validate(createGameSchema, {}, { abortEarly: false }),
  optimizing,
  supabaseBackup,
  createGame
);

export default gamesRouter;
