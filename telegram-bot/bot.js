// bot.js
const TelegramBot = require('node-telegram-bot-api');
const { connectToDatabase } = require('./db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.TOKEN; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

// Connect to the database
connectToDatabase().then(db => {
    const usersCollection = db.collection('users');

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        // Initialize or reset user data
        await usersCollection.updateOne(
            { chat_id: chatId },
            { $set: { image: '', location: '', name: '', step: 'name' } },
            { upsert: true }
        );

        bot.sendMessage(chatId, 'Hi! Please provide your full name.');
    });

    bot.on('text', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        // Get user data
        const user = await usersCollection.findOne({ chat_id: chatId });

        if (!user) {
            bot.sendMessage(chatId, 'Please start the conversation by sending /start.');
            return;
        }

        if (user.step === 'name') {
            // Save the name and request the image
            await usersCollection.updateOne(
                { chat_id: chatId },
                { $set: { name: text, step: 'photo' } }
            );
            bot.sendMessage(chatId, 'Thank you for providing your name. Now, please send me an image.');
        } else if (user.step === 'location') {
            // Handle location
            const locationRegex = /^-?\d+\.\d+,-?\d+\.\d+$/;
            if (locationRegex.test(text)) {
                // Save location and complete the process
                await usersCollection.updateOne(
                    { chat_id: chatId },
                    { $set: { location: text, step: 'completed' } }
                );
                bot.sendMessage(chatId, 'Thank you! We have received your name, image, and location. We will get back to you soon with further updates.');
                // Optionally save user data to a file or database here
                const userData = `Name: ${user.name}\nLocation: ${user.location}\nImage Path: ${user.image}\n`;
                fs.writeFileSync(path.join(__dirname, `${chatId}_info.txt`), userData);
            } else {
                bot.sendMessage(chatId, 'Please provide a valid location in the format "latitude,longitude".');
            }
        } else {
            bot.sendMessage(chatId, 'Please follow the instructions.');
        }
    });

    bot.on('photo', async (msg) => {
        const chatId = msg.chat.id;
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileLink = await bot.getFileLink(fileId);
        // Save fileLink to database and update user step
        await usersCollection.updateOne(
            { chat_id: chatId },
            { $set: { image: fileLink, step: 'location' } }
        );
        bot.sendMessage(chatId, 'Thank you for sending the image. Please provide your location in the format "latitude,longitude".');
    });
});
