import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  CORS_ORIGIN,
  CORS_METHODS,
  CORS_CREDENTIAL,
  CORS_AGE,
  SMTP_NAME,
  SMTP_EMAIL,
  SMTP_PORT,
  SMTP_HOST,
  SMTP_SECURE,
  JWT_SECRET
} = process.env;

if (!PORT) {
  throw new Error("'PORT' is not set!");
}

if (!NODE_ENV) {
  throw new Error("'NODE_ENV' is not set!");
}

if (!DB_NAME) {
  throw new Error("'DB_NAME' is not set!");
}

if (!DB_USER) {
  throw new Error("'DB_USER' is not set!");
}

if (!DB_PASSWORD) {
  throw new Error("'DB_PASSWORD' is not set!");
}

if (!DB_HOST) {
  throw new Error("'DB_HOST' is not set!");
}

if (!DB_PORT) {
  throw new Error("'DB_PORT' is not set!");
}

if (!CORS_ORIGIN) {
  throw new Error("'CORS_ORIGIN' is not set!");
}

if (!CORS_METHODS) {
  throw new Error("'CORS_METHODS' is not set!");
}

if (!CORS_CREDENTIAL) {
  throw new Error("'CORS_CREDENIAL' is not set!");
}

if (!CORS_AGE) {
  throw new Error("'CORS_AGE' is not set!");
}

if (!SMTP_NAME) {
  throw new Error("'SMTP_NAME' is not set!");
}

if (!SMTP_EMAIL) {
  throw new Error("'SMTP_EMAIL' is not set!");
}

if (!SMTP_PORT) {
  throw new Error("'SMTP_PORT' is not set!");
}

if (!SMTP_HOST) {
  throw new Error("'SMTP_HOST' is not set!");
}

if (!SMTP_SECURE) {
  throw new Error("'SMTP_SECURE' is not set!");
}

if (!JWT_SECRET) {
  throw new Error("'JWT_SECRET' is not set!");
}

const config = {
  PORT: PORT,
  ENV: NODE_ENV,
  DB: {
    NAME: DB_NAME,
    USER: DB_USER,
    PASSWORD: DB_PASSWORD,
    HOST: DB_HOST,
    PORT: DB_PORT,
  },
  CORS: {
    ORIGIN: CORS_ORIGIN,
    METHODS: CORS_METHODS,
    AGE: CORS_AGE,
    CREDENTIAL: CORS_CREDENTIAL
  },
  SMTP: {
    NAME: SMTP_NAME,
    EMAIL: SMTP_EMAIL,
    PORT: SMTP_PORT,
    HOST: SMTP_HOST,
    SECURE: SMTP_SECURE
  },
  JWT: {
    SECRET: JWT_SECRET
  }
};

export default config;
