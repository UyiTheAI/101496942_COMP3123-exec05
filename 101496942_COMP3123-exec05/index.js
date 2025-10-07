const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./routes/users');

// built-in middleware to parse JSON bodies
app.use(express.json());

// Serve static files from project root (so home.html can be served)
app.use(express.static(path.join(__dirname)));

// Add User Router (mounted under /api/v1/user)
app.use('/api/v1/user', userRouter);

// Route to serve home.html at /home
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Error handling middleware - returns 500 with message "Server Error"
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).send('Server Error');
});

const DEFAULT_PORT = parseInt(process.env.PORT || process.env.port || '8081', 10) || 8081;

function startServer(port, retries = 5) {
  const server = app.listen(port, () => {
    console.log('Web Server is listening at port ' + port);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use.`);
      if (retries > 0) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort}... (${retries - 1} retries left)`);
        setTimeout(() => startServer(nextPort, retries - 1), 200);
      } else {
        console.error('No available ports found. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT, 5);