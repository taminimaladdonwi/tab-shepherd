const { exportSnapshots, importSnapshots } = require('./sessionSnapshotExporter');
const { saveSnapshot, getSnapshot, clearAllSnapshots } = require('./sessionSnapshot');

const tabs = [
  { tabId: 10, groupId: 'gA', url: 'https://a.com', title: 'A' },
];

beforeEach(() => clearAllSnapshots());

test('exportSnapshots returns valid JSON with version and snapshots', () => {
  saveSnapshot('sess1', tabs);
  const json = exportSnapshots();
  const parsed = JSON.parse(json);
  expect(parsed.version).toBe(1);
  expect(Array.isArray(parsed.snapshots)).toBe(true);
  expect(parsed.snapshots[0].sessionId).toBe('sess1');
});

test('exportSnapshots returns empty snapshots array when none saved', () => {
  const json = exportSnapshots();
  const parsed = JSON.parse(json);
  expect(parsed.snapshots).toHaveLength(0);
});

test('importSnapshots loads snapshots from exported JSON', () => {
  saveSnapshot('sess1', tabs);
  const json = exportSnapshots();
  clearAllSnapshots();
  const result = importSnapshots(json);
  expect(result.imported).toBe(1);
  expect(result.skipped).toBe(0);
  expect(getSnapshot('sess1')).not.toBeNull();
});

test('importSnapshots skips existing sessions without overwrite', () => {
  saveSnapshot('sess1', tabs);
  const json = exportSnapshots();
  const result = importSnapshots(json);
  expect(result.skipped).toBe(1);
  expect(result.imported).toBe(0);
});

test('importSnapshots overwrites when option is set', () => {
  saveSnapshot('sess1', tabs);
  const json = exportSnapshots();
  const result = importSnapshots(json, { overwrite: true });
  expect(result.imported).toBe(1);
});

test('importSnapshots throws on invalid JSON', () => {
  expect(() => importSnapshots('not json')).toThrow('Invalid JSON');
});

test('importSnapshots throws on missing snapshots key', () => {
  expect(() => importSnapshots(JSON.stringify({ version: 1 }))).toThrow('malformed');
});

test('importSnapshots skips malformed snapshot entries', () => {
  const bad = JSON.stringify({ version: 1, snapshots: [{ sessionId: null, tabs: [] }] });
  const result = importSnapshots(bad);
  expect(result.skipped).toBe(1);
  expect(result.imported).toBe(0);
});
