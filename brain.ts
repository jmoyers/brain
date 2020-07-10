import { promises } from "fs";
const { writeFile, readFile, stat, mkdir } = promises;
import { join, resolve } from "path";

const brainDir = resolve("./.brain");
const dbFile = join(brainDir, "database");

export async function writeBrain(meta: Object): Promise<void> {
  try {
    await stat(brainDir);
  } catch (e) {
    console.log(e, ".brain dir doesn't exist yet, creating");
    await mkdir(brainDir);
  }

  return writeFile(dbFile, JSON.stringify(meta, null, 2), "utf-8");
}

export async function readBrain(): Promise<Object> {
  const contents = await readFile(dbFile, "utf-8");
  const meta = JSON.parse(contents);
  return meta;
}
