// src/Infrastructure/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
// Validar variables de entorno
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    timezone: '-05:00',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 10000, // 10 seconds
      // useUTC: false, // No uses UTC
      // timezone: 'America/Guayaquil',
    },
    logging: console.log,
  }
);
