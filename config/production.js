const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  TELEGRAM: { API_KEY: process.env.TELEGRAM_BOT_TOKEN || 'TELEGRAM_BOT_TOKEN' },
  OPENAI: { API_KEY: process.env.OPENAI_API_KEY || 'OPENAI_API_KEY' },
};
