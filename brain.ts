import { promises } from "fs";
const { writeFile, readFile, stat, mkdir } = promises;
import { join, resolve } from "path";

export const brainDir = resolve("./.brain");
export const dbFile = join(brainDir, "brain");

export async function ensureBrainDir(): Promise<void> {
  try {
    await stat(brainDir);
  } catch (e) {
    console.log(e, ".brain dir doesn't exist yet, creating");
    await mkdir(brainDir);
  }
}

export async function writeBrain(meta: Object): Promise<void> {
  await ensureBrainDir();
  return writeFile(dbFile, JSON.stringify(meta, null, 2), "utf-8");
}

export async function readBrain(): Promise<Object> {
  const contents = await readFile(dbFile, "utf-8");
  const meta = JSON.parse(contents);
  return meta;
}
