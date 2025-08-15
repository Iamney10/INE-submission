import { sequelize } from '../db.js';
import { User } from './User.js';
import { Auction } from './Auction.js';
import { Bid } from './Bid.js';
import { Notification } from './Notification.js';
import { CounterOffer } from './CounterOffer.js';

User.hasMany(Auction, { foreignKey: 'sellerId' });
Auction.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

Auction.hasMany(Bid, { foreignKey: 'auctionId' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId' });
Bid.belongsTo(User, { as: 'bidder', foreignKey: 'bidderId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Auction.hasOne(CounterOffer, { foreignKey: 'auctionId' });
CounterOffer.belongsTo(Auction, { foreignKey: 'auctionId' });
CounterOffer.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
CounterOffer.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });

export { sequelize, User, Auction, Bid, Notification, CounterOffer };
