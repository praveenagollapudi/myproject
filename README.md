App: fileupload

Setup the Web App:

1. Clone the repo
2. Install Node Js, Express Js, Mongo Db.
3. cd <Project-Name>
4. npm install --- install the dependencies.
5. Setup the Amazon AWS S3 in aws_config.json
	aws_access_key_id = YOUR_ACCESS_KEY_ID
	aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
	aws_region = YOUR_ACCOUNT_REGION
	aws_bucket = YOUR_BUCKET_NAME
6. Setup the Firebase
	a. Login to https://firebase.com/login
	b. Create a project, open project settings.
	c. Generate private key, Download, Replace the serviceAccountKey.json.
7. Run the server npm start.
8. Go to browser and type http://127.0.0.1:5000

------------------------------------------------------------------------------

Working of the Application:

1. Hit the ip http://127.0.0.1:5000
2. Select the .csv file and click upload
3. On upload, fetch the respective file from aws s3.
4. Read the file and parse the data and store to nosql mongo database and firebase.