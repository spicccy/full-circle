import fs from 'fs';

import { scrapeFloridaMan } from './floridaMan';

const main = async () => {
  const floridaPrompts = await scrapeFloridaMan();
  const text = floridaPrompts.join('\n');
  fs.writeFileSync('florida.txt', text);
};

main();
