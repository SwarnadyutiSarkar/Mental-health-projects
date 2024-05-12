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
