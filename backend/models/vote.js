const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new Schema({
    votingSerialId: { type: Number, default: 0 },
    // electionId: { type: Schema.Types.ObjectId, ref: 'Election', default: null },
    electionId: { type: String, default: '' },
    // userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userId: { type: String, default: '' },
    // approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedBy: { type: String, default: '' },
    approvedDate: { type: Date, default: null },
    voteStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending'  },
    voterScreenshots: { type: [String], default: [''] },
    voterVideo: { type: String, default: '' },
}, {timestamps: true});

module.exports = mongoose.model('Vote', voteSchema)