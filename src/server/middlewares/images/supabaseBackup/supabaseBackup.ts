import {
  supabaseId,
  supabaseKey,
  supabaseUrl,
} from "../../../../loadEnvironment.js";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../../../types.js";

export const supabase = createClient(supabaseUrl!, supabaseKey!);

const supabaseBackup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const gameImage = req.file?.filename;

    const imagePath = path.join("uploads", gameImage!);

    const backupImage = await fs.readFile(imagePath);
    await supabase.storage.from(supabaseId!).upload(gameImage!, backupImage);

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseId!).getPublicUrl(gameImage!);

    req.body.image = imagePath;
    req.body.backupImage = publicUrl;

    next();
  } catch (error) {
    next(error);
  }
};

export default supabaseBackup;
