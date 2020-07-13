import { promises } from "fs";
const { readdir, stat } = promises;
import { resolve, join } from "path";

const ignoreList: Array<string> = [
  ".brain",
  "__pycache__",
  "node_modules",
  ".git",
  ".mypy",
  ".pytest",
  ".vscode",
  "env",
];

function includesIgnored(path: Array<string> | string): boolean {
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
}

export async function getAllFiles(
  dirPath: string,
  results?: Array<string>,
  absolute?: boolean
): Promise<Array<string>> {
  if (includesIgnored(dirPath)) return results;

  const files = await readdir(dirPath);

  results = results || [];

  for (const file of files) {
    const name = resolve(join(dirPath, file));
    const stats = await stat(name);

    if (stats.isDirectory()) {
      results = await getAllFiles(name, results, true);
    } else if (!includesIgnored(name)) {
      results.push(name);
    }
  }

  if (!absolute) {
    results = results.map((f) => f.replace(dirPath, ""));
    results = results.map((f) => f.replace(/^\/+/, ""));
    results = results.map((f) => f.replace(/^\\+/, ""));
  }

  return results;
}
