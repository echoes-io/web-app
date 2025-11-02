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
                  'timeline',
                  'arc',
                  'episode',
                  'chapter',
                  'pov',
                  'title',
                  'date',
                  'summary',
                  'location',
                  'content',
                ],
                properties: {
                  timeline: { type: 'string', example: 'anima' },
                  arc: { type: 'string', example: 'anima' },
                  episode: { type: 'integer', example: 1 },
                  part: { type: 'integer', nullable: true, example: 1 },
                  chapter: { type: 'integer', example: 1 },
                  pov: { type: 'string', example: 'nic' },
                  title: { type: 'string', example: 'Login IRL' },
                  date: { type: 'string', example: '2024-04-19, Friday' },
                  summary: { type: 'string', example: 'Chapter summary...' },
                  location: { type: 'string', example: 'Londra' },
                  outfit: { type: 'string', nullable: true, example: null },
                  kink: { type: 'string', nullable: true, example: null },
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
                        timeline: { type: 'string' },
                        arc: { type: 'string' },
                        episode: { type: 'integer' },
                        part: { type: 'integer', nullable: true },
                        chapter: { type: 'integer' },
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
