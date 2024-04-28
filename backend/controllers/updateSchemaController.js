const users = require("../models/users");
const party = require("../models/party");
const candidates = require("../models/candidates");
const elections = require("../models/elections");
const vote = require("../models/vote");

// Update document field inside collection in the database
const updateUserSchema = async () => {
    try {
        // Update profileStatus for all users
        await candidates.updateMany({}, {$set: { uniqueTag: '' } });
        console.log(`Users collection field has been updated.`)
    } catch (error) {
        console.log(`Error updating user model schema: ${error.message}`)
    }
}
// updateUserSchema()

const deleteOneFieldFromCollection = async () => {
    try {
        await candidates.updateMany({}, { $unset: { uniqueTag: "" } });
        // await candidates.collection.dropIndex('uniqueTag_1');
        console.log(`Field deleted.`)
    } catch (error) {
        console.log(`Error updating user model schema: ${error.message}`)
    }
}
// deleteOneFieldFromCollection()

const deleteManyFieldFromCollection = async () => {
    try {
        await users.updateMany({}, { $unset: { oldFieldName1: "", oldFieldName2: "" } });
        console.log(`Fields deleted. Collection size:`)
    } catch (error) {
        console.log(`Error updating user model schema: ${error.message}`)
    }
}

// Update an existing field without affecting their value
const updateCollectionWithExistingField = async () => {
    try {
        // Update profileStatus for all users
        await users.updateMany({ pin: { $exists: false } }, { $set: { pin: null } });
        console.log(`Users collection fields have been updated.`)
    } catch (error) {
        console.log(`Error updating user model schema: ${error.message}`)
    }
}
// updateCollectionWithExistingField()