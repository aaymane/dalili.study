import fs from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const files = [
  'content/villes/etudier-a-nice.mdx',
  'content/villes/etudier-a-rennes.mdx',
  'content/villes/etudier-a-grenoble.mdx',
  'content/villes/etudier-a-clermont-ferrand.mdx',
  'content/villes/etudier-a-dijon.mdx',
];

for (const f of files) {
  try {
    const raw = fs.readFileSync(f, 'utf8');
    await compileMDX({
      source: raw,
      options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
    });
    console.log('OK', f);
  } catch (e) {
    console.log('FAIL', f, e.message);
  }
}
