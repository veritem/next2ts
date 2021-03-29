import { access } from 'fs';

export function FolderExists(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    access(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false);
        }
        return reject(err);
      }
      return resolve(true);
    });
  });
}
