const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    nin: { type: String, default: '' },
    votingID: { type: String, default: '' },
    lastname: { type: String, required: true},
    firstname: { type: String, required: true},
    username: { type: String, default: '' },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNo: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Others', 'Not Specified'], default: 'Not Specified'  },
    country: { type: String, default: 'Nigeria' },
    state: { type: String, default: 'Nigeria' },
    lga: { type: String, default: 'Nigeria' },
    dateOfBirth: { type: Date },
    age: { type: Number },
    role: { type: Number, enum: [1, 2, 3, 4, 5], default: 5 },
    image: { type: Buffer, default: '' },
    imageUrl: { type: String, default: 'https://picsum.photos/id/866/4704/3136' },
    idCardType: { type: String, default: 'Passport' },
    idCardImage: { type: String, default: '' },
    idCardUrl: { type: String, default: 'https://picsum.photos/id/866/4704/3136' },
    isIdVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneNoVerified: { type: Boolean, default: true },
    isNINVerified: { type: Boolean, default: true },
    isDOBeligibleToVote: { type: Boolean, default: false },
    isProfileVerified: { type: Boolean, default: false },
    isVoted: { type: Boolean, default: false },
    verificationDate: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'Staff', default: 1 },
    dateCreated: { type: Date },
    dateUpdated: { type: Date },
    resetToken: { type: String, default: '' },
    resetTokenExpiration: { type: Date, default: '' }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)













//     riskLevel: {type: Number, enum: [1, 2, 3, 4, 5], default: null},
//     productTypes: [{ type: Schema.Types.ObjectId, ref: 'ProductType' }],
