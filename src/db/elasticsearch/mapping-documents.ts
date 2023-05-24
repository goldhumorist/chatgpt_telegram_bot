import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';

export const USER_REQUEST_INDEX = 'user-request-to-chatgpt';

export const mappingDocuments: IndicesCreateRequest[] = [
  {
    index: USER_REQUEST_INDEX,
    mappings: {
      properties: {
        userId: {
          type: 'keyword',
          ignore_above: 256,
        },
        userName: {
          type: 'keyword',
          ignore_above: 256,
        },
        firstName: {
          type: 'text',
        },
        languageCode: {
          type: 'text',
        },
        messageId: {
          type: 'integer',
        },
        question: {
          type: 'text',
        },
        response: {
          type: 'text',
        },
        requestDate: {
          type: 'date',
        },
        responseDate: {
          type: 'date',
        },
      },
    },
  },
];
