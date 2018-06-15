'use strict';
module.exports = (sequelize, DataTypes) => {
    var Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            validate: { notEmpty: { msg: 'Title field cannot be blank' } }
        },
        author: {
            type: DataTypes.STRING,
            validate: { notEmpty: { msg: 'Author field cannot be blank' } }
        },
        genre: {
            type: DataTypes.STRING,
            validate: { notEmpty: { msg: 'Genre field cannot be blank' } }
        },
        first_published: DataTypes.INTEGER
    }, {
        timestamps: false,
        underscored: true
    });
    Book.associate = function (models) {
        Book.hasMany(models.Loan);
        // associations can be defined here
    };
    return Book;
};