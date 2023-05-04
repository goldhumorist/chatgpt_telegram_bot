import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { IBotContexWithSession, ITelegramContext } from './interfaces';
import { telegramBotController } from './controllers/telegram-bot.controller';

const BOT = new Telegraf<IBotContexWithSession>(config.TELEGRAM.API_KEY);

BOT.use(session());

BOT.command('start', context =>
  telegramBotController.startCommand(context as ITelegramContext),
);

BOT.command('new', context =>
  telegramBotController.newCommand(context as ITelegramContext),
);

BOT.on(message('voice'), context =>
  telegramBotController.voiceMesage(context as ITelegramContext),
);

BOT.on(message('text'), context =>
  telegramBotController.textMesage(context as ITelegramContext),
);

BOT.launch();

console.log('Process has started', config);

process.once('SIGINT', () => BOT.stop('SIGINT'));
process.once('SIGTERM', () => BOT.stop('SIGTERM'));

process.on('unhandledRejection', (reason: Error) => {
  BOT.stop('SIGTERM');
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  console.log('uncaughtException', error);

  BOT.stop('SIGTERM');
  process.exit(1);
});
