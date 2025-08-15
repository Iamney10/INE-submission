import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Bid extends Model {}
Bid.init({
  amount: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'bid' });
