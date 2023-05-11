import {
  IElasticSearchIndexingService,
  IUserRequestIndex,
} from '../interfaces';
import { USER_REQUEST_INDEX } from '../db/elasticsearch/mapping-documents';
import { ElasticSearch } from '../db/elasticsearch/elasticsearch-connect';

export class ElasticSearchIndexingService
  implements IElasticSearchIndexingService
{
  private elasticSearchClient: ElasticSearch;
  constructor() {
    this.elasticSearchClient = ElasticSearch.getInstance();
  }

  async indexUserRequst(userRequest: IUserRequestIndex): Promise<void> {
    await this.elasticSearchClient.log<IUserRequestIndex>(
      USER_REQUEST_INDEX,
      userRequest,
      {
        index: USER_REQUEST_INDEX,
        id: `user:${userRequest.userName}_${userRequest.message_id}`,
      },
    );
  }
}
