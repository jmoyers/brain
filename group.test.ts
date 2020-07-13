import { getAllFiles } from "./files";
import { resolve, join } from "path";
import { getAllMetaData } from "./parse";
import groupBy from "./group";

test("group files by attributes", async () => {
  expect.assertions(1);

  const testPath = resolve("./test");
  const files = await getAllFiles(testPath, [], true);
  const meta = await getAllMetaData(files);

  const groups = groupBy(meta);

  const f1 = join(testPath, "202.py");
  const f2 = join(testPath, "412.py");

  expect(groups).toEqual({
    title: {
      "Happy Number": [f1],
      "Fizz Buzz": [f2],
    },
    links: {
      "https://leetcode.com/problems/happy-number/": [f1],
      "https://leetcode.com/problems/fizz-buzz/": [f2],
    },
    number: {
      "202": [f1],
      "412": [f2],
    },
    difficulty: {
      easy: [f1, f2],
    },
    tags: {
      "fizz buzz": [f2],
      modulus: [f2],
    },
  });
});
