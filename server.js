const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ከRender Environment Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

app.post('/api/telegram', async (req, res) => {
    try {
        const { chatId, message, image } = req.body;
        
        if (!BOT_TOKEN) {
            return res.json({ error: 'BOT_TOKEN not set' });
        }
        
        if (image) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', image);
            formData.append('caption', message);
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { 
                method: 'POST', 
                body: formData 
            });
        } else {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Telegram error:', error);
        res.json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
