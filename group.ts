/**
 * tags
 *    graph
 *    bfs
 *    dfs
 *    dynamic programming
 *    linked list
 *    heap
 *    hard
 *    medium
 *    easy
 *
 * number
 *    1
 *    2
 *    3
 *
 * title
 *    Two Sum
 *    Number of Islands
 */

const groupBy = (meta: Object) => {
  // get a list of all properties on all files
  const known: Object = {};

  // we'll key off of invidivual property names (e.g. title, number, difficulty)

  // in the case of a property which has a list associated with it, we'll then
  // key off of unique items within the list, as opposed to unique values

  // where the is one item, we'll still return a list of items that are
  // associated with that value and then in the UI, we'll check the len() and
  // link directly to an item

  // for instance, only one note should have the title `Two Sum` and so when we
  // click on that, it will open the note directly in the editor
  for (const file in meta) {
    for (const prop of Object.keys(meta[file])) {
      known[prop] = known[prop] || {};

      const value = meta[file][prop];

      // where we have a list of tags, we'll create a bucket
      // for each unique tag name
      if (Array.isArray(value)) {
        for (const v of value) {
          known[prop][v] = known[prop][v] || [];
          known[prop][v].push(file);
        }
      } else {
        known[prop][value] = known[prop][value] || [];
        known[prop][value].push(file);
      }
    }
  }

  return known;
};

export default groupBy;
