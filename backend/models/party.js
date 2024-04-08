const mongoose = require("mongoose");
const { Schema } = mongoose;

const partySchema = new Schema({
    name: { type: String, default: '' },
    partyAcronym: { type: String, default: '' },
    partyLogo: { type: String, default: '' },
    partyLogoUrl: { type: String, default: '' },
    electionId: { type: String, default: '' }
    // electionId: { type: Schema.Types.ObjectId, ref: 'Election', default: null },
}, {timestamps: true});

module.exports = mongoose.model('Party', partySchema)