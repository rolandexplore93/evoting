const mongoose = require("mongoose");
const { Schema } = mongoose;

const candidateSchema = new Schema({
    name: { type: String, default: '' },
    partyAcronym: { type: String, default: '' },
    candidateImage: { type: String, default: '' },
    candidateImageUrl: { type: String, default: '' },
    partyId: { type: String, default: '' }
    // partyId: { type: Schema.Types.ObjectId, ref: 'Party', default: null },
}, {timestamps: true});

module.exports = mongoose.model('Candidate', candidateSchema)