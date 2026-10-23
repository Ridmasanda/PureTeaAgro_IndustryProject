require('dotenv').config();

const dns = require('dns');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const dnsServers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

dns.setServers(dnsServers);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PureTeaAgro API is running',
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Request validation failed.',
      errors: Object.values(error.errors).map((validationError) => validationError.message),
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

async function startServer() {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, '0.0.0.0', () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
