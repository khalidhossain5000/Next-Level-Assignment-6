import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import config from "./app/config";
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




app.use(globalErrorHandler);
app.use(notFound);






export default app;