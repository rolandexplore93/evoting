const mongoose = require("mongoose");
const { Schema } = mongoose;

const electionTypeSchema = new Schema({
    name: { type: String, default: '' },
    ElectionCategoryId: { type: String, default: '' }
    // ElectionCategoryId: { type: Schema.Types.ObjectId, ref: 'ElectionCategoryId', default: null },
}, {timestamps: true});

module.exports = mongoose.model('ElectionType', electionTypeSchema)