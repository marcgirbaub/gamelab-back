import { Router } from "express";
import crypto from "crypto";
import path from "path";
import multer from "multer";
import {
  createGame,
  getAllGames,
} from "../../controllers/gamesControllers/gamesControllers.js";
import routes from "../routes.js";

const { games } = routes;

const gamesRouter = Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename(req, file, callback) {
    const suffix = crypto.randomUUID();

    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);

    const filename = `${basename}-${suffix}${extension}`;

    callback(null, filename);
  },
});

const upload = multer({ storage });

gamesRouter.get("/", getAllGames);

gamesRouter.post(games.create, upload.single("backupImage"), createGame);

export default gamesRouter;
