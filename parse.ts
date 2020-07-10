import matter from "gray-matter";
import util from "util";
import fs from "fs";

const readFile = util.promisify(fs.readFile);

const getMetaData = async (files: string[]) => {
  const meta = {};

  for (const file of files) {
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
        meta[file] = parsed.data;
      } catch (e) {}
    }
  }

  return meta;
};

export default getMetaData;
