// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mentalhealth', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');
const JournalEntry = require('./models/JournalEntry');

// Routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.send('User registered');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.send('Login successful');
  } else {
    res.send('Invalid credentials');
  }
});

app.post('/journal', async (req, res) => {
  const { userId, entry } = req.body;
  const journalEntry = new JournalEntry({ userId, entry });
  await journalEntry.save();
  res.send('Journal entry saved');
});

app.get('/journal/:userId', async (req, res) => {
  const { userId } = req.params;
  const entries = await JournalEntry.find({ userId });
  res.send(entries);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
