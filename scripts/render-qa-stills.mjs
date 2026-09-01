import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';

const frames = [45, 95, 144, 153, 170, 225, 304, 350, 408, 430, 500, 550, 570, 584, 644, 648, 652, 700, 756, 770, 791, 810, 850, 872, 930, 1008, 1074, 1075, 1090, 1170];
const outputDirectory = resolve('out/qa-revised');
const browserExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

await mkdir(outputDirectory, {recursive: true});
const serveUrl = await bundle({entryPoint: resolve('src/index.ts')});
const compositions = await getCompositions(serveUrl, {browserExecutable});
const composition = compositions.find((item) => item.id === 'RelationshipEchoPromoBgm');
if (!composition) throw new Error('RelationshipEchoPromoBgm composition not found');

for (const frame of frames) {
  const output = resolve(outputDirectory, `frame-${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    imageFormat: 'png',
    browserExecutable,
  });
  process.stdout.write(`${frame}\t${output}\n`);
}
