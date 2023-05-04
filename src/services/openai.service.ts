import {
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai';
import { createReadStream } from 'fs';
import { config } from '../config';
import { removeFile } from '../helpers/delete-file.helper';
import { ChatRoleEnum } from '../interfaces';

class OpenAiService {
  private openAi: OpenAIApi;

  constructor() {
    if (!this.openAi) {
      const configuration = new Configuration({
        apiKey: config.OPENAI.API_KEY,
      });
      this.openAi = new OpenAIApi(configuration);
    }
  }

  async getResponseFromChatGPT(
    messages: Array<{ role: ChatRoleEnum; content: string }>,
  ): Promise<ChatCompletionResponseMessage> {
    try {
      const response = await this.openAi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });

      return response.data.choices[0].message as ChatCompletionResponseMessage;
    } catch (error) {
      console.log('Error during request to ChatGPT', error);

      return {
        content: 'Something went wrong',
      } as ChatCompletionResponseMessage;
    }
  }

  async translateVoiceToText(voiceFilePath: string): Promise<any> {
    try {
      const response = await this.openAi.createTranscription(
        createReadStream(voiceFilePath) as any as File,
        'whisper-1',
      );

      await removeFile(voiceFilePath);

      return response.data.text;
    } catch (error) {
      console.log('Error during transcription voice to text', error);
    }
  }
}

export const openAiService = new OpenAiService();