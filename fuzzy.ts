import { go } from "fuzzysort";
import { map } from "lodash";

const findInWorkspace = (phrase, files) => {
  let results = go(phrase, files);
  results = map(results, "target");
  return results;
};

export default findInWorkspace;
