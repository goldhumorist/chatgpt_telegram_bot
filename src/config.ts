import nodeConfig from 'config';

interface IConfig {
  nodeEnv: string;
  TELEGRAM: { API_KEY: string };
  OPENAI: { API_KEY: string };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  TELEGRAM: nodeConfig.get('TELEGRAM'),
  OPENAI: nodeConfig.get('OPENAI'),
};
