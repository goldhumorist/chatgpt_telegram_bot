import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';

export const mappingDocuments: IndicesCreateRequest[] = [
  {
    index: 'user-request-to-chatgpt',
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
        question: {
          type: 'text',
        },
        response: {
          type: 'text',
        },
        questionGotAt: {
          type: 'date',
        },
        responseSendedAt: {
          type: 'date',
        },
      },
    },
  },
];
