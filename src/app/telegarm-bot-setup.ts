import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { BotCommands, BotMessageType } from '../constants';
import { config } from '../config';
import { TelegramBotController } from '../controllers/telegram-bot.controller';
import { IBotContextWithSession, ITelegramContext } from '../interfaces';

const BOT = new Telegraf<IBotContextWithSession>(config.TELEGRAM.API_KEY);

const telegramBotController = new TelegramBotController();

BOT.use(session());

BOT.use((context: IBotContextWithSession, next: () => void) =>
  telegramBotController.loggingMiddleware(context as ITelegramContext, next),
);

BOT.command(BotCommands.start, (context: IBotContextWithSession) =>
  telegramBotController.handleInitCommands(context as ITelegramContext),
);

BOT.command(BotCommands.new, (context: IBotContextWithSession) =>
  telegramBotController.handleInitCommands(context as ITelegramContext),
);

BOT.on(message(BotMessageType.voice), (context: IBotContextWithSession) =>
  telegramBotController.handleVoiceMesage(context as ITelegramContext),
);

BOT.on(message(BotMessageType.text), (context: IBotContextWithSession) =>
  telegramBotController.handleTextMesage(context as ITelegramContext),
);

export default BOT;
