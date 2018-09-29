const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron
const { Op } = require('sequelize');
const dayjs = require('dayjs');

router.get('/', function (req, res, next) {
    res.redirect('/books/all/1');
});

router.get('/all', function(req, res, next){
    res.status(200).render('patrons/all');
});

module.exports = router;