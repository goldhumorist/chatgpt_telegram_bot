import { ISession } from '../interfaces';

const EXPIRES_AT_SESSION_DEFAULT = 4 * 60 * 60 * 1000; // 4 hours
// const EXPIRES_AT_SESSION_DEFAULT = 60 * 1000; // 60 seconds

export const validateSession = (session: ISession) => {
  const newSessionExpirationDate = new Date(
    new Date().getTime() + EXPIRES_AT_SESSION_DEFAULT,
  );

  const isSessionExpired = new Date() > session?.sessionExpiresAt!;

  if (!session?.sessionExpiresAt || isSessionExpired) {
    return {
      messages: [],
      expiresAt: newSessionExpirationDate,
    };
  }

  return {
    messages: session.messages,
    expiresAt: newSessionExpirationDate,
  };
};
