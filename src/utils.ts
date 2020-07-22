import * as fs from 'fs';
import * as path from 'path';

export async function listFile(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  const dir = await fs.promises.opendir(dirPath);
  for await (const d of dir) {
    const tempName = path.posix.join(dirPath, d.name);
    if (d.isDirectory()) {
      await listFile(tempName).then((res) => files.push(...res));
    } else if (d.isFile()) {
      files.push(tempName);
    }
  }
  return files;
}
