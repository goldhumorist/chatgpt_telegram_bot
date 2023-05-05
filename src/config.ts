import nodeConfig from 'config';

interface IConfig {
  nodeEnv: string;
  TELEGRAM: { API_KEY: string };
  OPENAI: {
    API_KEY: string;
    CHAT_MODEL: string;
    VOICE_TO_TEXT_MODEL: string;
  };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  TELEGRAM: nodeConfig.get('TELEGRAM'),
  OPENAI: nodeConfig.get('OPENAI'),
};
