const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: create a JWT for a user object
const signToken = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

// 1. Google authentication – works for any Google account
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body; // ID token from Google
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub } = ticket.getPayload();
    const user = { email, full_name: name, googleId: sub };
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

// 2. Email/password Register (always succeeds for demo)
app.post('/api/auth/register', (req, res) => {
  const { full_name, email, password } = req.body;
  const user = { email, full_name: full_name || email };
  const token = signToken(user);
  res.json({ token, user });
});

// 3. Email/password Login (always succeeds)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = { email, full_name: email };
  const token = signToken(user);
  res.json({ token, user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));