// load mongoose lib
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var UploadedContentsSchema = new Schema({
    file_contents: String
});

// export modules
module.exports = mongoose.model('UploadedContents', UploadedContentsSchema);