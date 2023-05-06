import { unlink } from 'fs/promises';
import { loggerFactory } from './logger.helper';
const logger = loggerFactory.getLogger(__filename);

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    logger.error('Error during removing file', error);
  }
};
