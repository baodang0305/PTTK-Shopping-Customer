
const mongoose = require('mongoose');

const schame = mongoose.Schema;
const customerSchame = new schame({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    }
}, {collection: 'Customer'});

const customer = mongoose.model('customer', customerSchame);
module.exports = customer;

