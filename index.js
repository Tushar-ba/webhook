require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For API calls to MoonPay

const app = express();

// Middleware to parse JSON payload
app.use(bodyParser.json());

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    next();
});

// Store received webhook data (for testing)
let webhookData = [];

app.post('/webhook', async (req, res) => {
    const data = req.body;
    console.log(`Received data: ${JSON.stringify(data)}`);

    // Store the data
    webhookData.push(data);

    // Check for customerId and fetch KYC (sandbox test)
    if (data.result && data.result.customerId) {
        const customerId = data.result.customerId;
        const secretApiKey = process.env.MOONPAY_SECRET_KEY; // Use env variable
        if (!secretApiKey) {
            console.error('MOONPAY_SECRET_KEY is not set in .env');
            res.status(500).json({ status: 'error', message: 'Server configuration error' });
            return;
        }
        try {
            const kycResponse = await axios.get(`https://api.moonpay.com/v0/customers/${customerId}`, {
                headers: { Authorization: `Bearer ${secretApiKey}` }
            });
            console.log(`KYC Details for customer ${customerId}:`, kycResponse.data);
        } catch (error) {
            console.error(`Error fetching KYC for customer ${customerId}:`, error.response ? error.response.data : error.message);
        }
    }

    res.status(200).json({ status: 'success' }); // Acknowledge the webhook
});

// Endpoint to view stored webhook data (for testing)
app.get('/webhook-data', (req, res) => {
    res.json(webhookData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});