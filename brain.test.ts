import getAllFiles from "./files";
import { resolve, join } from "path";
import { writeBrain, readBrain } from "./brain";
import { promises } from "fs";
const { rmdir, unlink } = promises;
import getMetaData from "./parse";

test("we should be able to write and read a brain", async () => {
  expect.assertions(1);

  const brainDir = resolve("./.brain");
  const dbFile = join(brainDir, "database");
  const testDir = resolve("./");

  try {
    console.log(`deleting ${dbFile}`);
    await unlink(dbFile);
  } catch (e) {
    console.log(`${dbFile} doesn't exist yet`);
  }

  try {
    console.log(`deleting ${brainDir}`);
    await rmdir(brainDir);
  } catch (e) {
    console.log(`${brainDir} doesn't exist yet`);
  }

  const files = await getAllFiles(testDir);
  const meta = await getMetaData(files);

  const written = await writeBrain(meta);
  const readMeta = await readBrain();

  expect(readMeta).toEqual(meta);
});
