import fs from 'fs';
import path from 'path';

export function pkgManager(): string {
  return /yarn/.test(process.env.npm_execpath as string) ? 'yarn' : 'npm';
}

export function hasYarn() {
  return fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
}
