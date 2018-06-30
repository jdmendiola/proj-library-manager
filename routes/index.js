var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;

router.get('/', function(req, res, next){
    res.render('home');
});

module.exports = router;