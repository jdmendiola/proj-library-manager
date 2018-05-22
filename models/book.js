'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {
      timestamps: false
  });
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};