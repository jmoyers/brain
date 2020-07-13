import { getAllFiles } from "./files";
import { resolve } from "path";
import { writeBrain, readBrain, resolveBrain } from "./brain";
import { promises } from "fs";
const { rmdir, unlink, writeFile } = promises;
import { getAllMetaData, getMetaData } from "./parse";
import { join } from "path";

const testDir = resolve("./test");
const brainDir = join(testDir, ".brain");
const brainFile = join(testDir, ".brain", "brain");
const infoFile = join(testDir, ".brain", "info");
const testFile = join(testDir, "test_fingerprint1.md");

async function setup(): Promise<void> {
  try {
    await unlink(brainFile);
  } catch (e) {}

  try {
    await unlink(infoFile);
  } catch (e) {}

  try {
    await unlink(testFile);
  } catch (e) {}

  try {
    await rmdir(brainDir);
  } catch (e) {}

  return;
}

async function createTestFile(): Promise<void> {
  const fm = [
    "---",
    "title: Happy Number",
    "number: 202",
    "difficulty: easy",
    "links:",
    "- https://leetcode.com/problems/happy-number/",
    "---",
  ].join("\n");

  try {
    await writeFile(testFile, fm, "utf-8");
  } catch (e) {
    console.error(e, "Write error front-matter");
  }
  return;
}

async function deleteTestFile(): Promise<void> {
  try {
    await unlink(testFile);
  } catch (e) {}
  return;
}

beforeEach(setup);
afterEach(deleteTestFile);

test("we should be able to write and read a brain", async () => {
  expect.assertions(1);

  const files = await getAllFiles(testDir, [], true);
  const meta = await getAllMetaData(files);

  await writeBrain(meta);
  const readMeta = await readBrain();

  expect(readMeta).toEqual(meta);
});

test("we should be able to detect new files and update brain", async () => {
  expect.assertions(2);

  await resolveBrain(testDir);

  let brain = await readBrain();

  const files = await getAllFiles(testDir, [], true);
  const meta = await getAllMetaData(files);

  expect(brain).toEqual(meta);

  await createTestFile();

  const newBrain = await resolveBrain(testDir);

  const newMeta = await getMetaData(testFile);
  brain[testFile] = newMeta;

  expect(brain).toEqual(newBrain);
});
