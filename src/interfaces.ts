import { Context, NarrowedContext } from 'telegraf';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import { ChatCompletionResponseMessage } from 'openai';
import { ChatRoleEnum } from './constants';

/**
 * The interface for telegram message context has not yet been completed.
 * It may be supplemented
 */
export type ITelegramContext = NarrowedContext<
  IBotContextWithSession,
  {
    message: Update.New &
      Update.NonChannel &
      Message.TextMessage &
      Message.VoiceMessage;
    update_id: number;
  }
>;
export interface IMessage {
  role: ChatRoleEnum;
  content: string;
}

export interface IInitialSession {
  messages: Array<IMessage>;
}

export interface ISession {
  messages: Array<IMessage>;
}

export interface IBotContextWithSession extends Context {
  session?: ISession;
}

export interface IUserRequestIndex {
  userId: string | number;
  userName: string;
  firstName: string;
  languageCode: string;
  message_id: number;
  question: string;
  response: string;
  requestDate: Date;
  responseDate: Date;
}

export interface ITelegramBotService {
  translateVoiceToText(
    oggVoiceFileUrl: string,
    userId: string,
  ): Promise<string>;

  getResponseFromChatGPT(messages: Array<IMessage>): Promise<string>;
}

export interface IOggFileService {
  convertOggtoMP3(oggFilePath: string, mp3FileName: string): Promise<string>;

  downloadOggFile(url: string, fileName: string): Promise<string>;
}

export interface IOpenAiService {
  getResponseFromChatGPT(
    messages: Array<IMessage>,
  ): Promise<ChatCompletionResponseMessage>;

  translateVoiceMp3ToText(voiceFilePath: string): Promise<string>;
}

export interface IElasticSearchIndexingService {
  indexUserRequst(
    telegramContext: ITelegramContext,
    additionalDataForIndex: {
      question: string;
      response: string;
      requestDate: Date;
      responseDate: Date;
    },
  ): Promise<void>;
}
