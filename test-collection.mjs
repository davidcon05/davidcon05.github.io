import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
console.log('Number of posts:', allPosts.length);
console.log('Posts:', allPosts.map(p => ({
  slug: p.slug,
  id: p.id,
  data: p.data
})));
