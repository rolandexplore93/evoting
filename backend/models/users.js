const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    ninNumber: { type: String, default: '' },
    votingID: { type: String, default: '' },
    lastname: { type: String, required: true},
    firstname: { type: String, required: true},
    username: { type: String, default: '' },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phonenumber: { type: String, unique: true, default: '' },
    gender: { type: String, enum: ['male', 'female', 'others', 'ns'], default: 'ns'  },
    country: { type: String, default: 'Nigeria' },
    state: { type: String, default: 'Nigeria' },
    lga: { type: String, default: 'Nigeria' },
    dateOfBirth: { type: Date },
    age: { type: Number, default: 1 },
    role: { type: Number, enum: [1, 2, 3, 4, 5], default: 5 },
    uploadSelfie: { type: String, default: '' },
    uploadSelfieUrl: { type: String, default: 'https://picsum.photos/id/866/4704/3136' },
    idCardType: { type: String, default: 'Passport' },
    uploadID: { type: String, default: '' },
    uploadIDUrl: { type: String, default: 'https://picsum.photos/id/866/4704/3136' },
    isIdVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isphonenumberVerified: { type: Boolean, default: true },
    isNINVerified: { type: Boolean, default: true },
    isDOBeligibleToVote: { type: Boolean, default: false },
    isProfileVerified: { type: Boolean, default: false },
    isVoted: { type: Boolean, default: false },
    verificationDate: { type: Date, default: null },
    // verifiedBy: { type: Schema.Types.ObjectId, ref: 'Staff', default: 1 },
    verifiedBy: { type: String, default: 'admin1' },
    resetToken: { type: String, default: '' },
    resetTokenExpiration: { type: Date, default: '' }
}, {timestamps: true});

userSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(this.password, salt);
        this.password = encryptPassword;
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model('User', userSchema)













//     riskLevel: {type: Number, enum: [1, 2, 3, 4, 5], default: null},
//     productTypes: [{ type: Schema.Types.ObjectId, ref: 'ProductType' }],
