import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import puppeteer from 'puppeteer-core';

const siteUrl = process.env.PROMO_SITE_URL || 'http://127.0.0.1:4197';
const outDir = resolve('public/textures/live');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

await mkdir(outDir, {recursive: true});

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: [
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-background-networking',
    '--disable-component-update',
  ],
});

const page = await browser.newPage();
await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 2});
await page.goto(siteUrl, {waitUntil: 'networkidle0'});
await page.waitForFunction(() => document.querySelectorAll('#contact-table-body tr').length >= 6, {timeout: 20_000});
if (await page.$eval('#privacy-toggle', (el) => el.getAttribute('aria-pressed') === 'true')) {
  await page.click('#privacy-toggle');
  await page.waitForFunction(() => document.querySelector('#privacy-toggle')?.getAttribute('aria-pressed') === 'false');
}
await page.evaluate(async () => {
  await document.fonts.ready;
  document.documentElement.style.scrollBehavior = 'auto';
  const style = document.createElement('style');
  style.textContent = '* { caret-color: transparent !important; }';
  document.head.append(style);
});
await new Promise((resolveWait) => setTimeout(resolveWait, 900));

const snapshotElement = async (selector, file, index = 0) => {
  const elements = await page.$$(selector);
  const element = elements[index];
  if (!element) throw new Error(`Capture selector missing: ${selector}[${index}]`);
  await element.screenshot({path: resolve(outDir, file)});
};

const readLayout = async () => page.evaluate(() => {
  const box = (selector, index = 0) => {
    const el = document.querySelectorAll(selector)[index];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height};
  };
  return {
    viewport: {width: innerWidth, height: innerHeight, dpr: devicePixelRatio},
    page: {width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight},
    elements: {
      brand: box('.brand-lockup'),
      rhythmPanel: box('#rhythm-panel'),
      chronometer: box('.chronometer-panel'),
      queue: box('.queue-panel'),
      filterBench: box('.filter-bench'),
      ledger: box('.table-wrap'),
      privacyFootnote: box('.privacy-footnote'),
      firstQueueItem: box('.queue-item', 0),
      secondQueueItem: box('.queue-item', 1),
      firstContactRow: box('#contact-table-body tr', 0),
    },
  };
});

const layout = await readLayout();
await page.screenshot({path: resolve(outDir, 'home-full@2x.png'), fullPage: true});
await snapshotElement('#rhythm-panel', 'rhythm-panel@2x.png');
await snapshotElement('.chronometer-panel', 'chronometer@2x.png');
await snapshotElement('.queue-panel', 'queue@2x.png');
await snapshotElement('.filter-bench', 'filter-bench@2x.png');
await snapshotElement('#contact-table-body tr', 'contact-row@2x.png');
await snapshotElement('.brand-lockup', 'brand-lockup@2x.png');

await page.click('.queue-item [data-contact-id]');
await page.waitForSelector('#contact-dialog[open]');
await new Promise((resolveWait) => setTimeout(resolveWait, 420));
await snapshotElement('#contact-dialog .dialog-frame', 'contact-dialog@2x.png');
await page.screenshot({path: resolve(outDir, 'contact-dialog-page@2x.png')});
await page.$eval('#contact-dialog-content .contact-detail-body', (element) => {
  element.scrollTop = element.scrollHeight;
});
await new Promise((resolveWait) => setTimeout(resolveWait, 320));
await snapshotElement('#contact-dialog .dialog-frame', 'contact-dialog-action@2x.png');
await page.screenshot({path: resolve(outDir, 'contact-dialog-action-page@2x.png')});
await page.click('#contact-dialog-content [data-action="maintained"]');
await page.waitForFunction(() => {
  const toast = document.querySelector('#toast');
  return toast && !toast.hidden && toast.textContent.includes('已记录本次问候');
});
await new Promise((resolveWait) => setTimeout(resolveWait, 160));
await snapshotElement('#toast', 'greeting-success-toast@2x.png');
await page.screenshot({path: resolve(outDir, 'contact-dialog-success-page@2x.png')});
await page.click('#contact-dialog .dialog-close');

await page.type('#search-input', '最近', {delay: 80});
await page.waitForFunction(() => document.querySelectorAll('#contact-table-body tr').length === 2);
await new Promise((resolveWait) => setTimeout(resolveWait, 420));
await page.screenshot({path: resolve(outDir, 'search-recent-full@2x.png'), fullPage: true});
await snapshotElement('.table-wrap', 'search-recent-ledger@2x.png');
await page.click('#search-input', {clickCount: 3});
await page.keyboard.press('Backspace');
await page.waitForFunction(() => document.querySelectorAll('#contact-table-body tr').length >= 6);

await page.click('#privacy-toggle');
await page.waitForFunction(() => document.querySelector('#privacy-toggle')?.getAttribute('aria-pressed') === 'true');
await new Promise((resolveWait) => setTimeout(resolveWait, 420));
await page.screenshot({path: resolve(outDir, 'privacy-page@2x.png')});
await snapshotElement('.queue-panel', 'privacy-queue@2x.png');

layout.states = {
  data: 'Built-in fictional demo contacts in a fresh isolated SQLite directory',
  home: 'privacyMode=false',
  privacy: 'privacyMode=true',
};
await writeFile(resolve(outDir, 'layout.json'), `${JSON.stringify(layout, null, 2)}\n`, 'utf8');

await browser.close();
process.stdout.write(`${JSON.stringify({ok: true, siteUrl, outDir, layout}, null, 2)}\n`);
