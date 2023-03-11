import { type Games } from "../server/controllers/gamesControllers/types";

export const games: Games = [
  {
    name: "The Witcher",
    about: "This is an adventure game",
    ageRating: "17 +",
    backupImage: "thewitcher.jpg",
    categories: ["Adventure", "Action"],
    developer: "EA games",
    gameplayTime: 60,
    platforms: ["Playstation"],
    releaseYear: 2015,
  },
];
