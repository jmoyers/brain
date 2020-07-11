import { promises } from "fs";
const { writeFile, readFile, stat, mkdir } = promises;
import { join, resolve } from "path";
import getAllFiles from "./files";
import { fingerprintAll, readInfo, writeInfo } from "./fingerprint";
import lodash from "lodash";
import { getAllMetaData } from "./parse";

export async function ensureBrainDir(dir?: string): Promise<void> {
  dir = dir || resolve("./");

  try {
    await stat(join(dir, ".brain"));
  } catch (e) {
    await mkdir(join(dir, ".brain"));
  }
}

export async function writeBrain(meta: Object, dir?: string): Promise<void> {
  dir = dir || resolve("./");

  await ensureBrainDir(dir);

  const brainFile = join(dir, ".brain", "brain");
  return writeFile(brainFile, JSON.stringify(meta, null, 2), "utf-8");
}

export async function readBrain(dir?: string): Promise<Object> {
  dir = dir || resolve("./");

  const brainFile = join(dir, ".brain", "brain");

  const contents = await readFile(brainFile, "utf-8");
  const meta = JSON.parse(contents);
  return meta;
}

export async function brainExists(dir?: string): Promise<boolean> {
  dir = dir || resolve("./");

  const brainFile = join(dir, ".brain", "brain");

  try {
    await stat(brainFile);
    return true;
  } catch (e) {
    return false;
  }
}

export async function resolveBrain(dir?: string): Promise<Object> {
  dir = dir || resolve("./");

  // read brain
  let brain: Object = {};

  if (await brainExists(dir)) {
    brain = await readBrain(dir);
  }

  // get all files out there
  const files = await getAllFiles(dir);

  // check fingerpints of files
  const fps = await fingerprintAll(files);

  // compare to info database
  const info = await readInfo();

  const fileList = Object.keys(fps);
  const filesToUpdate: string[] = [];

  for (const file of fileList) {
    if (!brain[file] || !info[file] || !lodash.isEqual(fps[file], info[file])) {
      filesToUpdate.push(file);
    }
  }

  const updatedMeta = await getAllMetaData(filesToUpdate);

  // update brain as required
  for (const file in updatedMeta) {
    brain[file] = updatedMeta[file];
  }

  // we're leaving danglers in there for now, if something has changed

  await writeBrain(brain, dir);

  // update info as required
  await writeInfo(fps, dir);

  // return brain to caller
  return brain;
}
