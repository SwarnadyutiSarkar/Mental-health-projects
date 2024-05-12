const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Dummy user data (for demo purposes)
const users = [
    { id: 1, username: 'user1', passwordHash: '$2a$10$Thp2lWvbpF.Lxgwp8s3euebzwfwxprNUglhih3p1Qai.UmsnOSBCe' } // password: secret1
];

// Route to authenticate user
app.post('/api/authenticate', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ sub: user.id }, 'secret-key', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Dummy therapist data (for demo purposes)
const therapists = [
    { id: 1, name: 'Therapist 1', specialization: 'Cognitive Behavioral Therapy' },
    { id: 2, name: 'Therapist 2', specialization: 'Family Therapy' },
    { id: 3, name: 'Therapist 3', specialization: 'Art Therapy' },
];

// Route to get therapists (requires authentication)
app.get('/api/therapists', authenticateToken, (req, res) => {
    res.json(therapists);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
