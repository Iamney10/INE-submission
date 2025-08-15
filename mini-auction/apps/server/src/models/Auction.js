import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Auction extends Model {}
Auction.init({
  itemName: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startingPrice: { type: DataTypes.INTEGER, allowNull: false },
  bidIncrement: { type: DataTypes.INTEGER, allowNull: false },
  goLiveAt: { type: DataTypes.DATE, allowNull: false },
  durationSec: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('scheduled','live','ended','closed'), defaultValue: 'scheduled' },
  sellerDecision: { type: DataTypes.ENUM('pending','accepted','rejected','countered'), defaultValue: 'pending' }
}, { sequelize, modelName: 'auction' });
