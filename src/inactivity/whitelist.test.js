import { patternToRegex, isWhitelisted } from './whitelist.js';

test('patternToRegex converts wildcard to regex', () => {
  const regex = patternToRegex('*.example.com');
  expect(regex.test('sub.example.com')).toBe(true);
  expect(regex.test('example.com')).toBe(false);
});

test('patternToRegex handles exact domain', () => {
  const regex = patternToRegex('example.com');
  expect(regex.test('example.com')).toBe(true);
  expect(regex.test('other.com')).toBe(false);
});

test('patternToRegex escapes special regex chars', () => {
  const regex = patternToRegex('example.com/path?q=1');
  expect(regex.test('example.com/path?q=1')).toBe(true);
  expect(regex.test('exampleXcom/pathYq=1')).toBe(false);
});

test('isWhitelisted returns false for empty list', () => {
  expect(isWhitelisted('https://example.com', [])).toBe(false);
});

test('isWhitelisted matches wildcard pattern', () => {
  expect(isWhitelisted('https://sub.example.com/page', ['*.example.com'])).toBe(true);
});

test('isWhitelisted returns false when no pattern matches', () => {
  expect(isWhitelisted('https://other.com', ['*.example.com', 'foo.com'])).toBe(false);
});

test('isWhitelisted matches exact pattern', () => {
  expect(isWhitelisted('https://pinned.com/tab', ['pinned.com'])).toBe(true);
});

test('isWhitelisted handles multiple patterns', () => {
  const patterns = ['*.google.com', 'github.com', '*.notion.so'];
  expect(isWhitelisted('https://docs.google.com', patterns)).toBe(true);
  expect(isWhitelisted('https://github.com/repo', patterns)).toBe(true);
  expect(isWhitelisted('https://workspace.notion.so', patterns)).toBe(true);
  expect(isWhitelisted('https://random.io', patterns)).toBe(false);
});
