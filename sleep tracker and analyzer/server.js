const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sleep_tracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema for sleep records
const sleepRecordSchema = new mongoose.Schema({
    date: Date,
    duration: Number,
    quality: String
});
const SleepRecord = mongoose.model('SleepRecord', sleepRecordSchema);

app.use(bodyParser.json());

// Endpoint to add a sleep record
app.post('/api/sleep', async (req, res) => {
    try {
        const { date, duration, quality } = req.body;
        const sleepRecord = new SleepRecord({ date, duration, quality });
        await sleepRecord.save();
        res.json({ success: true, message: 'Sleep record added successfully' });
    } catch (error) {
        console.error('Error adding sleep record:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint to get all sleep records
app.get('/api/sleep', async (req, res) => {
    try {
        const sleepRecords = await SleepRecord.find();
        res.json(sleepRecords);
    } catch (error) {
        console.error('Error fetching sleep records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
