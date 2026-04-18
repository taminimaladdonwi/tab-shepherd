import { evaluateAndEnqueue, shouldSuspend } from './policy.js';
import { clearQueue, isQueued } from './queue.js';
import { getIdleTabs } from '../inactivity/tracker.js';
import { getConfig } from '../inactivity/config.js';
import { isWhitelisted } from '../inactivity/whitelist.js';
import { getGroup } from '../groups/manager.js';

jest.mock('../inactivity/tracker.js');
jest.mock('../inactivity/config.js');
jest.mock('../inactivity/whitelist.js');
jest.mock('../groups/manager.js');

beforeEach(() => {
  clearQueue();
  getConfig.mockReturnValue({ inactivityThresholdMs: 30 * 60 * 1000 });
  isWhitelisted.mockReturnValue(false);
  getGroup.mockReturnValue(null);
});

test('evaluateAndEnqueue enqueues idle tabs', () => {
  getIdleTabs.mockReturnValue([{ tabId: 10, groupId: 'g1' }, { tabId: 11, groupId: null }]);
  const count = evaluateAndEnqueue();
  expect(count).toBe(2);
  expect(isQueued(10)).toBe(true);
  expect(isQueued(11)).toBe(true);
});

test('evaluateAndEnqueue skips already queued tabs', () => {
  getIdleTabs.mockReturnValue([{ tabId: 10, groupId: 'g1' }]);
  evaluateAndEnqueue();
  const count = evaluateAndEnqueue();
  expect(count).toBe(0);
});

test('evaluateAndEnqueue skips tabs in groups with suspensionDisabled', () => {
  getIdleTabs.mockReturnValue([{ tabId: 20, groupId: 'g-nosuspend' }]);
  getGroup.mockReturnValue({ suspensionDisabled: true });
  const count = evaluateAndEnqueue();
  expect(count).toBe(0);
  expect(isQueued(20)).toBe(false);
});

test('shouldSuspend returns false for whitelisted URL', () => {
  isWhitelisted.mockReturnValue(true);
  expect(shouldSuspend(1, 'https://example.com', null)).toBe(false);
});

test('shouldSuspend returns false for already queued tab', () => {
  const { enqueue } = require('./queue.js');
  enqueue(5, 'g1');
  expect(shouldSuspend(5, 'https://example.com', null)).toBe(false);
});

test('shouldSuspend returns true for eligible tab', () => {
  expect(shouldSuspend(99, 'https://example.com', null)).toBe(true);
});
