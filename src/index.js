const TelegramBot = require('node-telegram-bot-api');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const token = '5960821800:AAGeYh_AFnTfLUEElQ4u7HOLwB6LX6XxlLg';

const bot = new TelegramBot(token, { polling: true });

const lastMessages = [];

const generateValueBetween = (min, max) => Math.random() * (max - min) + min;

let currentNextFlyAway = [
  generateValueBetween(1.2, 3),
  generateValueBetween(1.2, 6),
];

async function listenForTelegramMessages() {
  bot.on('message', (msg) => {
    if (
      msg.sender_chat.type === 'channel' &&
      msg.sender_chat.title === 'Aviator'
    ) {
      console.log(`Message from ${msg.from.first_name}: ${msg.text}`);

      if (msg.text?.includes('GREEN')) {
        currentNextFlyAway = [
          generateValueBetween(1.2, 3),
          generateValueBetween(1.2, 6),
        ];
      }
    }

    lastMessages.push(msg);

    if (lastMessages.length > 10) {
      lastMessages.shift();
    }
  });
}

bot.on('polling_error', (error) => {
  console.error(error);
});

listenForTelegramMessages();

app.get('/api/last-messages', (req, res) => {
  res.json({ lastMessages });
});

app.get('/api/aviator', (req, res) => {
  const [firstValue, secondValue] = currentNextFlyAway
    .sort()
    .map((n) => n.toFixed(2));

  res.json({
    firstValue,
    secondValue,
  });
});

const port = process.env.PORT || process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
