import { USER_REQUEST_INDEX } from "../db/elasticsearch/mapping-documents";
import { ElasticSearch } from "../db/elasticsearch/elasticsearch-connect";
import { IUserRequestIndex } from "../interfaces";

export class ElasticSearchIndexingService {
  constructor() {}
  private elasticSearchClient = ElasticSearch.getInstance();

  async indexUserRequst(userRequest: IUserRequestIndex) {
    return await this.elasticSearchClient.log<IUserRequestIndex>(
      USER_REQUEST_INDEX,
      userRequest,
      {
        index: USER_REQUEST_INDEX,
        id: `user:${userRequest.userName}_${userRequest.message_id}`,
      },
    );
  }
}

export const elasticSearchIndexingService = new ElasticSearchIndexingService();
