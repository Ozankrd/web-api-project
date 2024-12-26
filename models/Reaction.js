const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Cocktail = require('./Cocktail');

const Reaction = sequelize.define('Reaction', {
  type: {
    type: DataTypes.ENUM('like', 'comment'),
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true, // Facultatif pour les likes
  },
});

Reaction.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reaction.belongsTo(Cocktail, { foreignKey: 'cocktailId', onDelete: 'CASCADE' });

module.exports = Reaction;
