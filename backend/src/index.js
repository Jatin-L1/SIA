require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const uploadRouter = require('./routes/upload');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '',
    ].filter(Boolean);
    if (!origin || allowed.includes(origin) || allowed.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/upload', uploadRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'rabbitt-sales-automator', version: '1.0.0' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
