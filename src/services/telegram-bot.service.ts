import { IMessage } from './../interfaces';
import { openAiService } from './openai.service';
import { oggFileService } from './ogg-files.service';
import { loggerFactory } from './../helpers/logger.helper';
const logger = loggerFactory.getLogger(__filename);

export class TelegramBotService {
  async translateVoiceToText(
    oggVoiceFileUrl: string,
    userId: string,
  ): Promise<string> {
    const oggFilePath = await oggFileService.downloadOggFile(
      oggVoiceFileUrl,
      userId,
    );

    const mp3FilePath = await oggFileService.convertOggtoMP3(
      oggFilePath,
      userId,
    );

    const text = await openAiService.translateVoiceMp3ToText(mp3FilePath);

    return text || '';
  }

  async getResponseFromChatGPT(messages: Array<IMessage>): Promise<string> {
    const response = await openAiService.getResponseFromChatGPT(messages);

    logger.info("User's response - ", response);

    return response?.content || '';
  }
}

export const telegramBotService = new TelegramBotService();
