import axios, { AxiosError, AxiosResponse } from 'axios';
import { loggerFactory } from './logger.helper';
const logger = loggerFactory.getLogger(__filename);

export const getAxiosInstance = (
  baseURL: string,
  headers?: { [key: string]: string },
) => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      ...headers,
    },
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response && error.response.data) {
        logger.error(
          'Axios error',
          new Error(`error from response: ${error?.config?.url}`),
        );
      }
      throw error;
    },
  );

  return axiosInstance;
};
