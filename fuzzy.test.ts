import { resolve, join } from "path";
import { findInWorkspace } from "./fuzzy";
import { getAllFiles } from "./files";

test("find a file in a workspace", async () => {
  expect.assertions(2);

  const testPath = resolve("./test");
  const files = await getAllFiles(testPath);
  const file = findInWorkspace("1", files);

  expect(file[0]).toEqual("1");
  expect(file[1]).toEqual(join("test2", "1"));
});
