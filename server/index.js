const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// --- ⚙️ CONFIG (Gemini & Server) ---
const API_KEY = "AIzaSyBOM6Om0CBngUIUyJcshhUCokXuZY3AZ78"; // උඹේ Gemini API Key එක මෙතනට දාපන් මචං
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let bot = null;

function startBot() {
    if (bot) return;

    bot = mineflayer.createBot({
        host: 'fritiXsakura.aternos.me', //
        port: 26737, // අද Aternos එකේ තියෙන Port එක බලලා දාපන්
        username: 'Friti_Beast_AI',
        version: false
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log("Beast AI Joined! 🔥 Movements & AI Active.");
        const mcData = require('minecraft-data')(bot.version);
        bot.pathfinder.setMovements(new Movements(bot, mcData));

        // --- 🕺 PRO ANTI-AFK MOVEMENTS ---
        setInterval(() => {
            if (bot.entity) {
                const r = Math.random();
                if (r < 0.25) {
                    // ඉස්සරහට ඇවිදිනවා
                    bot.setControlState('forward', true);
                    setTimeout(() => bot.setControlState('forward', false), 1000);
                } else if (r < 0.5) {
                    // පනිනවා (Jump)
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                } else if (r < 0.75) {
                    // වටපිට බලනවා
                    bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
                }
            }
        }, 8000); // තත්පර 8කට සැරයක් මූ මොකක් හරි කරනවා
    });

    // --- 💬 AI CHAT SYSTEM ---
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;

        try {
            const prompt = `You are Friti Beast AI, a legendary Minecraft bot. Owner: Himesh Rukshan (Friti Liyon) from Ambalanthota (14 years old). Reply in Sinhala (machan, bokka style). Max 80 characters. Message: ${message}`;
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            
            bot.chat(response.substring(0, 100)); // Minecraft chat limit
        } catch (err) {
            console.error("AI Error:", err);
        }
    });

    // --- 🔄 AUTO RECONNECT & ERROR HANDLING ---
    bot.on('end', () => {
        console.log("Ado disconnect una! Reconnecting in 5s...");
        bot = null;
        setTimeout(startBot, 5000); // ඩිස්කනෙක්ට් වුණොත් ආයේ එනවා
    });

    bot.on('error', (err) => {
        console.log("Bot Error: " + err);
        bot = null;
    });
}

// --- 🌐 API FOR DASHBOARD ---
app.post('/api/start', (req, res) => {
    if (!bot) { startBot(); res.json({ msg: "Beast AI Starting... 🚀" }); }
    else { res.json({ msg: "Beast is already active! 🔥" }); }
});

app.listen(3000, () => console.log("Dashboard: http://localhost:3000"));