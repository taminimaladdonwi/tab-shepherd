import {
  getTotalRestoreCount,
  getRestoreCountByGroup,
  getAverageTimeBetweenRestores,
  getMostRestoredGroup,
  getGroupRestoreSummary
} from './restoreStats.js';
import { clearRestoreHistory, recordRestore } from './restoreHistory.js';

beforeEach(() => {
  clearRestoreHistory();
});

test('getTotalRestoreCount returns 0 when no history', () => {
  expect(getTotalRestoreCount()).toBe(0);
});

test('getTotalRestoreCount counts all restores', () => {
  recordRestore('tab1', 'group-a', 1000);
  recordRestore('tab2', 'group-b', 2000);
  expect(getTotalRestoreCount()).toBe(2);
});

test('getRestoreCountByGroup returns counts per group', () => {
  recordRestore('tab1', 'group-a', 1000);
  recordRestore('tab2', 'group-a', 2000);
  recordRestore('tab3', 'group-b', 3000);
  const counts = getRestoreCountByGroup();
  expect(counts['group-a']).toBe(2);
  expect(counts['group-b']).toBe(1);
});

test('getAverageTimeBetweenRestores returns null for fewer than 2 restores', () => {
  recordRestore('tab1', 'group-a', 1000);
  expect(getAverageTimeBetweenRestores()).toBeNull();
});

test('getAverageTimeBetweenRestores computes average gap', () => {
  recordRestore('tab1', 'group-a', 1000);
  recordRestore('tab2', 'group-a', 3000);
  recordRestore('tab3', 'group-b', 7000);
  expect(getAverageTimeBetweenRestores()).toBe(3000);
});

test('getMostRestoredGroup returns group with highest count', () => {
  recordRestore('tab1', 'group-a', 1000);
  recordRestore('tab2', 'group-b', 2000);
  recordRestore('tab3', 'group-b', 3000);
  expect(getMostRestoredGroup()).toBe('group-b');
});

test('getMostRestoredGroup returns null when no history', () => {
  expect(getMostRestoredGroup()).toBeNull();
});

test('getGroupRestoreSummary returns summary for each group', () => {
  recordRestore('tab1', 'group-a', 1000);
  recordRestore('tab2', 'group-a', 5000);
  const summary = getGroupRestoreSummary();
  expect(summary['group-a'].count).toBe(2);
  expect(summary['group-a'].firstRestore).toBe(1000);
  expect(summary['group-a'].lastRestore).toBe(5000);
});
