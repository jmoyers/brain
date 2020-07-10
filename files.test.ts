import getAllFiles from "./files";
import { resolve, join } from "path";

test("we should recursively retrieve all files", async () => {
  expect.assertions(1);

  const testPath = resolve("./test");

  const files = await getAllFiles(testPath);

  expect(files).toEqual([
    join(testPath, "1"),
    join(testPath, "2"),
    join(testPath, "202.py"),
    join(testPath, "412.py"),
    join(testPath, "test2", "1"),
    join(testPath, "test2", "2"),
  ]);
});
