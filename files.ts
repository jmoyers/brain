import { readdir as _readdir, stat as _stat } from "fs";
import { resolve, join } from "path";
import { promisify } from "util";

const readdir = promisify(_readdir);
const stat = promisify(_stat);

const getAllFiles = async (dirPath, results?) => {
  const files = await readdir(dirPath);

  results = results || [];

  for (const file of files) {
    const name = resolve(join(dirPath, file));
    const stats = await stat(name);

    if (stats.isDirectory()) {
      results = await getAllFiles(name, results);
    } else {
      results.push(name);
    }
  }

  return results;
};

export default getAllFiles;
