const { MongoClient } = require('mongodb');
require('dotenv').config();

const dbName = 'inputDB';
let db = null;

async function connectToDatabase() {
    if (db) return db;
    
    const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
    
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