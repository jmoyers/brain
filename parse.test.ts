import { getAllFiles } from "./files";
import { resolve, join } from "path";
import { getAllMetaData } from "./parse";

test("parse front matter for all files", async () => {
  expect.assertions(1);

  const testPath = resolve("./test");

  const files = await getAllFiles(testPath, [], true);

  const meta = await getAllMetaData(files);

  expect(meta).toEqual({
    [join(testPath, "202.py")]: {
      title: "Happy Number",
      number: 202,
      links: ["https://leetcode.com/problems/happy-number/"],
      difficulty: "easy",
    },
    [join(testPath, "412.py")]: {
      title: "Fizz Buzz",
      number: 412,
      links: ["https://leetcode.com/problems/fizz-buzz/"],
      difficulty: "easy",
      tags: ["fizz buzz", "modulus"],
    },
  });
});
