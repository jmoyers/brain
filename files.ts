import { readdir as _readdir, stat as _stat } from "fs";
import { resolve, join } from "path";
import { promisify } from "util";

const readdir = promisify(_readdir);
const stat = promisify(_stat);

const ignoreList = [
  "__pycache__",
  "node_modules",
  ".git",
  ".mypy",
  ".pytest",
  ".vscode",
  "env",
];

const includesIgnored = (path: Array<string> | string): boolean => {
  if (Array.isArray(path)) {
    for (const p of path) {
      for (const i of ignoreList) {
        if (p.includes(i)) {
          return true;
        }
      }
    }
  } else {
    for (const i of ignoreList) {
      if (path.includes(i)) {
        return true;
      }
    }
  }

  return false;
};

const getAllFiles = async (dirPath, results?) => {
  if (includesIgnored(dirPath)) return results;

  const files = await readdir(dirPath);

  results = results || [];

  for (const file of files) {
    const name = resolve(join(dirPath, file));
    const stats = await stat(name);

    if (stats.isDirectory()) {
      results = await getAllFiles(name, results);
    } else if (!includesIgnored(name)) {
      results.push(name);
    }
  }

  return results;
};

export default getAllFiles;
