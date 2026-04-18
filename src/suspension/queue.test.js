import { enqueue, dequeue, getQueue, isQueued, clearQueue } from './queue.js';

beforeEach(() => {
  clearQueue();
});

test('enqueue adds a tab to the queue', () => {
  enqueue(1, 'group-a', 'inactivity');
  expect(isQueued(1)).toBe(true);
  const q = getQueue();
  expect(q).toHaveLength(1);
  expect(q[0]).toMatchObject({ tabId: 1, groupId: 'group-a', reason: 'inactivity' });
});

test('enqueue is idempotent for the same tabId', () => {
  enqueue(1, 'group-a');
  enqueue(1, 'group-b');
  expect(getQueue()).toHaveLength(1);
  expect(getQueue()[0].groupId).toBe('group-a');
});

test('dequeue removes a tab', () => {
  enqueue(2, 'group-a');
  dequeue(2);
  expect(isQueued(2)).toBe(false);
  expect(getQueue()).toHaveLength(0);
});

test('dequeue on unknown tabId does not throw', () => {
  expect(() => dequeue(999)).not.toThrow();
});

test('getQueue returns all queued entries', () => {
  enqueue(1, 'g1');
  enqueue(2, 'g2');
  enqueue(3, 'g3');
  expect(getQueue()).toHaveLength(3);
});

test('clearQueue empties the queue', () => {
  enqueue(1, 'g1');
  enqueue(2, 'g2');
  clearQueue();
  expect(getQueue()).toHaveLength(0);
});

test('scheduledAt is set on enqueue', () => {
  const before = Date.now();
  enqueue(5, 'g5');
  const after = Date.now();
  const entry = getQueue()[0];
  expect(entry.scheduledAt).toBeGreaterThanOrEqual(before);
  expect(entry.scheduledAt).toBeLessThanOrEqual(after);
});
