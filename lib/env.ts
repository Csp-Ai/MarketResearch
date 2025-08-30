import { z } from 'zod';

const schema = z
  .object({
    DB_DRIVER: z.enum(['sqlite', 'memory']).default('sqlite'),
    DATABASE_URL: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.DB_DRIVER === 'sqlite' && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required when DB_DRIVER=sqlite',
        path: ['DATABASE_URL'],
      });
    }
  });

export const env = schema.parse(process.env);

