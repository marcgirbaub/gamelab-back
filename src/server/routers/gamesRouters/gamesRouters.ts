import { Router } from "express";
import { getAllGames } from "../../controllers/gamesControllers/gamesControllers";

const gamesRouter = Router();

gamesRouter.get("/", getAllGames);

export default gamesRouter;
