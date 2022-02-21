const token = "";
const TelegramBot = require('node-telegram-bot-api');
const stickers = require('./stickers');
const {getRandom} = require('./helpers');

const bot = new TelegramBot(token, {polling: true});

const btns = [
    [{text: 'rock', callback_data: '/rock'}],
    [{text: 'paper', callback_data: '/paper'}],
    [{text: 'scissors', callback_data: '/scissors'}],
]

const getKeyboradList  = (list) => {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: list
        })
    }
}

const callback_queries = [
    '/rock',
    '/paper',
    '/scissors'
];

const generateMove = () => callback_queries[getRandom(0, callback_queries.length)];

const getResult = (user, bot) => {
    if(user == bot) return "draw";

    if(user == "/rock") {
        if(bot == "/paper") return "lose"
        if(bot == "/scissors") return "victory"
    }

    if(user == "/paper") {
        if(bot == "/rock") return "victory"
        if(bot == "/scissors") return "lose"
    }

    if(user == "/scissors") {
        if(bot == "/paper") return "victory"
        if(bot == "/rock") return "lose"
    }
}


const getResultText = (result) => {
    if(result == "draw") return {
        text: "It is draw. I did not lose, but unfortunately you too",
        emoji: stickers.confused[getRandom(0, stickers.confused.length)],
        afterText: "We have to know who is the best!"
    };

    if(result == "victory") return {
        text: "You won. It is just a luck.",
        emoji: stickers.sad[getRandom(0, stickers.sad.length)],
        afterText: "Give me a chance!"
    };

    if(result == "lose") return {
        text: "You lost. Very easy oponent for me.",
        emoji: stickers.happy[getRandom(0, stickers.happy.length)],
        afterText: "Another try?"
    };
}

bot.on('message', async (msg) => {
    console.log('msg', msg);

    const text = "Hi! Would you like to play Rock paper scissors ?";

    await bot.sendSticker(msg.chat.id, stickers.hi[getRandom(0, stickers.hi.length)]);
    
    return bot.sendMessage(msg.chat.id, text,  getKeyboradList(btns));
})

bot.on('callback_query', async (msg) => {
    if(callback_queries.includes(msg.data)) {
            const botMove = generateMove();
            const result = getResult(msg.data, botMove);
            const resultText = getResultText(result);
            
            await bot.sendSticker(msg.message.chat.id, resultText.emoji);
            await bot.sendMessage(msg.message.chat.id, resultText.text);
            return bot.sendMessage(msg.message.chat.id, resultText.afterText, getKeyboradList(btns));
    }
    text = "Lets play a game";

    await bot.sendSticker(msg.message.chat.id, stickers.wondering[getRandom(0, stickers.wondering.length)]);
    
    return bot.sendMessage(msg.message.chat.id, text);
})