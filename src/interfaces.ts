import { Context, NarrowedContext } from 'telegraf';
import { Update, Message } from 'telegraf/typings/core/types/typegram';

/**
 * The interface for telegram message context has not yet been completed.
 * It may be supplemented
 */
export type ITelegramContext = NarrowedContext<
  IBotContexWithSession,
  {
    message: Update.New &
      Update.NonChannel &
      Message.TextMessage &
      Message.VoiceMessage;
    update_id: number;
  }
>;

export interface IInitialSession {
  messages: Array<{ role: ChatRoleEnum; content: string }>;
}
export enum ChatRoleEnum {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export interface ISession {
  messages: Array<{ role: ChatRoleEnum; content: string }>;
}

export interface IBotContexWithSession extends Context {
  session?: ISession;
}
