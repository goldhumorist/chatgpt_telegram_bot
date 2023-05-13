import { loggerFactory } from '../helpers/logger.helper';
import {
  IElasticSearchIndexingService,
  ITelegramContext,
  IUserRequestIndex,
} from '../interfaces';
import { USER_REQUEST_INDEX } from '../db/elasticsearch/mapping-documents';
import { ElasticSearch } from '../db/elasticsearch/elasticsearch-connect';

const logger = loggerFactory.getLogger(__filename);

export class ElasticSearchIndexingService
  implements IElasticSearchIndexingService
{
  private elasticSearchClient: ElasticSearch;
  constructor() {
    this.elasticSearchClient = ElasticSearch.getInstance();
  }

  async indexUserRequst(
    telegramContext: ITelegramContext,
    additionalDataForIndex: {
      question: string;
      response: string;
      requestDate: Date;
      responseDate: Date;
    },
  ): Promise<void> {
    const { question, response, requestDate, responseDate } =
      additionalDataForIndex;

    const userRequestIndex: IUserRequestIndex = {
      userId: telegramContext.message.from.id,
      message_id: telegramContext.message.message_id,
      userName: telegramContext.message.from.username || '',
      firstName: telegramContext.message.from.first_name,
      languageCode: telegramContext.message.from.language_code || '',
      question: question || '',
      response: response || '',
      requestDate,
      responseDate,
    };

    await this.elasticSearchClient.log<IUserRequestIndex>(
      USER_REQUEST_INDEX,
      userRequestIndex,
      {
        index: USER_REQUEST_INDEX,
        id: `user:${userRequestIndex.userName}_${userRequestIndex.message_id}`,
      },
    );

    logger.info('Indexed the object', userRequestIndex);
  }
}
