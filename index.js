const fs = require('fs');
const { google } = require('googleapis');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

const GOOGLE_API_FOLDER_ID = '1BQSYFjIow2tGshoVd9bCQzBR1oO7wVIu';

app.get('/', (req, res) => {
    const html = fs.readFileSync('index.html', 'utf-8');
    res.send(html);
});

app.use(express.static(__dirname)); // Serve static files from the current directory

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Rest of the upload logic remains the same
    } catch (err) {
        console.log('Upload file error', err);
        res.status(500).send('Error uploading image');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
