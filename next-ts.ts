import spinner from 'cli-spinners';
import logUpdate from 'log-update';
import { HandleInstallPackages } from './helpers/install';
import chalk from 'chalk';
import { FolderExists } from './helpers/folder-exists';
import { join } from 'path';

export async function setupProject() {
  let pagesExists = await FolderExists(join(__dirname, 'pages'));
  let srcPageExists = await FolderExists(join(__dirname, 'src/pages'));

  if (!pagesExists || !srcPageExists) {
    console.clear();
    console.log('\n');
    console.log(chalk.yellowBright('Next2ts\n'));
    console.log(chalk.red(`This is not a Next.js Project!`));
    process.exit(0);
  }

  try {
    console.log(spinner.dots);
    let i = 0;
    setTimeout(() => {
      const { frames } = spinner.dots;
      logUpdate(frames[(i = ++i % frames.length)] + ' Unicorns');
    }, 3000);
    await HandleInstallPackages();
  } catch (error) {
    console.log(chalk.red(`Failed to install packages`));
    process.exit(0);
  }
}
