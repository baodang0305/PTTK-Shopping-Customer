const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
    Image:{
        type: String,
        required: true
    },
    Name:{
        type: String,
        required: true
    },
    Category:{
        type: String,
        required: true
    },
    Gender:String,
    Cost:{
        type: Number,
        required: true
    },
    Sale:Number,
    Amount:{
        type: Number,
        required: true
    },
    Describe: String,
    Product_Group: String
}, {collection: 'Product'});
const listProduct = mongoose.model("Product", productSchema);

module.exports = listProduct;
