import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { IBotContextWithSession, ITelegramContext } from './interfaces';
import { telegramBotController } from './controllers/telegram-bot.controller';
import { loggerFactory } from './helpers/logger.helper';
import { BotCommands, BotMessageType } from './constants';
import { ElasticSearch } from './db/elasticsearch/elasticsearch-connect';
import { mappingDocuments } from './db/elasticsearch/mapping-documents';
const logger = loggerFactory.getLogger(__filename);

const BOT = new Telegraf<IBotContextWithSession>(config.TELEGRAM.API_KEY);

BOT.use(session());

BOT.use((context, next) =>
  telegramBotController.loggingMiddleware(context as ITelegramContext, next),
);

BOT.command(BotCommands.start, context =>
  telegramBotController.initCommand(context as ITelegramContext),
);

BOT.command(BotCommands.new, context =>
  telegramBotController.initCommand(context as ITelegramContext),
);

BOT.on(message(BotMessageType.voice), context =>
  telegramBotController.voiceMesage(context as ITelegramContext),
);

BOT.on(message(BotMessageType.text), context =>
  telegramBotController.textMesage(context as ITelegramContext),
);

BOT.launch();

BOT.telegram
  .getMe()
  .then(async () => {
    logger.info('Bot has started', config);
    const elasticSearchInstance = await ElasticSearch.getInstance();
    await elasticSearchInstance.init(mappingDocuments);
  })
  .catch(error => {
    logger.error('Error during launch the bot', error);
    throw error;
  });

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
