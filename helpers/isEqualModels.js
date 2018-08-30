let convert = require('./convertInteger').convertInteger;

exports.isEqualModels = function (model1, model2){

    if (model2.first_published != ''){
        model2.first_published = convert(model2.first_published);
    }
    
    return model1.title == model2.title 
    && model1.author == model2.author 
    && model1.genre == model2.genre
    && model1.first_published == model2.first_published

}