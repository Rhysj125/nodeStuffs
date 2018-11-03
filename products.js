const app = require('express');
const mongoose = require('mongoose');

let Product = mongoose.model('product', {
    name: String,
    price: String
});

function GetProduct(){

    app.get('/product', (req, res) => {
        product.find({}, (error, product) => {
            res.send(product);
        });
    });
};

// function createproduct(){

//     app.post('/product', (req, res) =>{
//         let product = new Product(req.body);

//         let savedProduct = await product.save();
//     });
// }