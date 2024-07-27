// bot.js
const TelegramBot = require('node-telegram-bot-api');
const { connectToDatabase } = require('./db');

const token = ''; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

// Connect to the database
connectToDatabase().then(db => {
    const usersCollection = db.collection('users');

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        // Initialize or reset user data
        await usersCollection.updateOne(
            { chatId },
            { $set: { step: 'name', name: '', photo: '', location: '' } },
            { upsert: true }
        );

        bot.sendMessage(chatId, 'Hi! Please provide your full name.');
    });

    bot.on('photo', async (msg) => {
        const chatId = msg.chat.id;
        const fileId = msg.photo[msg.photo.length - 1].file_id;

        const fileLink = await bot.getFileLink(fileId);
        // Save fileLink to database and update user step
        await usersCollection.updateOne(
            { chatId },
            { $set: { photo: fileLink, step: 'location' } }
        );

        bot.sendMessage(chatId, 'Thank you for sending the image. Please provide your location in the format "latitude,longitude".');
    });

    bot.onText(/.+/, async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        // Get user data
        const user = await usersCollection.findOne({ chatId });

        if (!user) {
            bot.sendMessage(chatId, 'Please start the conversation by sending /start.');
            return;
        }

        if (user.step === 'name') {
            // Save the name and request the image
            await usersCollection.updateOne(
                { chatId },
                { $set: { name: text, step: 'photo' } }
            );
            bot.sendMessage(chatId, 'Thank you for providing your name. Now, please send me an image.');
        } else if (user.step === 'location') {
            // Handle location
            if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(text)) {
                // Save location and complete the process
                await usersCollection.updateOne(
                    { chatId },
                    { $set: { location: text, step: 'completed' } }
                );
                bot.sendMessage(chatId, 'Thank you! We have received your name, image, and location. We will get back to you soon with further updates.');
            } else {
                bot.sendMessage(chatId, 'Please provide a valid location in the format "latitude,longitude".');
            }
        } else {
            bot.sendMessage(chatId, 'I am not sure what you mean. Please follow the instructions.');
        }
    });
});