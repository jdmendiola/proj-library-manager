const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron
const { Op } = require('sequelize');
const dayjs = require('dayjs');
let loanCreateModel = require('../../helpers/loanCreateModel');

router.get('/all', function(req, res, next){
    let today = dayjs().format('YYYY-MM-DD');
    
    if (req.query.filter){
        switch(req.query.filter){
            case 'overdue':
                Loan.findAll({
                    order: ['id'],
                    include: [
                        {model: Patron},
                        {model: Book}
                    ],
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
                }).then(function(loan){
                    res.render('loans/all', {model: loan})
                });
                break;
            case 'checkedout':
                Loan.findAll({
                    order: ['id'],
                    include: [
                        {model: Patron},
                        {model: Book}
                    ],
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
                }).then(function(loan){
                    res.render('loans/all', {model: loan})
                });
                break;
            default:
                res.send('That filter does not exist');
                break;
        }
    } else {
        Loan.findAll({
            order: ['id'],
            include: [
                {model: Patron},
                {model: Book}
            ]    
        }).then(function(loan){
            res.render('loans/all', {model: loan})
        });
    }
});

router.post('/create', function(req, res, next){
    Loan.create(req.body).then(function(loan){
        res.redirect('/loans/all');
    }).catch(function(error){
        if (error.name === 'SequelizeValidationError'){
            let viewModel = loanCreateModel();
            viewModel.then(function(viewModel){
                viewModel.errors = error.errors;
                res.render('loans/loan_create', {model: viewModel});
            });
            
        }
    });
});

router.get('/create', function(req, res, next){
    let viewModel = loanCreateModel();
    viewModel.then(function(viewModel){
        res.render('loans/loan_create', {model: viewModel})
    });
});

module.exports = router;