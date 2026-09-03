import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
const app: Application = express();

//cors setup
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
//default middleware setup

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//default get
app.get("/", (req: Request, res: Response) => {
  res.send("Next level assignment 6 and Load Shedding & Power Management server is running");
});

export default app;