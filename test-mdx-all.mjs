import fs from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import path from 'path';

const dir = 'content/villes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
let fail = 0;
for (const f of files) {
  try {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    await compileMDX({ source: raw, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } } });
    console.log('OK', f);
  } catch (e) {
    fail++;
    console.log('FAIL', f, e.message);
  }
}
process.exit(fail > 0 ? 1 : 0);
