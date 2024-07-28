const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const url = "mongodb+srv://akasheducation10:RiOs8X8OMbpkCGnq@cluster0.m7i8xqg.mongodb.net/";

const dbName = 'inputDB';
const collectionName = 'users';

async function connectToDatabase() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

app.get('/get-image', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/get-user', async (req, res) => {
  const { lat, lng } = req.query;
  const location = `${parseFloat(lat)},${parseFloat(lng)}`;

  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const user = await collection.findOne({ 'location': location });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/delete-location', async (req, res) => {
  const { lat, lng } = req.query;
  const location = `${lat},${lng}`;

  try {
    const result = await collection.deleteOne({ location });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Location deleted successfully' });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error('Error deleting location', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example NGO data
const ngos = [
  { name: "Nilgiris Development Society (NDS)", location: "Gudalur, Nilgiris, Tamil Nadu", contactNumber: "1800 4253 1111" },
  { name: "Nilgiris Wynaad Tribal Welfare Society", location: "Ambalamoola Post, via, Bitherkad, Tamil Nadu", contactNumber: "04262 224 477" },
  { name: "Theppakadu Elephant Camp", location: "Tamil Nadu", contactNumber: "1800 4253 1111" },
  { name: "Nilgiri Adivasi Welfare Association", location: "Kotagiri, Tamil Nadu 643217", contactNumber: "094422 71596" }
];

app.get('/get-ngos', (req, res) => {
  res.json(ngos);
});

app.listen(3005, () => {
  console.log("Server Started");
});
