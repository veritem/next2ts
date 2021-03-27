import fs from 'fs';
import path from 'path';

export function FolderExists(folderName: string): boolean {
  if (fs.existsSync(path.resolve(folderName))) {
    return true;
  }
  return false;
}
