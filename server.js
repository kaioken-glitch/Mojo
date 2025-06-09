import express from 'express';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// API endpoint for secure config access
app.get('/api/config', (req, res) => {
    res.json({
        youtubeApiKey: process.env.YOUTUBE_API_KEY
    });
});

// Serve static files
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});