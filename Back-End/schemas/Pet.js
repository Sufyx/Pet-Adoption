/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    type: String,
    name: String,
    adoptionStatus: String,
    picture: String,
    height: Number,
    weight: Number,
    color: String,
    bio: String,
    hypoallergenic: Boolean,
    dietary: [String],
    breed: String,
    owner: String,
    savedAtUsers: [String]
});

module.exports = mongoose.model("Pet", petSchema)