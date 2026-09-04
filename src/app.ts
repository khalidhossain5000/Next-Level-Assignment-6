import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import config from "./app/config";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { TechnicianRoutes } from "./app/modules/technicianProfile/technician-profile.route";
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

//auth related route set

app.use("/api/v1/auth",AuthRoutes)


//technician profile


app.use("/api/v1/technician",TechnicianRoutes)







app.use(globalErrorHandler);
app.use(notFound);






export default app;