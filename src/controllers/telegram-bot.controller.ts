import { code } from 'telegraf/format';
import { oggFileService } from '../services/ogg-files.service';
import { openAiService } from '../services/openai.service';
import { ChatRoleEnum, IInitialSession, ITelegramContext } from '../interfaces';
import { loggerFactory } from './../helpers/logger.helper';
const logger = loggerFactory.getLogger(__filename);

class TelegramBotController {
  private INITIAL_SESSION: IInitialSession = {
    messages: [],
  };

  async initCommand(context: ITelegramContext) {
    if (context.session) context.session.messages = [];
    else context.session = this.INITIAL_SESSION;

    await context.reply(
      code(
        'I am waiting for you question (You can sent text or voice message).',
      ),
    );
  }

  async voiceMesage(context: ITelegramContext) {
    context.session ??= this.INITIAL_SESSION;

    await context.reply(
      code('I`ve got the message. Waiting the response from the server...'),
    );

    const oggFileLink = await context.telegram.getFileLink(
      context?.message?.voice?.file_id,
    );

    const userId = String(context.message.from.id);

    const oggFilePath = await oggFileService.downloadOggFile(
      oggFileLink.href,
      userId,
    );

    const mp3FilePath = await oggFileService.convertOggtoMP3(
      oggFilePath,
      userId,
    );

    const text = await openAiService.translateVoiceToText(mp3FilePath);

    logger.info("User's question - ", text);

    await context.reply(code(`Your message: ${text}`));

    context.session.messages.push({ role: ChatRoleEnum.user, content: text });

    const response = await openAiService.getResponseFromChatGPT(
      context.session.messages,
    );

    context.session.messages.push({
      role: ChatRoleEnum.assistant,
      content: response.content,
    });

    logger.info("User's response - ", response?.content);

    await context.reply(String(response?.content));
  }

  async textMesage(context: ITelegramContext) {
    context.session ??= this.INITIAL_SESSION;

    await context.reply(
      code('I`ve got the message. Waiting the response from the server...'),
    );

    const { text } = context.message;

    logger.info("User's question - ", text);

    context.session.messages.push({ role: ChatRoleEnum.user, content: text });

    const response = await openAiService.getResponseFromChatGPT(
      context.session.messages,
    );

    context.session.messages.push({
      role: ChatRoleEnum.assistant,
      content: response?.content,
    });

    logger.info("User's response - ", response?.content);

    await context.reply(String(response?.content));
  }
}

export const telegramBotController = new TelegramBotController();
