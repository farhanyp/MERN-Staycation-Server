const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    console.log("password: ", this.password)
    this.password = await bcrypt.hash(this.password, salt);
    console.log("salt: ", salt)
    next();
    });

module.exports = mongoose.model("User", userSchema)