const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

app.post('/api/telegram', async (req, res) => {
    try {
        const { chatId, message } = req.body;
        
        if (!BOT_TOKEN) {
            console.error('BOT_TOKEN is not set!');
            return res.status(500).json({ error: 'BOT_TOKEN not set' });
        }
        
        const targetChatId = chatId || ADMIN_ID;
        
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: targetChatId, text: message })
        });
        
        const result = await response.json();
        console.log('Telegram response:', result);
        
        if (result.ok) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('Telegram error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`BOT_TOKEN is ${BOT_TOKEN ? 'SET' : 'NOT SET'}`);
    console.log(`ADMIN_ID is ${ADMIN_ID ? 'SET' : 'NOT SET'}`);
});
