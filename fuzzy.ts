import { go } from "fuzzysort";
import { map } from "lodash";

export function findInWorkspace(phrase: string, files: string[]): string[] {
  // the type says its a ReadOnlyArray... its not?
  let results = <any[]>(<unknown>go(phrase, files));
  results = map(results, "target");
  return results;
}
