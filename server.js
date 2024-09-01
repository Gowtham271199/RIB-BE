const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors({ origin: 'https://onebox-pi.vercel.app' })); // Update origin to match your frontend's domain
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Server is running');
});
// Set CSP headers
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com");
  next();
});

// In-memory storage for users (for demonstration purposes)
const users = [];

// Registration route
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  // Save new user
  users.push({ email, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Onebox routes (dummy data and functionality)
const threads = [
  { id: 1, subject: 'Test Thread', body: 'This is a test thread' }
];

app.get('/api/onebox/list', (req, res) => {
  res.status(200).json(threads);
});

app.get('/api/onebox/:thread_id', (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.thread_id));
  if (thread) {
    res.status(200).json(thread);
  } else {
    res.status(404).json({ message: 'Thread not found' });
  }
});

app.delete('/api/onebox/:thread_id', (req, res) => {
  const index = threads.findIndex(t => t.id === parseInt(req.params.thread_id));
  if (index !== -1) {
    threads.splice(index, 1);
    res.status(200).json({ message: 'Thread deleted' });
  } else {
    res.status(404).json({ message: 'Thread not found' });
  }
});

app.post('/api/reply/:thread_id', (req, res) => {
  const { from, to, subject, body } = req.body;
  const thread = threads.find(t => t.id === parseInt(req.params.thread_id));
  if (thread) {
    res.status(200).json({ message: 'Reply sent' });
  } else {
    res.status(404).json({ message: 'Thread not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
