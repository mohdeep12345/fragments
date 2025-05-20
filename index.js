import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();
const app = express();

app.get('/', (req, res) => {
  logger.info('Root path accessed');
  res.send('Hello from Express!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
