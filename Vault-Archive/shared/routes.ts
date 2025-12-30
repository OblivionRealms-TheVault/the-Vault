import { z } from 'zod';
import { insertFileSchema, files } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ password: z.string() }),
      responses: {
        200: z.object({ authenticated: z.boolean() }),
        401: errorSchemas.unauthorized,
      },
    },
    check: {
      method: 'GET' as const,
      path: '/api/auth/check',
      responses: {
        200: z.object({ authenticated: z.boolean() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  files: {
    list: {
      method: 'GET' as const,
      path: '/api/files',
      responses: {
        200: z.array(z.custom<typeof files.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/files/:id',
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/files',
      input: insertFileSchema,
      responses: {
        201: z.custom<typeof files.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/files/:id',
      input: insertFileSchema.partial(),
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type FileResponse = z.infer<typeof api.files.get.responses[200]>;
