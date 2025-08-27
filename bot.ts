const TelegramBot = require('node-telegram-bot-api');
import { Message } from 'node-telegram-bot-api';
import fullResponse from './fullResponse';
import "dotenv/config"

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('bot is running')

const replyOptions = { reply_markup: {keyboard: [['to M']]}}

bot.on("message", async (msg: Message) => {
  console.log(msg)
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === "/start") {
      bot.sendMessage(chatId, messageText, replyOptions)
    }
    if (messageText === 'to M') {
      const formatTime = (s:string) => s.slice(0,2) + ':' + s.slice(-2)
      const data = await fullResponse()
      console.log('data from bot.ts', data)
      if(!data.length){
        return bot.sendMessage(chatId, 'There are no train in the next 3 hours')
      }
      const message = data.map( el => `Departue: ${formatTime(el.dp._pt.slice(-4))}\nPlatform: ${data[0].dp._pp}\nTrain: ${el.tl._c} ${el.tl._n}`).join('\n-----\n')
      bot.sendMessage(chatId, message)
    }
});




