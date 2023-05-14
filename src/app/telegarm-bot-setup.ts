import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { BotCommands, BotMessageType } from '../constants';
import { config } from '../config';
import { ElasticSearchIndexingService } from '../services/elastic-indexing.service';
import { TelegramBotController } from '../controllers/telegram-bot.controller';
import { IBotContextWithSession, ITelegramContext } from '../interfaces';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

const BOT = new Telegraf<IBotContextWithSession>(config.TELEGRAM.API_KEY);

const telegramBotController = new TelegramBotController(
  new ElasticSearchIndexingService(),
);

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

export default BOT;
