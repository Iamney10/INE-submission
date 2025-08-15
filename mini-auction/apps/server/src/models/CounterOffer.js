import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class CounterOffer extends Model {}
CounterOffer.init({
  price: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending','accepted','rejected'), defaultValue: 'pending' }
}, { sequelize, modelName: 'counter_offer' });
