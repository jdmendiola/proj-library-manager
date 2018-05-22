var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET home page. */
router.get('/:page', function (req, res, next) {

	let page = req.params.page;
	let pageLimit = 4;
	let offset = (page - 1) * pageLimit;

	Book.findAndCountAll({
		order: [
			['title']
		],
		offset: offset,
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

/*
SELECT book_id, title AS "Book Title", first_name AS "Borrower Name", loaned_on AS "Borrowed on: " FROM loans, books, patrons WHERE book_id = 15 and loans.book_id = books.id AND loans.patron_id = patrons.id;
*/

module.exports = router;
