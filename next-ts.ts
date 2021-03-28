import spinner from 'cli-spinners';
import logUpdate from 'log-update';
import { HandleInstallPackages } from './helpers/install';
import chalk from 'chalk';

export async function setupProject() {
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
