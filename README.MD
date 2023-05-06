# ChatGPT Telegram BOT

## Description

---

Telegram bot for communicating with ChatGPT.

---

## ENV Variables

| Name                       | is required | description                                      | example                       |
| -------------------------- | ----------- | ------------------------------------------------ | ----------------------------- |
| #SYSTEM                    |             |                                                  |                               |
| NODE_ENV                   | YES         | Specifies environment of application             | development, test, production |
|                            |             |                                                  |                               |
| #TELEGRAM                  |             |                                                  |                               |
| TELEGRAM_BOT_TOKEN         | YES         | Token (apiKey) for connecting to telegram bot    | SOME_API_KEY                  |
|                            |             |                                                  |                               |
| #OPENAI                    |             |                                                  |                               |
| OPENAI_API_KEY             | YES         | ApiKey for connecting to OpenAI API              | SOME_API_KEY                  |
| OPENAI_CHAT_MODEL          | YES         | Model of ChatGPT                                 | gpt-3.5-turbo, gpt-4          |
| OPENAI_VOICE_TO_TEXT_MODEL | YES         | OpenAI API model for voice-to-message conversion | whisper-1                     |
