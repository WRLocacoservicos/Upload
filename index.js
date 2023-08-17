const fs = require('fs');
const { google } = require('googleapis');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

const GOOGLE_API_FOLDER_ID = '1BQSYFjIow2tGshoVd9bCQzBR1oO7wVIu';

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './cred.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            name: req.file.originalname,
            parents: [GOOGLE_API_FOLDER_ID]
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        fs.unlinkSync(req.file.path); // Remove the uploaded file

        res.send(`Image uploaded. File ID: ${response.data.id}`);
    } catch (err) {
        console.log('Upload file error', err);
        res.status(500).send('Error uploading image');
    }
});

app.listen(5500, () => {
    console.log('Server is running on port 5500');
});
