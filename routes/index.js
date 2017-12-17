var express = require('express');
var router = express.Router();
const controller = require('../controllers/aws_fileupload');

// index route
router.get('/', function(req, res, next) {
  res.render('index');
});

// uploader route
router.route('/upload')
	.post(controller.awsFileUploader);

module.exports = router;
