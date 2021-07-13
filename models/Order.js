/* According to needs, default order model is created */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentId: {
        type: String,
    },
    date: {
        type: Date,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    productAmounts: [Number],
    total: {
        type: Number,
    },
    status: {
        type: String,
    },
});

module.exports = mongoose.model("Order", orderSchema);