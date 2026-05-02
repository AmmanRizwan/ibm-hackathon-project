import { Sequelize } from "sequelize";
import env from "../config/env";

const sequelize = new Sequelize(
    env.DB.NAME,
    env.DB.USER,
    env.DB.PASSWORD,
    {
        host: env.DB.HOST as string,
        port: parseInt(env.DB.PORT as string),
        dialect: "postgres"
    }
);

export { sequelize };