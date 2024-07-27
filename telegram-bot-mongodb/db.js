const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://akasheducation10:RiOs8X8OMbpkCGnq@cluster0.m7i8xqg.mongodb.net/'; 
const dbName = 'telegramBotDB';
let db = null;

async function connectToDatabase() {
    if (db) return db;
    
    const client = new MongoClient(url, { useUnifiedTopology: true });
    
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

module.exports = { connectToDatabase };