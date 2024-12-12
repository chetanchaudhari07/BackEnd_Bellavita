const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    image : {
        type : Array,
        default : []
    },
    category : {
        type : String,
        enum : ['MEN',"WOMEN","UNISEX","OUD COLLECTION","ATTARS","LITTLE LUXURIES","MOOD COLLECTION"],
        default : "MEN"
    },
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null,
    },
    price : {
        type : Number,
        default : null,
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    }
},{
    timestamps : true
});

const Product = mongoose.model('product',productSchema);

module.exports = Product;