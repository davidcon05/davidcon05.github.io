import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    readingTime: z.number(),
    excerpt: z.string(),
    status: z.string().optional(),
    takeaway: z.string().optional(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    order: z.number().optional(),
    projectUrl: z.string().optional(),
    projectName: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
