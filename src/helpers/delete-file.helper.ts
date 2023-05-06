import { unlink } from 'fs/promises';

export const removeFile = async (path: string) => {
  await unlink(path);
};
