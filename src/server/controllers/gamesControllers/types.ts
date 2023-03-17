export interface GameStructure {
  name: string;
  id?: string;
  image: string;
  backupImage?: string;
  about: string;
  platforms: string[];
  categories: string[];
  gameplayTime: number;
  releaseYear: number;
  developer: string;
  ageRating: string;
}

export interface GameFormData {
  name: string;
  image: unknown;
  about: string;
  platforms: string[];
  categories: string[];
  gameplayTime: number;
  releaseYear: number;
  developer: string;
  ageRating: string;
}

export type GamesStructure = GameStructure[];
