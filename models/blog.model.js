const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogName: String,
    type: String,
    title: String,
    description: String,
    blogImg: String,
    userId: String
});

const blogModel = mongoose.model("blogsCollection", blogSchema);

module.exports = blogModel;
