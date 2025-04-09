const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON payload from incoming POST request
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    // req.body contains the parsed JSON payload
    const data = req.body;  
    console.log(`Received data: ${JSON.stringify(data)}`);
    res.status(200).json({ status: 'success' });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});