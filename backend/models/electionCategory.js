const mongoose = require("mongoose");
const { Schema } = mongoose;

const electionCategorySchema = new Schema({
    name: { type: String, default: '' }
}, {timestamps: true});

module.exports = mongoose.model('ElectionCategory', electionCategorySchema)