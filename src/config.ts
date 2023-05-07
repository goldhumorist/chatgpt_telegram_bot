import nodeConfig from 'config';

interface IConfig {
  nodeEnv: string;
  TELEGRAM: { API_KEY: string };
  OPENAI: {
    API_KEY: string;
    CHAT_MODEL: string;
    VOICE_TO_TEXT_MODEL: string;
  };
  ELASTIC_SEARCH: {
    URL: string;
    API_KEY: string;
    USERNAME: string;
    PASSWORD: string;
  };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  TELEGRAM: nodeConfig.get('TELEGRAM'),
  OPENAI: nodeConfig.get('OPENAI'),
  ELASTIC_SEARCH: nodeConfig.get('ELASTIC_SEARCH'),
};
