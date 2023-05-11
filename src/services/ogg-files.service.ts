import { Axios } from 'axios';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { removeFile } from '../helpers/delete-file.helper';
import { getAxiosInstance } from '../helpers/axios.helper';
import { loggerFactory } from '../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

class OggFileService {
  private ffmpegInstance: ffmpeg.FfmpegCommand;
  private axiosInstance: Axios;
  constructor() {
    if (!this.ffmpegInstance) {
      this.ffmpegInstance = ffmpeg.setFfmpegPath(installer.path);
    }
    if (!this.axiosInstance) {
      this.axiosInstance = getAxiosInstance('');
    }
  }

  async convertOggtoMP3(
    oggFilePath: string,
    mp3FileName: string,
  ): Promise<string> {
    const mp3FilePath = resolve(
      __dirname,
      '../../voices',
      `${mp3FileName}.mp3`,
    );

    return new Promise((resolve, reject) => {
      ffmpeg(oggFilePath)
        .inputOption('-t 30')
        .output(mp3FilePath)
        .on('end', async () => {
          await removeFile(oggFilePath);
          resolve(mp3FilePath || '');
        })
        .on('error', error => reject(error))
        .run();
    });
  }

  async downloadOggFile(url: string, fileName: string): Promise<string> {
    const oggFilePath = resolve(__dirname, '../../voices', `${fileName}.ogg`);

    const response = await this.axiosInstance.get(url, {
      method: 'get',
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      const stream = createWriteStream(oggFilePath);

      response.data.pipe(stream);

      stream.on('finish', () => resolve(oggFilePath || ''));
      stream.on('error', error => reject(error));
    });
  }
}

export const oggFileService = new OggFileService();
