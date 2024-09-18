const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: String,
    username: String,
    bio: String,
    link: String,
    gender: String,
});

const profileModel = mongoose.model("profileCollections", profileSchema);

module.exports = profileModel;
