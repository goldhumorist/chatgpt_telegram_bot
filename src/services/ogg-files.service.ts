import axios from 'axios';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { removeFile } from '../helpers/delete-file.helper';
import { loggerFactory } from './../helpers/logger.helper';
const logger = loggerFactory.getLogger(__filename);

class OggFileService {
  private ffmpegInstance: ffmpeg.FfmpegCommand;
  constructor() {
    if (!this.ffmpegInstance) {
      this.ffmpegInstance = ffmpeg.setFfmpegPath(installer.path);
    }
  }

  async convertOggtoMP3(
    oggFilePath: string,
    mp3FileName: string,
  ): Promise<string> {
    try {
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
            resolve(mp3FilePath);
          })
          .on('error', error => reject(error))
          .run();
      });
    } catch (error) {
      logger.error('Error during converting .Ogg to .MP3', error);

      return '';
    }
  }

  async downloadOggFile(URL: string, fileName: string): Promise<string> {
    try {
      const oggFilePath = resolve(__dirname, '../../voices', `${fileName}.ogg`);
      const response = await axios({
        method: 'get',
        url: URL,
        responseType: 'stream',
      });

      return new Promise(resolve => {
        const stream = createWriteStream(oggFilePath);

        response.data.pipe(stream);

        stream.on('finish', () => resolve(oggFilePath));
      });
    } catch (error) {
      logger.error('Error during downloading .Ogg File', error);
      return '';
    }
  }
}

export const oggFileService = new OggFileService();
