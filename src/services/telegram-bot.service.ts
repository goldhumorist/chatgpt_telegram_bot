import {
  IMessage,
  IOggFileService,
  IOpenAiService,
  ITelegramBotService,
} from '../interfaces';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

export class TelegramBotService implements ITelegramBotService {
  constructor(
    private oggFileService: IOggFileService,
    private openAiService: IOpenAiService,
  ) {}

  async translateVoiceToText(
    oggVoiceFileUrl: string,
    userId: string,
  ): Promise<string> {
    const oggFilePath = await this.oggFileService.downloadOggFile(
      oggVoiceFileUrl,
      userId,
    );

    const mp3FilePath = await this.oggFileService.convertOggtoMP3(
      oggFilePath,
      userId,
    );

    const text = await this.openAiService.translateVoiceMp3ToText(mp3FilePath);

    return text || '';
  }

  async getResponseFromChatGPT(messages: Array<IMessage>): Promise<string> {
    const response = await this.openAiService.getResponseFromChatGPT(messages);

    logger.info("User's response - ", response);

    return response?.content || '';
  }
}
