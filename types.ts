import * as dotenv from 'dotenv';
dotenv.config();

export type Config = {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
};
