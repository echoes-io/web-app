export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Echoes API',
    version: '1.0.0',
    description: 'API for Echoes content management',
  },
  servers: [
    {
      url: '/api',
      description: 'API base path',
    },
  ],
  paths: {
    '/content/sync': {
      post: {
        summary: 'Sync chapter content',
        description: 'Upsert chapter content from timeline repositories',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'timelineName',
                  'arcName',
                  'episodeNumber',
                  'partNumber',
                  'number',
                  'pov',
                  'title',
                  'date',
                  'summary',
                  'location',
                  'words',
                  'characters',
                  'charactersNoSpaces',
                  'paragraphs',
                  'sentences',
                  'readingTimeMinutes',
                  'content',
                ],
                properties: {
                  timelineName: { type: 'string', example: 'anima' },
                  arcName: { type: 'string', example: 'anima' },
                  episodeNumber: { type: 'integer', minimum: 0, example: 1 },
                  partNumber: { type: 'integer', minimum: 1, example: 1 },
                  number: { type: 'integer', minimum: 1, example: 1 },
                  pov: { type: 'string', example: 'nic' },
                  title: { type: 'string', example: 'Login IRL' },
                  date: { type: 'string', example: '2024-04-19, Friday' },
                  summary: { type: 'string', example: 'Chapter summary...' },
                  location: { type: 'string', example: 'Londra' },
                  outfit: { type: 'string', example: 'casual outfit' },
                  kink: { type: 'string', example: 'none' },
                  words: { type: 'integer', minimum: 0, example: 1500 },
                  characters: { type: 'integer', minimum: 0, example: 8000 },
                  charactersNoSpaces: { type: 'integer', minimum: 0, example: 6500 },
                  paragraphs: { type: 'integer', minimum: 0, example: 25 },
                  sentences: { type: 'integer', minimum: 0, example: 80 },
                  readingTimeMinutes: { type: 'integer', minimum: 0, example: 8 },
                  content: { type: 'string', example: '# Chapter content...' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Chapter synced successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    chapter: {
                      type: 'object',
                      properties: {
                        timelineName: { type: 'string' },
                        arcName: { type: 'string' },
                        episodeNumber: { type: 'integer' },
                        partNumber: { type: 'integer' },
                        number: { type: 'integer' },
                      },
                    },
                    stats: {
                      type: 'object',
                      properties: {
                        words: { type: 'integer' },
                        characters: { type: 'integer' },
                        charactersNoSpaces: { type: 'integer' },
                        paragraphs: { type: 'integer' },
                        sentences: { type: 'integer' },
                        readingTimeMinutes: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Validation failed' },
                    details: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Unauthorized' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Internal server error' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Use CONTENT_SYNC_TOKEN as bearer token',
      },
    },
  },
};
