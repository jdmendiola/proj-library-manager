const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const { Op } = require('sequelize');
const dayjs = require('dayjs');

router.get('/', function(req, res, next){
    res.redirect('/books/all/1');
});

router.post('/', function(req, res, next){
    console.log(req.body);
    res.json(req.body);
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
                    res.json(book)
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

router.get('/all/:page', function (req, res, next) {

    let pageLimit = 5;
    let pageNumber = req.params.page;
    let pageOffset = (pageNumber - 1) * pageLimit;

	Book.findAndCountAll({
		order: [ ['title'] ],
		offset: ((req.params.page - 1) * pageLimit),
        limit: pageLimit
	}).then(function (book) {
        let pages = Math.ceil(book.count / pageLimit);

        if (pageNumber <= pages){
            res.status(200).render('books/all', {
                model: book.rows,
                pagination: pages,
                current: pageNumber
            });
        } else {
            res.send('That page number does not exist.');
        }
		
	}).catch(function(err){
        res.status(500).send('Critical error');
    });

});

module.exports = router;