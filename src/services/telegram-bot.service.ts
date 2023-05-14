import { ChatRoleEnum } from '../constants';
import {
  IIndexingService,
  IMessageFromContext,
  IChatGPTMessagesHistory,
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
    private indexingService: IIndexingService,
  ) {}

  async getResponseForTextMessage(
    chatGPTMessages: Array<IChatGPTMessagesHistory>,
    messageFromContext: IMessageFromContext,
    question: string,
  ): Promise<string> {
    const requestDate = new Date();

    chatGPTMessages.push({
      role: ChatRoleEnum.user,
      content: question,
    });

    const response = await this.getResponseFromChatGPT(chatGPTMessages);

    const responseDate = new Date();

    await this.indexingService.indexUserRequst(messageFromContext, {
      question,
      response,
      requestDate,
      responseDate,
    });

    return response;
  }

  async getResponseForVoiceMessage(
    oggVoiceFileUrl: string,
    chatGPTMessages: Array<IChatGPTMessagesHistory>,
    messageFromContext: IMessageFromContext,
  ): Promise<{ response: string; question: string }> {
    const requestDate = new Date();

    const question = await this.translateVoiceToText(
      oggVoiceFileUrl,
      String(messageFromContext.id),
    );

    chatGPTMessages.push({
      role: ChatRoleEnum.user,
      content: question,
    });

    const response = await this.getResponseFromChatGPT(chatGPTMessages);

    const responseDate = new Date();

    await this.indexingService.indexUserRequst(messageFromContext, {
      question,
      response,
      requestDate,
      responseDate,
    });

    return { response, question };
  }

  private async translateVoiceToText(
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

  private async getResponseFromChatGPT(
    messages: Array<IChatGPTMessagesHistory>,
  ): Promise<string> {
    const response = await this.openAiService.getResponseFromChatGPT(messages);

    logger.info("User's response - ", response);

    return response?.content || '';
  }
}
