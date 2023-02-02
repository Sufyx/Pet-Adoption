/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    isAdmin: Boolean,
    bio: String,
    userPets: [String],
    savedPets: [String]
});

module.exports = mongoose.model("User", userSchema);
