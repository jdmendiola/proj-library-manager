const Book = require('../models').Book;
const Patron = require('../models').Patron;
const dayjs = require('dayjs');

module.exports = async function (){

    let viewModel = {};
    let presentLoanDate = dayjs().format('YYYY-MM-DD');
    let returnLoanDate = dayjs(presentLoanDate).add(7, 'day').format('YYYY-MM-DD');

    viewModel.presentLoanDate = presentLoanDate;
    viewModel.returnLoanDate = returnLoanDate;

    let bookPromise = Book.findAll({
        order: ['id'],
        attributes: ['id','title']
    }).then(function(book){
        return book;
    });

    let patronPromise = Patron.findAll({
        order: ['id'],
        attributes: ['id','first_name','last_name']
    }).then(function(patron){
        return patron;
    });

    let queryValues = await Promise.all([bookPromise, patronPromise]);
    viewModel.bookList = queryValues[0];
    viewModel.patronList = queryValues[1];

    return viewModel;

}