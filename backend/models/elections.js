const mongoose = require("mongoose");
const { Schema } = mongoose;

const electionSchema = new Schema({
    electionName: { type: String, default: null },
    electionCategory: { type: String, default: null },
    openDate: { type: Date, default: null },
    closingDate: { type: Date, default: null },
    // createdBy: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, {timestamps: true});

module.exports = mongoose.model('Election', electionSchema)