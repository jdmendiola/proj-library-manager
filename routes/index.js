var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron

/*
router.get('/create', function(req, res, next){
	res.render('create', {content: {}, title: "Create"});
});


*/

router.get('/', function(req, res, next){
    res.redirect('/page/1');
});

router.post('/', function(req, res, next){
	Book.create(req.body).then(function(book){
		res.redirect('/page/1');
	})
});

router.get('/page/:page', function (req, res, next) {

    let pageLimit = 4;
    let pageNumber = req.params.page;
    let pageOffset = (pageNumber - 1) * pageLimit;

	Book.findAndCountAll({

		order: [ ['title'] ],
		offset: ((req.params.page - 1) * pageLimit),
        limit: pageLimit
        
	}).then(function (book) {
        
        let pages = Math.ceil(book.count / pageLimit);

		res.status(200).render('index', {
			content: book.rows,
			pagination: pages,
			title: 'Express'
		});

	}).catch(function(err){
        res.status(500).send('Critical error');
    });

});

router.get('/books/all', function(req, res, next){
    Book.findAll({
        order: ['title'],
        limit: 100
    }).then(function(book){
        res.render('all', {content: book})
    })
});

router.get('/loans/all', function(req, res, next){
    Loan.findAll({
        order: ['id'],
        include: [{
            model: Patron
        }]    
    }).then(function(loan){
        res.render('loans', {content: loan})
    });
});

/*
SELECT book_id, title AS "Book Title", first_name AS "Borrower Name", loaned_on AS "Borrowed on: " FROM loans, books, patrons WHERE book_id = 15 and loans.book_id = books.id AND loans.patron_id = patrons.id;
*/

module.exports = router;
