// load lib
const AWS = require('aws-sdk');
const async = require('async');
var formidable = require('formidable');
const fs = require('fs');
var dateTime = require('node-datetime');

// global variables
let fileData, fileName;

// aws configuration
const aws_config = require('../aws_config.json');
AWS.config.loadFromPath('aws_config.json');
const s3 = new AWS.S3({region: aws_config.region});

// model schema
var UploadedData = require('../models/uploadedcontents');

// uploading file => s3.
const createItemObject = (callback) => {
  	const params = {
        Bucket: aws_config.bucket,
        Key: `${fileName}`, 
        ACL: 'public-read',
        Body: fileData
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null);
	    } else {
	    	console.log("Successfully uploaded image on S3", data);
	    	callback(null, data);
	    }
	});
}

// fetch file and parse from s3.
const getItemObject = (callback) => {
	const params = {
	  	Bucket: aws_config.bucket, 
	  	Key: `${fileName}`
 	};
 	s3.getObject(params, function(err, data) {
	   	if (err){
	   		console.log(err, err.stack);
	   		callback(err, null);
	   	}
	   	else{
	   		storeS3DataInDb(data.Body.toString());
	   		storeS3DataInFb(data.Body.toString());
	   		callback(null, data);
	   	}
	});
}

// storing parsed data into mongo db.
function storeS3DataInDb(data){
	// init Data
	var uploadeddata = new UploadedData({
		file_contents: data
	});
	// save Data
	uploadeddata.save(function (err, data) {
		if (err) console.log(err);
		else console.log('Record Inserted into MongoDB');
	});
}

// storing parsed data into firebase.
function storeS3DataInFb(data){
	var uploadedContents = rootRef.child(dateTime.create().format('Y-m-d H:M:S'));
	uploadedContents.set({
		file_contents: data
	});
	console.log('Record Inserted into Firebase');
}

// fetch file from xhr, parse
// call async series fun(), unlink tmp path.
exports.awsFileUploader = (req, res, next) => {
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, function(err, fields, files){
		var tmp_path = files.readytoupload.path;
		fileData = fs.createReadStream(tmp_path);
    	fileName = files.readytoupload.name;

    	async.series([
	        createItemObject,
	        getItemObject
	        ], (err, result) => {
	        if(err) 
	        	return res.send(err)
	        else {
	        	fs.unlinkSync(tmp_path);
	        	return res.status(200).json({"Success": "File Uploaded"});
	    	}
    	});
	});
}