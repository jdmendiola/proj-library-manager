const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron

router.get('/all', function(req, res, next){
    Loan.findAll({
        order: ['id'],
        include: [
            {model: Patron},
            {model: Book}
        ]    
    }).then(function(loan){
        res.render('loans/all', {model: loan})
    });
});

module.exports = router;