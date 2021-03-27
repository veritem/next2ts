import chalk from 'chalk';
import figlet from 'figlet';

export function Header() {
  console.log(
    chalk.blueBright.bold(
      figlet.textSync('next-ts', { horizontalLayout: 'full' })
    )
  );
}
