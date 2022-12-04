import { findBestMatch } from '../string-similarity';

test('Similarity sanity', () => {
  var result = findBestMatch("blew", ["red", "green", "blue"]);
  var expected = "blue";
  expect(result.bestMatch.target).toBe(expected);
});