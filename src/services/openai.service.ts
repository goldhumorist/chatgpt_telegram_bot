import {
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai';
import { createReadStream } from 'fs';
import { IMessage, IOpenAiService } from '../interfaces';
import { config } from '../config';
import { removeFile } from '../helpers/delete-file.helper';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

export class OpenAiService implements IOpenAiService {
  private openAi: OpenAIApi;
  private openAiVoiceToTextModel: string = config.OPENAI.VOICE_TO_TEXT_MODEL;
  private openAiChatModel: string = config.OPENAI.CHAT_MODEL;

  constructor() {
    if (!this.openAi) {
      const configuration = new Configuration({
        apiKey: config.OPENAI.API_KEY,
      });
      this.openAi = new OpenAIApi(configuration);
    }
  }

  async getResponseFromChatGPT(
    messages: Array<IMessage>,
  ): Promise<ChatCompletionResponseMessage> {
    const response = await this.openAi.createChatCompletion({
      model: this.openAiChatModel,
      messages,
    });

    return (response?.data?.choices[0]?.message || {
      content: 'Something went wrong',
    }) as ChatCompletionResponseMessage;
  }

  async translateVoiceMp3ToText(voiceFilePath: string): Promise<string> {
    const response = await this.openAi.createTranscription(
      createReadStream(voiceFilePath) as any as File,
      this.openAiVoiceToTextModel,
    );

    await removeFile(voiceFilePath);

    return response?.data?.text || '';
  }
}
