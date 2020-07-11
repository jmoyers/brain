import { promises } from "fs";
const { readFile, writeFile, stat } = promises;
import crypto from "crypto";

export async function fingerprintAll(files: string[]): Promise<Object> {
  // stat all the files and find modified time
  const results = {};

  for (const file of files) {
    results[file] = await fingerprint(file);
  }

  return results;
}

export async function fingerprint(file: string): Promise<Object | false> {
  const result = {};

  try {
    result["mtime"] = await mtime(file);
  } catch (e) {
    console.error(e, "File doesn't exist, probably.");
    return false;
  }

  // sha1 - https://stackoverflow.com/q/28792784
  const sha1 = crypto.createHash("sha1");

  try {
    // give me a binary buffer, don't force an coding
    const buffer = await readFile(file);
    sha1.update(buffer);
    result["sha1"] = sha1.digest("hex");
  } catch (e) {
    console.error(e, "Problem reading file for hash");
    return false;
  }

  return result;
}

async function mtime(file: string): Promise<Date | false> {
  try {
    const fileStat = await stat(file);
    return fileStat.mtime;
  } catch (e) {
    console.error(e, "File doesn't exist, probably.");
    return false;
  }
}

export async function shouldUpdate(
  file: string,
  fingerprint: object
): Promise<boolean> {
  return fingerprint["mtime"] < (await mtime(file));
}

export async function filterNeedsUpdate(
  fingerprints: object[]
): Promise<string[]> {
  const results: string[] = [];
  for (const file in fingerprints) {
    if (await shouldUpdate(file, fingerprints[file])) {
      results.push(file);
    }
  }
  return results;
}
