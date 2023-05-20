import { Axios } from 'axios';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { IOggFileService } from '../interfaces';
import { removeFile } from '../helpers/delete-file.helper';
import { getAxiosInstance } from '../helpers/axios.helper';

export class OggFileService implements IOggFileService {
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

    /* eslint-disable @typescript-eslint/typedef */
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(oggFilePath)
        .audioQuality(6)
        .toFormat('mp3')
        .on('error', error => reject(error))
        .on('end', async () => {
          await removeFile(oggFilePath);
          resolve(mp3FilePath || '');
        })
        /* eslint-disable-next-line security/detect-non-literal-fs-filename */
        .pipe(createWriteStream(mp3FilePath), { end: true });
    });
  }

  async downloadOggFile(url: string, fileName: string): Promise<string> {
    const oggFilePath = resolve(__dirname, '../../voices', `${fileName}.ogg`);

    const response = await this.axiosInstance.get(url, {
      method: 'get',
      responseType: 'stream',
    });

    /* eslint-disable @typescript-eslint/typedef */
    return new Promise((resolve, reject) => {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename */
      const stream = createWriteStream(oggFilePath);

      response.data.pipe(stream);

      stream.on('finish', () => resolve(oggFilePath || ''));
      stream.on('error', error => reject(error));
    });
  }
}
