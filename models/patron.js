'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    library_id: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
      timestamps: false,
      underscored: true
  });
  Patron.associate = function(models) {
    Patron.hasMany(models.Loan)
    // associations can be defined here
  };

  Patron.prototype.changeUpper = function (){
    return this.first_name.toUpperCase();
  }

  return Patron;
};