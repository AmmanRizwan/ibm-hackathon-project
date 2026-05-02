import express, { Request, Response } from 'express';
import cors from "cors";
import env from './config/env';
import cron from "node-cron";

import Router from "./routes";
import { sequelize } from './config/db';
import { logger } from './utils/logger';
import { pinoHttp } from 'pino-http';
import { errorHandler } from './middleware/error';
import { sendReminder } from './utils/reminder';

const pinoLogger = pinoHttp({
  logger,
})

const app = express();
const PORT = env.PORT;

app.use(pinoLogger);
app.use(cors({
  origin: env.CORS.ORIGIN,
  methods: env.CORS.METHODS.split(","),
  credentials: Boolean(env.CORS.CREDENTIAL as string),
  maxAge: parseInt(env.CORS.AGE as string)
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ health: "OK" });
})

app.use("/v1/api", Router);
app.use(errorHandler);

cron.schedule("* * * * *", async () => {
  logger.info("Running task every minute...");
  await sendReminder();
})

sequelize.sync({ alter: env.ENV === "development"})
.then(() => {

  app.listen(PORT, () => {
    logger.info(`Server is running in ${env.ENV} on port: ${PORT}`);
  });
})
.catch((err) => {
  console.error("Error:", err);
})
