import matter from "gray-matter";
import util from "util";
import fs from "fs";

const readFile = util.promisify(fs.readFile);

const getMetaData = async (files) => {
  const meta = {};

  for (const file of files) {
    const contents = await readFile(file, "utf8");

    const lines = contents.split("\n");

    const meta_block = [];
    let meta_start = false;

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
      const parsed = matter(meta_block.join("\n"));
      meta[file] = parsed.data;
    }
  }

  return meta;
};

export default getMetaData;
