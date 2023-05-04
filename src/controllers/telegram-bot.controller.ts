import { code } from 'telegraf/format';
import { oggFileService } from '../services/ogg-files.service';
import { openAiService } from '../services/openai.service';
import { ChatRoleEnum, IInitialSession, ITelegramContext } from '../interfaces';

class TelegramBotController {
  private INITIAL_SESSION: IInitialSession = {
    messages: [],
  };

  async startCommand(context: ITelegramContext) {
    console.log(
      '[startCommand] context.session before mutating',
      context.session,
    );

    if (context.session) context.session.messages = [];
    else context.session = this.INITIAL_SESSION;

    console.log(
      '[startCommand] context.session after mutating',
      context.session,
    );

    await context.reply(
      'I am waiting for you question (You can sent text or voice message).',
    );
  }

  async newCommand(context: ITelegramContext) {
    console.log(
      '[newCommand] context.session before mutating',
      context.session,
    );

    if (context.session) context.session.messages = [];
    else context.session = this.INITIAL_SESSION;

    console.log('[newCommand] context.session after mutating', context.session);

    await context.reply(
      code(
        'I am waiting for you question (You can sent text or voice message).',
      ),
    );
    console.log('context.session in new', context.session);
  }

  async voiceMesage(context: ITelegramContext) {
    console.log(
      '[voiceMesage] context.session before mutating',
      context.session,
    );

    context.session ??= this.INITIAL_SESSION;

    console.log(
      '[voiceMesage] context.session after mutating',
      context.session,
    );

    console.log('voice context.session2', context.session);

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

    await context.reply(code(`Your message: ${text}`));

    context.session.messages.push({ role: ChatRoleEnum.user, content: text });

    const response = await openAiService.getResponseFromChatGPT(
      context.session.messages,
    );

    context.session.messages.push({
      role: ChatRoleEnum.assistant,
      content: response.content,
    });

    await context.reply(String(response?.content));
  }

  async textMesage(context: ITelegramContext) {
    console.log(
      '[textMesage] context.session before mutating',
      context.session,
    );

    context.session ??= this.INITIAL_SESSION;

    console.log('[textMesage] context.session after mutating', context.session);

    await context.reply(
      code('I`ve got the message. Waiting the response from the server...'),
    );

    const { text } = context.message;

    context.session.messages.push({ role: ChatRoleEnum.user, content: text });

    const response = await openAiService.getResponseFromChatGPT(
      context.session.messages,
    );

    context.session.messages.push({
      role: ChatRoleEnum.assistant,
      content: response?.content,
    });

    await context.reply(String(response?.content));
  }
}

export const telegramBotController = new TelegramBotController();
