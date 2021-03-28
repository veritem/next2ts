import { hasYarn } from './pkgManager';
import { execSync } from 'child_process';

export function HandleInstallPackages(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (hasYarn()) {
      execSync('yarn add --dev typescript @types/react @types/node');
    } else {
      execSync('npm install -D typescript @types/react @types/node');
    }
    execSync('touch tsconfig.json');
  });
}
