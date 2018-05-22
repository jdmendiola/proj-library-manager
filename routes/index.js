var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/*
router.get('/create', function(req, res, next){
	res.render('create', {content: {}, title: "Create"});
});

router.post('/', function(req, res, next){
	Book.create(req.body).then(function(book){
		console.log(book);
		res.redirect('/create');
	})
});
*/
router.get('/:page', function (req, res, next) {
	Book.findAndCountAll({
		order: [ ['title'] ],
		offset: ((req.params.page - 1) * pageLimit),
		limit: pageLimit
	}).then(function (book) {
		let pages = Math.ceil(book.count / pageLimit);
		res.render('index', {
			content: book.rows,
			pagination: pages,
			title: 'Express'
		});
	});
});
/*
SELECT book_id, title AS "Book Title", first_name AS "Borrower Name", loaned_on AS "Borrowed on: " FROM loans, books, patrons WHERE book_id = 15 and loans.book_id = books.id AND loans.patron_id = patrons.id;
*/

module.exports = router;
