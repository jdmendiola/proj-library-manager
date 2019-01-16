const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron
const { Op } = require('sequelize');
const dayjs = require('dayjs');

router.get('/', function (req, res, next) {
    res.redirect('/patrons/all/1');
});

router.post('/', function(req, res, next){
    if (req.body !== 'undefined'){
        let column = req.body.search_column;
        let searchQuery = req.body.search_query;

        Patron.findAll({
            order: ['first_name'],
            where: {
                [column]: {
                    [Op.like]: `%${searchQuery}%`
                }
            }
        }).then(function(patron){
            if (patron.length > 0){
                res.status(200).render('patrons/all', {
                    model: patron,
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

router.get('/:patronId', function(req, res, next){
    Patron.findById(req.params.patronId, {
        include: [
            {
                model: Loan,
                include: [Book, Patron]
            }
        ]
    }).then(function(patron){
        if (patron){
            res.render('patrons/patron_detail', {model: patron})
        } else {
            res.send('Patron ID requested does not exist.')    
        }
    }).catch(function(error){
        res.send('Bad request')
    })
});


router.put('/:patronId', function(req, res, next){
    Patron.findById(req.params.patronId, {
        include: [
            {
                model: Loan,
                include: [Book, Patron]
            }
        ]
    }).then(function(patron){
        return patron.update(req.body);    
    }).then(function(patron){
        res.redirect('/patrons/all/1');
    }).catch(function(error){
        if (error.name === 'SequelizeValidationError'){
            Patron.findById(req.params.patronId, {
                include: [
                    {
                        model: Loan,
                        include: [Book, Patron]
                    }
                ]
            }).then(function(patron){
                res.render('patrons/patron_detail', {model: patron, errors: error.errors});
            });
        }
    });
});

router.get('/all/:page', function (req, res, next) {

    let pageLimit = 2;
    let pageNumber = req.params.page;
    let pageOffset = (pageNumber - 1) * pageLimit;

	Patron.findAndCountAll({
		order: [ ['id'] ],
		offset: pageOffset,
        limit: pageLimit
	}).then(function (patron) {
        let pages = Math.ceil(patron.count / pageLimit);

        if (pageNumber <= pages){
            res.status(200).render('patrons/all', {
                model: patron.rows,
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