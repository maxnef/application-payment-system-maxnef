/* According to needs, default client model is created */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const clientSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
    },
    surname: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
});

/* Before save the model, encrypt the password and store it */
clientSchema.pre("save", function(next) {
    client = this
    bcrypt.genSalt(10, function(saltError, salt) {
        if (saltError) {
            return next(saltError);
        } else {
            bcrypt.hash(client.password, salt, function(hashError, hash) {
                if (hashError) {
                    return next(hashError);
                }
                client.password = hash;
                next();
            });
        }
    });
});

/* This method is used for decrypt the password */
clientSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) return callback(error);
        else callback(null, isMatch);
    });
}

module.exports = mongoose.model("Client", clientSchema);