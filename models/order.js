const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    Username: String,
    ReceiverName: String,
    ReceiverAddress: String,
    ReceiverPhonenumber: Number,
    Sum: Number,
    Product: [{
        Id: String,
        Name: String,
        Amount: Number,
        Cost: Number,
        SubTotal: Number
    }],
    Date: Date,
    DeliveryStatus: String,
}, {collection: 'Order'});

const order = mongoose.model('order', orderSchema);
module.exports = order;