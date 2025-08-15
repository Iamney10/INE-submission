import { Sequelize } from 'sequelize';
import { DATABASE_URL, NODE_ENV } from './config.js';

if (!DATABASE_URL) throw new Error('DATABASE_URL missing');

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});
