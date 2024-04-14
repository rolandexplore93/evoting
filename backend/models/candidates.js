const mongoose = require("mongoose");
const { Schema } = mongoose;

const candidateSchema = new Schema({
    candidateName: { type: String, default: '' },
    candidateImage: { type: String, default: '' },
    candidateImageUrl: { type: String, default: '' },
    uniqueTag: { type: String, default: '', unique: true },
    partyId: { type: Schema.Types.ObjectId, ref: 'Party', default: null },
    electionId: { type: Schema.Types.ObjectId, ref: 'Election', default: null }
}, {timestamps: true});

module.exports = mongoose.model('Candidate', candidateSchema)