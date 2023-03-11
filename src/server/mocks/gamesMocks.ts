import { type Game, type Games } from "../controllers/gamesControllers/types";

export const mockWitcherGame: Game = {
  name: "The Witcher",
  about: "This is an adventure game",
  ageRating: "17 +",
  backupImage: "thewitcher.jpg",
  categories: ["Adventure", "Action"],
  developer: "EA games",
  gameplayTime: 60,
  platforms: ["Playstation"],
  releaseYear: 2015,
};

export const games: Games = [mockWitcherGame];
