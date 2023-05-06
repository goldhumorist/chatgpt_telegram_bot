import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { IBotContextWithSession, ITelegramContext } from './interfaces';
import { telegramBotController } from './controllers/telegram-bot.controller';
import { loggerFactory } from './helpers/logger.helper';
const logger = loggerFactory.getLogger(__filename);

const BOT = new Telegraf<IBotContextWithSession>(config.TELEGRAM.API_KEY);

BOT.use(session());

BOT.use((context, next) => {
  logger.info('Bot has received message', context.message);
  logger.info(
    `Bot session for ${context.message?.from.id} (before)`,
    context.session,
  );

  next();
});

BOT.command('start', context =>
  telegramBotController.initCommand(context as ITelegramContext),
);

BOT.command('new', context =>
  telegramBotController.initCommand(context as ITelegramContext),
);

BOT.on(message('voice'), context =>
  telegramBotController.voiceMesage(context as ITelegramContext),
);

BOT.on(message('text'), context =>
  telegramBotController.textMesage(context as ITelegramContext),
);

BOT.launch();

logger.info('Process has started', config);

process.once('SIGINT', () => BOT.stop('SIGINT'));
process.once('SIGTERM', () => BOT.stop('SIGTERM'));

process.on('unhandledRejection', (reason: Error) => {
  BOT.stop('SIGTERM');
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('uncaughtException', error);

  BOT.stop('SIGTERM');
  process.exit(1);
});
