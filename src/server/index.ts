import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";

export const app = express();

app.disable("x-powered-by");

const corsOptions = {
  origin: [
    "http://localhost:4000",
    "http://localhost:4001",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
