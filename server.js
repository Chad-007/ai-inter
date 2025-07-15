import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors'; 
const app = express();
app.use(express.json());
app.use(cors()); 

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'mydb',
  password: 'mysecretpassword',
  port: 5433,
});
const JWT_SECRET = 'your_jwt_secret';

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or error occurred' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET);
  res.json({ message: 'Login successful', token });
});

// interview section got the boilerplate code

app.post('/submit-score', async (req, res) => {
  const { email, topic, score, duration, feedback } = req.body;
  if (!email || !topic || score === undefined) {
    return res.status(400).json({ error: 'Email, topic, and score are required' });
  }

  try {
    const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    const userId = user.rows[0]?.id || null;

    await pool.query(
      'INSERT INTO interviews (user_id, email, topic, score, duration, feedback) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, email, topic, score, duration, feedback]
    );
    res.json({ message: 'Score submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

app.get('/leaderboard/:topic', async (req, res) => {
  const { topic } = req.params;
  try {
    const result = await pool.query(
      'SELECT email, score, duration, completed_at FROM interviews WHERE topic = $1 ORDER BY score DESC, duration ASC LIMIT 10',
      [topic]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        topic,
        COUNT(*) as total_interviews,
        AVG(score) as avg_score,
        MAX(score) as highest_score
      FROM interviews 
      GROUP BY topic 
      ORDER BY topic
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard overview' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));