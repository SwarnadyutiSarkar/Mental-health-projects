import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sleepRecords, setSleepRecords] = useState([]);
  const [formData, setFormData] = useState({ date: '', duration: '', quality: '' });

  useEffect(() => {
    fetchSleepRecords();
  }, []);

  const fetchSleepRecords = async () => {
    try {
      const response = await fetch('/api/sleep');
      const data = await response.json();
      setSleepRecords(data);
    } catch (error) {
      console.error('Error fetching sleep records:', error);
    }
  };

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchSleepRecords();
        setFormData({ date: '', duration: '', quality: '' });
      }
    } catch (error) {
      console.error('Error adding sleep record:', error);
    }
  };

  return (
    <div className="App">
      <h1>Sleep Tracker</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleFormChange} />
        </label>
        <label>
          Duration (hours):
          <input type="number" name="duration" value={formData.duration} onChange={handleFormChange} />
        </label>
        <label>
          Quality:
          <select name="quality" value={formData.quality} onChange={handleFormChange}>
            <option value="">-- Select --</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </label>
        <button type="submit">Add Sleep Record</button>
      </form>
      <h2>Sleep Records</h2>
      <ul>
        {sleepRecords.map(record => (
          <li key={record._id}>{record.date} - {record.duration} hours - {record.quality}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// Home route
router.get('/', (req, res) => {
    const isAuthenticated = req.session.user;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sleep Tracker</title>
            <link rel="stylesheet" href="/styles.css">
            <script src="/scripts/chart.js" defer></script>
        </head>
        <body>
            <header>
                <h1>Welcome to Sleep Tracker</h1>
                ${isAuthenticated ? '<a href="/auth/logout">Logout</a>' : '<a href="/auth/login">Login</a>'}
            </header>
            <main>
                <section>
                    <h2>Track Your Sleep</h2>
                    <form action="/track-sleep" method="POST">
                        <label for="sleep-duration">Sleep Duration (in hours):</label>
                        <input type="number" id="sleep-duration" name="sleep-duration" step="0.1" required>
                        
                        <label for="sleep-quality">Sleep Quality (1-10):</label>
                        <input type="number" id="sleep-quality" name="sleep-quality" min="1" max="10" required>

                        <button type="submit">Submit</button>
                    </form>
                </section>
                <section>
                    <h2>Sleep Data Visualization</h2>
                    <canvas id="sleepChart" width="400" height="200"></canvas>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 Sleep Tracker App</p>
            </footer>
        </body>
        </html>
    `);
});

// Track sleep route
router.post('/track-sleep', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    const { sleepDuration, sleepQuality } = req.body;
    const record = {
        user: req.session.user,
        date: new Date().toISOString().split('T')[0],
        duration: parseFloat(sleepDuration),
        quality: parseInt(sleepQuality, 10)
    };

    dataStore.addSleepRecord(record);
    res.redirect('/');
});

// Get sleep data
router.get('/sleep-data', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const records = dataStore.getAllSleepRecords().filter(record => record.user === req.session.user);
    res.json(records);
});

module.exports = router;
