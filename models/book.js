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
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        notEmtpy: {
          msg: "not an integer"
        }
      }
    }
  }, {
      timestamps: false,
      underscored: true
  });
  Book.associate = function(models) {
    Book.hasMany(models.Loan);
    // associations can be defined here
  };
  return Book;
};