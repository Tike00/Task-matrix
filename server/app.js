const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const routes = require('./routes');
const requestLoggerMiddleware = require('./middleware/requestLoggerMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const localOnlyMiddleware = require('./middleware/localOnlyMiddleware');

dotenv.config();

const app = express();
const allowRemoteAccess = process.env.ALLOW_REMOTE_ACCESS === 'true';

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowRemoteAccess) {
    return true;
  }

  return origin === 'http://127.0.0.1:5173' || origin === 'http://localhost:5173';
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);
app.use(localOnlyMiddleware);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ok',
    data: {
      service: 'local-task-platform-server',
      time: new Date().toISOString()
    }
  });
});

app.use('/api', routes);

const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

app.use(errorMiddleware);

module.exports = app;
