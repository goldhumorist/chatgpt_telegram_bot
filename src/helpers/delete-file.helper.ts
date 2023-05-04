import { unlink } from 'fs/promises';

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.log('Error during removing file', error);
  }
};
