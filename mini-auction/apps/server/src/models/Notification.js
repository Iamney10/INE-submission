import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Notification extends Model {}
Notification.init({
  type: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSONB },
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize, modelName: 'notification' });
