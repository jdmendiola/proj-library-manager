const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron
const { Op } = require('sequelize');
const dayjs = require('dayjs');
let isEqualModels = require('../../helpers/isEqualModels').isEqualModels;

router.get('/', function (req, res, next) {
    res.redirect('/books/all/1');
});

router.post('/', function(req, res, next){
    if (req.body !== 'undefined'){
        let column = req.body.search_column;
        let searchQuery = req.body.search_query;

        Book.findAll({
            order: ['author', 'title', 'genre'],
            where: {
                [column]: {
                    [Op.like]: `%${searchQuery}%`
                }
            }
        }).then(function(book){
            if (book.length > 0){
                res.status(200).render('books/all', {
                    model: book,
                    filter: true
                });
            } else {
                res.send('No results found');
            }
        }).catch(function(err){
            res.send('Bad query for database');
        });
    } else {
        res.send('No inputs found');
    }
});

router.get('/all', function(req, res, next){
    let today = dayjs().format('YYYY-MM-DD');

    if (req.query.filter){
        switch(req.query.filter){
            case 'overdue':
                Book.findAll({
                    order: ['author','title'],
                    include: [
                        {
                            model: Loan,
                            where: {
                                [Op.and]: {
                                    return_by: {
                                        [Op.lt]: today,
                                    },
                                    returned_on: {
                                        [Op.eq]: null
                                    }
                                }
                            }
                        }
                    ],
                    limit: 100
                }).then(function(book){
                    res.status(200).render('books/all', {
                        model: book,
                        filter: true
                    });
                })
                break;
            case 'checkedout':
                Book.findAll({
                    order: ['author','title'],
                    include: [
                        {
                            model: Loan,
                            where: {
                                [Op.and]: {
                                    loaned_on: {
                                        [Op.ne]: null,
                                    },
                                    returned_on: {
                                        [Op.eq]: null
                                    }
                                }
                            }
                        }
                    ],
                    limit: 100
                }).then(function(book){
                    res.status(200).render('books/all', {
                        model: book,
                        filter: true
                    });                    
                })
                break;
            default:
                res.send(`The filter 'filter=${req.query.filter}' does not exist for this page.`);
                break;
        }
    } else {
        res.redirect('/books/all/1');
    }
});

router.post('/create', function(req, res, next){
    Book.create(req.body).then(function(book){
        res.redirect('/books/all/1');
    }).catch(function(error){
        if (error.name === 'SequelizeValidationError'){
            res.render('books/book_create', {errors: error.errors});
        }
    });
})

router.get('/create', function(req, res, next){
    res.render('books/book_create', {model: {}})
});

router.get('/:bookId', function(req, res, next){
    Book.findById(req.params.bookId, {
        include: [
            {
                model: Loan,
                include: [
                    {model: Patron}
                ]
            }
        ]
    }).then(function(book){
        if (book){
            let loaned = (book.Loans.length) ? true : false;
            res.render('books/book_detail', {model: book, isLoaned: loaned})
        } else {
            res.send('Book ID requested does not exist.')    
        }
    }).catch(function(error){
        res.send('Bad request')
    })
});

router.put('/:bookId', function(req, res, next){
    Book.findById(req.params.bookId, {
        include: [
            {
                model: Loan,
                include: [
                    {model: Patron}
                ]
            }
        ]
    }).then(function(book){
        if (book){
            if (!isEqualModels(book.dataValues, req.body)){
                return book.update(req.body)
            } else {
                let loaned = (book.Loans.length) ? true : false;
                res.render('books/book_detail', {model: book, noChange: true, isLoaned: loaned})
            }
        } else {
            res.send(404);
        }
    }).then(function(book){
        res.redirect('/books/all');
    }).catch(function(error){
        if (error.name === 'SequelizeValidationError'){
            Book.findById(req.params.bookId, {
                include: [
                    {
                        model: Loan,
                        include: [
                            {model: Patron}
                        ]
                    }
                ]
            }).then(function(book){
                let loaned = (book.Loans.length) ? true : false;
                res.render('books/book_detail', {model: book, errors: error.errors, isLoaned: loaned});
            });
        }
    });
});

router.get('/all/:page', function (req, res, next) {

    let pageLimit = 5;
    let pageNumber = req.params.page;
    let pageOffset = (pageNumber - 1) * pageLimit;

	Book.findAndCountAll({
		order: [ ['title'] ],
		offset: pageOffset,
        limit: pageLimit
	}).then(function (book) {
        let pages = Math.ceil(book.count / pageLimit);

        if (pageNumber <= pages){
            res.status(200).render('books/all', {
                model: book.rows,
                pagination: pages,
                current: pageNumber,
                filter: false
            });
        } else {
            res.send('That page number does not exist.');
        }
		
	}).catch(function(err){
        res.status(500).send('Critical error');
    });

});

module.exports = router;