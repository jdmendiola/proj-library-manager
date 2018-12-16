'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'This field is required. First name cannot be blank.'}
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'This field is required. Last name cannot be blank.'}
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'This field is required. Address cannot be blank.'}
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'This field is required. Email cannot be blank.'}
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'This field is required. Library ID cannot be blank.'}
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {msg: 'This field is required. Zip code cannot be blank.'}
      }
    }
  }, {
      timestamps: false,
      underscored: true
  });
  Patron.associate = function(models) {
    Patron.hasMany(models.Loan)
    // associations can be defined here
  };

  // Patron.prototype.changeUpper = function (){
  //   return this.first_name.toUpperCase();
  // }

  return Patron;
};