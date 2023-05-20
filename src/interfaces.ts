import { Context, NarrowedContext } from 'telegraf';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import { ChatCompletionResponseMessage } from 'openai';
import { ChatRoleEnum } from './constants';

export interface IChatGPTMessagesHistory {
  role: ChatRoleEnum;
  content: string;
}
export interface ISession {
  messages: Array<IChatGPTMessagesHistory>;
  sessionExpiresAt: Date | null;
}

export interface IBotContextWithSession extends Context {
  session?: ISession;
}

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

export interface IMessageFromContext {
  message_id: number;
  id?: number;
  username?: string | undefined;
  first_name?: string | undefined;
  language_code?: string | undefined;
}

export interface ITelegramBotService {
  getResponseForTextMessage(
    chatGPTMessages: Array<IChatGPTMessagesHistory>,
    messageFromContext: IMessageFromContext,
    singleQuestion: string,
  ): Promise<string>;

  getResponseForVoiceMessage(
    oggVoiceFileUrl: string,
    chatGPTMessages: Array<IChatGPTMessagesHistory>,
    messageFromContext: IMessageFromContext,
  ): Promise<{ response: string; question: string }>;
}

export interface IOggFileService {
  convertOggtoMP3(oggFilePath: string, mp3FileName: string): Promise<string>;

  downloadOggFile(url: string, fileName: string): Promise<string>;
}

export interface IOpenAiService {
  getResponseFromChatGPT(
    messages: Array<IChatGPTMessagesHistory>,
  ): Promise<ChatCompletionResponseMessage>;

  translateVoiceMp3ToText(voiceFilePath: string): Promise<string>;
}

export interface IIndexingService {
  indexUserRequst(
    messageFromContext: IMessageFromContext,
    additionalDataForIndex: {
      question: string;
      response: string;
      requestDate: Date;
      responseDate: Date;
    },
  ): Promise<void>;
}
