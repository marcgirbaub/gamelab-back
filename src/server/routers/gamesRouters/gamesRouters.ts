import { Router } from "express";
import { getAllGames } from "../../controllers/gamesControllers/gamesControllers.js";

const gamesRouter = Router();

gamesRouter.get("/", getAllGames);

export default gamesRouter;
