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

router.get('/all', function(req, res, next){
    res.status(200).render('patrons/all');
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