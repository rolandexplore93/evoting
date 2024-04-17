const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new Schema({
    votingSerialId: { type: Number, default: 0 },
    electionId: { type: Schema.Types.ObjectId, ref: 'Election', default: null },
    partyId: { type: String, default: '' },
    partyVotedFor: { type: String, default: '' },
    candidateId: { type: String, default: '' },
    candidateVotedFor: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedDate: { type: Date, default: null },
    voterScreenshots: { type: [String], default: [] },
    voterVideo: { type: String, default: '' },
    voteStatus: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending'  },
}, {timestamps: true});

module.exports = mongoose.model('Vote', voteSchema)