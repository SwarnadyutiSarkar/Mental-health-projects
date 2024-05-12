import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [therapists, setTherapists] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      const response = await fetch('/api/therapists', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTherapists(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Therapist Matching Platform</h1>
        {token ? (
          <div>
            <h2>Therapists</h2>
            <ul>
              {therapists.map(therapist => (
                <li key={therapist.id}>{therapist.name} - {therapist.specialization}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
