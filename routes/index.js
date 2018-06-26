var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;

router.get('/', function(req, res, next){
    res.render('home');
});

router.post('/', function(req, res, next){
	Book.create(req.body).then(function(book){
		res.redirect('/page/1');
	})
});

router.get('/loans/all', function(req, res, next){
    Loan.findAll({
        order: ['id'],
        include: [
            {model: Patron},
            {model: Book}
        ]    
    }).then(function(loan){
        console.log(loan[0].Book)
        res.render('loans', {content: loan})
    });
});

/*
SELECT book_id, title AS "Book Title", first_name AS "Borrower Name", loaned_on AS "Borrowed on: " FROM loans, books, patrons WHERE book_id = 15 and loans.book_id = books.id AND loans.patron_id = patrons.id;
*/

module.exports = router;
