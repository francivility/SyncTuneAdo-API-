import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'users.json');

// Safe read – handles missing/empty file
const readUsers = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  if (!raw.trim()) return [];
  return JSON.parse(raw);
};

const writeUsers = (users) => fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

// Seed admin ONLY if the file is empty – now we'll create the file manually so it won't seed
const seedAdmin = async () => {
  const users = readUsers();
  if (users.length === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    writeUsers([
      {
        id: '1',
        email: 'jasarenofrancemhary@gmail.com',
        password: hashed,
        name: 'France Mary',
        role: 'admin',
        googleId: null,
      },
    ]);
    console.log('✅ Admin seeded (jasarenofrancemhary@gmail.com / admin123)');
  }
};
seedAdmin();

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

// ---------- Manual Login ----------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// ---------- Google Login ----------
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let users = readUsers();
    let user = users.find((u) => u.googleId === googleId || u.email === email);

    if (!user) {
      return res.status(403).json({ message: 'Account not found. Only pre‑authorized admins can sign in.' });
    }

    if (!user.googleId) {
      user.googleId = googleId;
      writeUsers(users);
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin accounts only.' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google authentication failed.' });
  }
});

app.listen(process.env.PORT, () => console.log(`Backend running on port ${process.env.PORT}`));