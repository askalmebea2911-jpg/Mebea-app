const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.post('/api/telegram', async (req, res) => {
    try {
        const { chatId, message } = req.body;
        
        if (!BOT_TOKEN) {
            return res.status(500).json({ error: 'BOT_TOKEN not set' });
        }
        
        const targetId = chatId || ADMIN_ID;
        
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: targetId, text: message })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: result.description });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/config', (req, res) => {
    res.json({ adminId: ADMIN_ID, channelId: CHANNEL_ID });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`BOT_TOKEN is ${BOT_TOKEN ? 'SET' : 'NOT SET'}`);
    console.log(`ADMIN_ID is ${ADMIN_ID ? 'SET' : 'NOT SET'}`);
    console.log(`CHANNEL_ID is ${CHANNEL_ID ? 'SET' : 'NOT SET'}`);
});
