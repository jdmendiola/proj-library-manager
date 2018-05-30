var express = require('express');
var router = express.Router();
var Book = require('../../models').Book;
var Loan = require('../../models').Loan;
var { Op } = require('sequelize');

router.get('/', function(req, res, next){
    res.redirect('/books/page/1');
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

router.get('/all', function(req, res, next){
    Book.findAll({
        order: ['title'],
        include: [
            {
                model: Loan,
                where: {
                    return_by: '2015-12-18'
                }
            }
        ],
        required: true,
        limit: 100
    }).then(function(book){
        console.log(book);
        res.render('books/all', {model: book})
    })
});

module.exports = router;