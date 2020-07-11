import matter from "gray-matter";
import util from "util";
import fs from "fs";

const readFile = util.promisify(fs.readFile);

export async function getMetaData(file: string): Promise<object | void> {
  const contents: string = await readFile(file, "utf8");
  const lines: string[] = contents.split("\n");

  const meta_block: string[] = [];
  let meta_start: boolean = false;

  for (const line of lines) {
    if (line == "---" && !meta_start) {
      meta_start = true;
    } else if (line === "---" && meta_start) {
      meta_start = false;
      meta_block.push(line);
    }

    if (meta_start) {
      meta_block.push(line);
    }
  }

  if (meta_block.length) {
    // it's okay to fail sometimes...
    try {
      const parsed = matter(meta_block.join("\n"));
      return parsed.data;
    } catch (e) {
      console.log(`${file} has no front-matter`);
      return;
    }
  }
}

export async function getAllMetaData(files: string[]): Promise<object> {
  const meta = {};

  for (const file of files) {
    const info = await getMetaData(file);

    if (info) {
      meta[file] = info;
    }
  }

  return meta;
}
