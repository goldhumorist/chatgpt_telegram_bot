import {
  IndicesCreateRequest,
  IndexRequest,
} from '@elastic/elasticsearch/lib/api/types';
import {
  Client,
  HttpConnection,
  TransportRequestOptions,
} from '@elastic/elasticsearch';
import { config } from '../../config';
import { loggerFactory } from '../../helpers/logger.helper';

const logger = loggerFactory.getLogger(__filename);

export class ElasticSearch {
  /* eslint-disable no-use-before-define */
  private static instance: ElasticSearch;
  private static client: Client;

  static getInstance(): ElasticSearch {
    if (ElasticSearch.instance) return ElasticSearch.instance;

    ElasticSearch.client = new Client({
      node: config.ELASTIC_SEARCH.URL,
      auth: {
        apiKey: config.ELASTIC_SEARCH.API_KEY,
        username: config.ELASTIC_SEARCH.USERNAME,
        password: config.ELASTIC_SEARCH.PASSWORD,
      },
      requestTimeout: 1000 * 60 * 60,

      Connection: HttpConnection,
    });

    ElasticSearch.client
      .ping()
      .then(() => {
        logger.info('Connected to Elasticsearch was successful!');
      })
      .catch((error: Error) => {
        logger.error('Connection to Elasticsearch unavailable', error);
        throw error;
      });

    ElasticSearch.instance = new ElasticSearch();

    return ElasticSearch.instance;
  }

  async init(documents: IndicesCreateRequest[]): Promise<void> {
    logger.info('Validate documents');
    const docStatuses = await Promise.all(documents.map(this.isDocumentExists));

    logger.info(
      'Document statuses',
      docStatuses.map(
        (docStatuses: { document: IndicesCreateRequest; exists: boolean }) => {
          const { document, exists } = docStatuses;
          return {
            docName: document.index,
            exists,
          };
        },
      ),
    );

    const notExistingDocuments = docStatuses.filter(
      (docStatuses: { exists: boolean }) => !docStatuses.exists,
    );

    if (notExistingDocuments.length) {
      logger.info('Create new documents');
      await this.createDocuments(
        notExistingDocuments.map(
          (docStatuses: { document: IndicesCreateRequest }) =>
            docStatuses.document,
        ),
      );
    }
  }

  async log<T>(
    index: string,
    payload: T,
    params?: IndexRequest | IndexRequest,
    options?: TransportRequestOptions,
  ): Promise<void> {
    ElasticSearch.client.index<T>(
      {
        index,
        document: payload,
        ...params,
      },
      options,
    );
  }

  private async isDocumentExists(
    document: IndicesCreateRequest,
  ): Promise<{ exists: boolean; document: IndicesCreateRequest }> {
    let index;
    try {
      index = await ElasticSearch.client.indices.exists({
        index: document.index,
      });
    } catch (error) {
      index = null;
    }

    return {
      exists: !!index,
      document,
    };
  }

  private async createDocuments(
    documents: IndicesCreateRequest[],
  ): Promise<void> {
    await Promise.all(
      documents.map((document: IndicesCreateRequest) =>
        ElasticSearch.client.indices.create(document),
      ),
    );
  }
}
