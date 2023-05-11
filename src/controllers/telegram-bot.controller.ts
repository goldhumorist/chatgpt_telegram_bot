import { code, italic } from 'telegraf/format';
import { OpenAiService } from '../services/openai.service';
import { OggFileService } from '../services/ogg-files.service';
import { TelegramBotService } from '../services/telegram-bot.service';
import {
  IUserRequestIndex,
  IInitialSession,
  ITelegramContext,
  ITelegramBotService,
  IElasticSearchIndexingService,
} from '../interfaces';
import { ChatRoleEnum } from '../constants';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

export class TelegramBotController {
  private INITIAL_SESSION: IInitialSession = {
    messages: [],
  };

  private telegramBotService: ITelegramBotService;

  constructor(
    private elasticSearchIndexingService: IElasticSearchIndexingService,
  ) {
    this.telegramBotService = new TelegramBotService(
      new OggFileService(),
      new OpenAiService(),
    );
  }

  async initCommand(context: ITelegramContext) {
    try {
      if (context.session) context.session.messages = [];
      else context.session = this.INITIAL_SESSION;

      await context.reply(
        code(
          'I am waiting for you question (You can sent text or voice message).',
        ),
      );
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  async voiceMesage(context: ITelegramContext) {
    try {
      const userQuestionDate = new Date();

      context.session ??= this.INITIAL_SESSION;

      const oggFileLink = await context.telegram.getFileLink(
        context?.message?.voice?.file_id,
      );

      const text = await this.telegramBotService.translateVoiceToText(
        oggFileLink.href,
        String(context.message.from.id),
      );

      logger.info("User's question - ", text);

      await context.reply(code(`Your message: ${text}`));

      context.session.messages.push({ role: ChatRoleEnum.user, content: text });

      const response = await this.telegramBotService.getResponseFromChatGPT(
        context.session.messages,
      );

      const userRequestIndex: IUserRequestIndex = {
        userId: context.message.from.id,
        message_id: context.message.message_id,
        userName: context.message.from.username || '',
        firstName: context.message.from.first_name,
        languageCode: context.message.from.language_code || '',
        question: text || '',
        response,
        questionGotAt: userQuestionDate,
        responseSendedAt: new Date(),
      };

      await this.elasticSearchIndexingService.indexUserRequst(userRequestIndex);

      context.session.messages.push({
        role: ChatRoleEnum.assistant,
        content: response,
      });

      await context.reply(response);
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
  }

  async textMesage(context: ITelegramContext) {
    try {
      const userQuestionDate = new Date();
      context.session ??= this.INITIAL_SESSION;

      const { text } = context.message;

      logger.info("User's question - ", text);

      context.session.messages.push({ role: ChatRoleEnum.user, content: text });

      const response = await this.telegramBotService.getResponseFromChatGPT(
        context.session.messages,
      );

      const userRequestIndex: IUserRequestIndex = {
        userId: context.message.from.id,
        message_id: context.message.message_id,
        userName: context.message.from.username || '',
        firstName: context.message.from.first_name,
        languageCode: context.message.from.language_code || '',
        question: text || '',
        response,
        questionGotAt: userQuestionDate,
        responseSendedAt: new Date(),
      };

      await this.elasticSearchIndexingService.indexUserRequst(userRequestIndex);

      context.session.messages.push({
        role: ChatRoleEnum.assistant,
        content: response,
      });

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
        `Bot session for ${context.message?.from.id} (before)`,
        context.session,
      );

      next();
    } catch (error) {
      await this.errorHandle(error as Error, context);
    }
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
