const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const Loan = require('../../models').Loan;
const Patron = require('../../models').Patron
const { Op } = require('sequelize');
const dayjs = require('dayjs');

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
                    res.json(loan);
                });
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

module.exports = router;