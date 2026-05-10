const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerEmail: String,
    orderItems: Object,
    total: Number,
    paymentReference: String,
    status: {
        type: String,
        default: "paid"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);