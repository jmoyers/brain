import { resolve, join } from "path";
import { promises } from "fs";
const { writeFile, unlink } = promises;
import { infoFile } from "./config";
import {
  fingerprint,
  fingerprintAll,
  shouldUpdate,
  filterShouldUpdate,
  writeInfo,
  readInfo,
} from "./fingerprint";

const testDir = resolve("./test");
const testFile1 = join(testDir, "test_fingerprint1.md");
const testFile2 = join(testDir, "test_fingerprint2.md");

const testFrontMatter1 = [
  "---",
  "title: Happy Number",
  "number: 202",
  "difficulty: easy",
  "links:",
  "- https://leetcode.com/problems/happy-number/",
  "---",
].join("\n");

const testFrontMatter2 = [
  "---",
  "title: Angry Number",
  "number: 203",
  "difficulty: hard",
  "links:",
  "- https://leetcode.com/problems/angry-number/",
  "---",
].join("\n");

async function setupTests(): Promise<void> {
  try {
    await writeFile(testFile1, testFrontMatter1, "utf-8");
    await writeFile(testFile2, testFrontMatter2, "utf-8");
  } catch (e) {
    console.error(e, "Write error front-matter");
  }
  return;
}

async function teardownTests() {
  try {
    await unlink(testFile1);
  } catch (e) {}

  try {
    await unlink(testFile2);
  } catch (e) {}

  try {
    await unlink(infoFile);
  } catch (e) {}
  return;
}

beforeEach(setupTests);
afterEach(teardownTests);

test("we should be able to fingerprint a file", async () => {
  expect.assertions(2);

  const before = new Date(Date.now() - 1000);

  const fp = await fingerprint(testFile1);

  expect(fp["mtime"] >= before).toBeTruthy();
  expect(fp["sha1"]).toEqual("f9247262cb628eaa79de60d6eb7e2111bf106d68");
});

test("should be able to detect a old mtime needs updating", async () => {
  expect.assertions(2);

  const fp = await fingerprint(testFile1);

  if (!fp) return;

  fp["mtime"] = new Date(Date.now() - 200 * 60 * 60);
  let update = await shouldUpdate(testFile1, fp);
  expect(update).toBeTruthy();

  fp["mtime"] = new Date(Date.now() + 200 * 60 * 60);
  update = await shouldUpdate(testFile1, fp);
  expect(update).toBeFalsy();
});

test("should fingerprint all files in a list", async () => {
  expect.assertions(1);

  const files = [testFile1, testFile2];
  const fps = await fingerprintAll(files);

  const fp1 = await fingerprint(testFile1);
  const fp2 = await fingerprint(testFile1);

  expect(fps).toEqual({
    [testFile1]: {
      mtime: fp1["mtime"],
      sha1: "f9247262cb628eaa79de60d6eb7e2111bf106d68",
    },
    [testFile2]: {
      mtime: fp2["mtime"],
      sha1: "95c06b5c2abf03de4b3819b2eaf53a329138e4d2",
    },
  });
});

test("should filter all files that don't need an update", async () => {
  expect.assertions(1);

  const files = [testFile1, testFile2];
  const fps = await fingerprintAll(files);

  const older = new Date(Date.now() - 400 * 60 * 60);

  const names = Object.keys(fps);
  fps[names[1]]["mtime"] = older;

  const filesToUpdate = await filterShouldUpdate(fps);

  expect(filesToUpdate).toEqual([names[1]]);
});

test("we should be able to write and read info meta data", async () => {
  expect.assertions(1);

  try {
    await unlink(infoFile);
  } catch (e) {}

  const files = [testFile1, testFile2];
  const info = await fingerprintAll(files);

  await writeInfo(info);
  const read = await readInfo();

  expect(read).toEqual(info);
});
