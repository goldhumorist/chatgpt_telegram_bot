import path from 'path';
import { config } from './../config';
import { pino } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  customPrettifiers: {
    caller: caller => `${caller}`,
  },
  singleLine: true,
});

export const pinoForLogger = pino({}, stream);

class Logger {
  private _logger: pino.Logger;

  constructor(fileName: string) {
    this._logger = pinoForLogger.child({
      name: path.relative(process.cwd(), fileName)?.replace(/\//g, '.'),
    });
  }

  info(message: string, ...args: any) {
    return this._logger.info(args, message);
  }

  trace(message: string, ...args: any) {
    return this._logger.trace(args, message);
  }

  warn(message: string, ...args: any) {
    return this._logger.warn(args, message);
  }

  debug(message: string, ...args: any) {
    return this._logger.debug(args, message);
  }
  error(message: string, error: any) {
    this._logger.error(error, message);
  }
}

class LoggerFactory {
  getLogger = (fileName: string) => {
    return new Logger(fileName);
  };
}

export const loggerFactory = new LoggerFactory();
