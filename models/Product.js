/* According to needs, default product model is created */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    currency: {
        type: String,
    },
    images: {
        large1: {
            type: String,
        },
        large2: {
            type: String,
        },
        large3: {
            type: String,
        },
        small: {
            type: String,
        },
    },
});


module.exports = mongoose.model("Product", productSchema);