import { getAllFiles } from "./files";
import { resolve, join } from "path";

test("we should recursively retrieve all files", async () => {
  expect.assertions(1);

  const testPath = resolve("./test");

  const files = await getAllFiles(testPath);

  expect(files).toEqual([
    "1",
    "2",
    "202.py",
    "412.py",
    join("test2", "1"),
    join("test2", "2"),
  ]);
});
