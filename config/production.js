const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  TELEGRAM: { API_KEY: process.env.TELEGRAM_BOT_TOKEN || 'TELEGRAM_BOT_TOKEN' },
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY || 'OPENAI_API_KEY',
    CHAT_MODEL: process.env.OPENAI_CHAT_MODEL || 'OPENAI_CHAT_MODEL',
    VOICE_TO_TEXT_MODEL:
      process.env.OPENAI_VOICE_TO_TEXT_MODEL || 'OPENAI_VOICE_TO_TEXT_MODEL',
  },
};
