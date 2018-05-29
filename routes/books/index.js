var express = require('express');
var router = express.Router();
var Book = require('../../models').Book;

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
        limit: 100
    }).then(function(book){
        res.render('books/all', {content: book})
    })
});

module.exports = router;