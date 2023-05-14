import { config } from './config';
import { loggerFactory } from './helpers/logger.helper';
import { ElasticSearch } from './db/elasticsearch/elasticsearch-connect';
import { mappingDocuments } from './db/elasticsearch/mapping-documents';
import BOT from './app/telegarm-bot-setup';

const logger = loggerFactory.getLogger(__filename);

BOT.launch();

BOT.telegram
  .getMe()
  .then(async () => {
    logger.info('Bot has started', config);
    const elasticSearchInstance = await ElasticSearch.getInstance();
    await elasticSearchInstance.init(mappingDocuments);
  })
  .catch(error => {
    logger.error('Error during launch the bot', error);
    throw error;
  });

process.once('SIGINT', () => BOT.stop('SIGINT'));
process.once('SIGTERM', () => BOT.stop('SIGTERM'));

process.on('unhandledRejection', (reason: Error) => {
  BOT.stop('SIGTERM');
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('uncaughtException', error);

  BOT.stop('SIGTERM');
  process.exit(1);
});
