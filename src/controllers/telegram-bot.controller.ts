import { code, italic } from 'telegraf/format';
import { ElasticSearchIndexingService } from '../services/elastic-indexing.service';
import { validateSession } from '../helpers/telegram-session.helper';
import { OpenAiService } from '../services/openai.service';
import { OggFileService } from '../services/ogg-files.service';
import { TelegramBotService } from '../services/telegram-bot.service';
import { ISession, ITelegramContext, ITelegramBotService } from '../interfaces';
import { ChatRoleEnum } from '../constants';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

export class TelegramBotController {
  private INITIAL_SESSION: ISession = {
    messages: [],
    sessionExpiresAt: null,
  };

  private telegramBotService: ITelegramBotService;

  constructor() {
    this.telegramBotService = new TelegramBotService(
      new OggFileService(),
      new OpenAiService(),
      new ElasticSearchIndexingService(),
    );
  }

  async handleInitCommands(context: ITelegramContext) {
    try {
      context.session ??= this.INITIAL_SESSION;
      context.session.messages = [];

      await context.reply(
        code(
          'I am waiting for you question (You can sent text or voice message).',
        ),
      );
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  async handleVoiceMesage(context: ITelegramContext) {
    try {
      this.validateSession(context);

      const oggFileLink = await context.telegram.getFileLink(
        context?.message?.voice?.file_id,
      );

      const { response, question } =
        await this.telegramBotService.getResponseForVoiceMessage(
          oggFileLink.href,
          [...(context.session?.messages || [])],
          { ...context.message.from, message_id: context.message.message_id },
        );

      await context.reply(code(`Your message: ${question}`));

      this.updateSessionMessagesAfterRequest(context, question, response);

      await context.reply(response);
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  async handleTextMesage(context: ITelegramContext) {
    try {
      this.validateSession(context);

      const { text: question } = context.message;

      const response = await this.telegramBotService.getResponseForTextMessage(
        [...(context.session?.messages || [])],
        { ...context.message.from, message_id: context.message.message_id },
        question,
      );

      this.updateSessionMessagesAfterRequest(context, question, response);

      await context.reply(response);
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  async loggingMiddleware(context: ITelegramContext, next: () => void) {
    try {
      logger.info('Bot has received message', context.message);

      const isBotCommand = context.message.entities
        ? context.message.entities[0].type === 'bot_command'
        : false;

      if (!isBotCommand) {
        await context.reply(
          code('I`ve got the message. Waiting the response from the server...'),
        );
      }

      logger.info(
        `Bot session for ${context.message?.from?.id} (before)`,
        context.session,
      );

      next();
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  private validateSession(context: ITelegramContext) {
    context.session ??= this.INITIAL_SESSION;
    const { messages, expiresAt } = validateSession({ ...context.session });
    context.session.messages = messages;
    context.session.sessionExpiresAt = expiresAt;
  }

  private updateSessionMessagesAfterRequest(
    context: ITelegramContext,
    question: string,
    response: string,
  ) {
    context.session?.messages?.push({
      role: ChatRoleEnum.user,
      content: question,
    });
    context.session?.messages?.push({
      role: ChatRoleEnum.assistant,
      content: response,
    });
  }

  private async errorHandle(err: Error, context: ITelegramContext) {
    logger.error(`Ooops, encountered an error for ${context.updateType}`, err);

    context.reply(
      italic(
        'There was an error processing your request. Please try again later.',
      ),
    );
  }
}
