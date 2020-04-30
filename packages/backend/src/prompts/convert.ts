import fs from 'fs';
import path from 'path';

// $ ts-node ./convert.ts <filename>
// file should be list of prompts, separated by newlines

const fileName = process.argv[2];
const baseName = path.basename(fileName, '.txt');

if (!fileName) {
  console.error(
    'Filename not provided! Usage: ts-node ./convert.ts <filename>'
  );
  process.exit(1);
}

const file = fs.readFileSync(fileName, 'utf8');
const prompts = file.split(/\r?\n/);

fs.writeFileSync(`${baseName}.json`, JSON.stringify(prompts, undefined, 2));
