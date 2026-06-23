import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

let _cache: Buffer | null = null;

export async function getDaliliLogoPng(sizePx = 88): Promise<Buffer> {
  if (_cache) return _cache;

  const svgPath = path.join(process.cwd(), 'public/images/logo-dalili.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const resvg = new Resvg(svgContent, {
    fitTo: { mode: 'width', value: sizePx },
    background: 'rgba(0,0,0,0)', // transparent
  });

  const pngData = resvg.render();
  const buf = Buffer.from(pngData.asPng());
  _cache = buf;
  return buf;
}
