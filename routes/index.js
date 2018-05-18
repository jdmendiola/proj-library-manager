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

		res.render('index', {
			content: book.rows,
			pagination: pages,
			title: 'Express'
		});

	});

});

module.exports = router;
