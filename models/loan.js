'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: 'You have submitted a blank entry. Book ID cannot be blank.'} }
    }, 
    patron_id: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: 'You have sumbumitted a blank entry. Patron ID cannot be blank.'}}
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: {msg: 'You have submitted a blank entry. Loaned on date cannot be blank. '}}
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: {msg: 'You have submitted a blank entry. Return by date cannot be blank. '}}
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: {msg: 'You have submitted a blank entry. Returned on date cannot be blank. '}}
    }
  }, {
      timestamps: false,
      underscored: true
  });
  Loan.associate = function(models) {
    Loan.belongsTo(models.Patron);
    Loan.belongsTo(models.Book);
    // associations can be defined here
  };

  return Loan;
};