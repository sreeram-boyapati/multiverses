'use strict';
module.exports = (sequelize, DataTypes) => {
  var Person = sequelize.define('Person', {
        id: {primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true},
        power: DataTypes.BOOLEAN,
        family_id: DataTypes.INTEGER,
        universe_id: DataTypes.INTEGER,
	      createdAt: {type: DataTypes.DATE, defaultValue: sequelize.literal('NOW()')},
	      updatedAt: {type: DataTypes.DATE, defaultValue: sequelize.literal('NOW()')}
  }, {
    tableName: 'Person',
    timestamps: true
  });
  Person.associate = function(models) {
    // associations can be defined here
  };
  return Person;
};
