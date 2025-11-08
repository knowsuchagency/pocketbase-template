import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wranglerPath = join(__dirname, '..', 'wrangler.jsonc');
const overrideName = process.env.WRANGLER_CI_OVERRIDE_NAME;

if (overrideName) {
  const content = readFileSync(wranglerPath, 'utf8');
  const updated = content.replace(/"worker-name"/g, `"${overrideName}"`);
  writeFileSync(wranglerPath, updated);
  console.log(`Updated worker name to: ${overrideName}`);
} else {
  console.log('No WRANGLER_CI_OVERRIDE_NAME set, keeping default worker name');
}
