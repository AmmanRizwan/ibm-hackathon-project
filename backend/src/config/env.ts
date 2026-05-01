import dotenv from 'dotenv';

dotenv.config();

const { PORT, NODE_ENV, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_TYPE } = process.env;

const config = {
  PORT: PORT,
  ENV: NODE_ENV,
  DB: {
    NAME: DB_NAME,
    USER: DB_USER,
    PASSWORD: DB_PASSWORD,
    HOST: DB_HOST,
    PORT: DB_PORT,
    TYPE: DB_TYPE,
  },
};

export default config;
