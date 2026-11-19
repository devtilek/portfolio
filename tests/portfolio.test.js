const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('local assets and fragment links exist', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, fragment] of html.matchAll(/href="#([^"#]+)"/g)) {
    assert.ok(ids.has(fragment), `Missing fragment: ${fragment}`);
  }
  for (const [, asset] of html.matchAll(/(?:href|src)="([^"#:]+\.(?:css|js|svg))"/g)) {
    assert.ok(fs.existsSync(path.join(root, asset)), `Missing asset: ${asset}`);
  }
});

test('all new-tab links explicitly protect the opener', () => {
  for (const [link] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(link, /rel="[^" ]*noopener[^\"]*"/);
  }
});

test('reduced-motion fallback reveals content and copies the current address', async () => {
  let click;
  let copied;
  let revealed = false;
  const status = {};
  const year = {};
  const elements = {
    '#year': year,
    '#copy-email': { addEventListener: (_, handler) => { click = handler; } },
    '#copy-status': status,
    '.email': { getAttribute: () => 'mailto:hello@example.com' }
  };
  vm.runInNewContext(script, {
    document: {
      querySelectorAll: () => [{ classList: { add: () => { revealed = true; } } }],
      querySelector: selector => elements[selector]
    },
    window: { IntersectionObserver: true, matchMedia: () => ({ matches: true }) },
    navigator: { clipboard: { writeText: async value => { copied = value; } } }
  });
  assert.equal(revealed, true);
  assert.equal(year.textContent, new Date().getFullYear());
  await click();
  assert.equal(copied, 'hello@example.com');
  assert.equal(status.textContent, 'Email скопирован.');
});
