const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const { Op } = require('sequelize');
const dayjs = require('dayjs');

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
                    console.log(book);
                    res.json(book)
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
                    console.log(book);
                    res.json(book)
                })
                break;
            default:
                res.send(`The filter 'filter=${req.query.filter}' does not exist for this page.`);
                break;
        }
    } else {
        Book.findAll({
            order: ['title'],
            limit: 100
        }).then(function(book){
            res.render('books/all', {model: book})
        })
    }
});

module.exports = router;