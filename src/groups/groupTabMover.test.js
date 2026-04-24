import {
  moveTab,
  moveTabs,
  getMoveHistory,
  clearMoveHistory,
} from './groupTabMover.js';
import { createGroup, getGroup } from './manager.js';

function setup() {
  const a = createGroup('Alpha');
  const b = createGroup('Beta');
  return { a, b };
}

beforeEach(() => {
  clearMoveHistory();
});

describe('moveTab', () => {
  test('moves a tab from one group to another', () => {
    const { a, b } = setup();
    a.tabs.push('tab-1');

    const result = moveTab('tab-1', a.id, b.id);
    expect(result.tabs).toContain('tab-1');
    expect(getGroup(a.id).tabs).not.toContain('tab-1');
  });

  test('throws if source group does not exist', () => {
    const { b } = setup();
    expect(() => moveTab('tab-1', 'nonexistent', b.id)).toThrow(
      'Source group not found'
    );
  });

  test('throws if target group does not exist', () => {
    const { a } = setup();
    a.tabs.push('tab-2');
    expect(() => moveTab('tab-2', a.id, 'nonexistent')).toThrow(
      'Target group not found'
    );
  });

  test('throws if tab is not in source group', () => {
    const { a, b } = setup();
    expect(() => moveTab('tab-99', a.id, b.id)).toThrow('not found in group');
  });

  test('records move in history', () => {
    const { a, b } = setup();
    a.tabs.push('tab-3');
    moveTab('tab-3', a.id, b.id);
    const history = getMoveHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ tabId: 'tab-3', fromGroupId: a.id, toGroupId: b.id });
  });
});

describe('moveTabs', () => {
  test('moves multiple tabs and skips missing ones', () => {
    const { a, b } = setup();
    a.tabs.push('tab-4', 'tab-5');

    const { moved } = moveTabs(['tab-4', 'tab-5', 'tab-missing'], a.id, b.id);
    expect(moved).toEqual(['tab-4', 'tab-5']);
    expect(getGroup(b.id).tabs).toContain('tab-4');
    expect(getGroup(b.id).tabs).toContain('tab-5');
  });
});

describe('getMoveHistory', () => {
  test('filters history by groupId', () => {
    const { a, b } = setup();
    const c = createGroup('Gamma');
    a.tabs.push('tab-6');
    b.tabs.push('tab-7');
    moveTab('tab-6', a.id, b.id);
    moveTab('tab-7', b.id, c.id);

    const aHistory = getMoveHistory(a.id);
    expect(aHistory).toHaveLength(1);
    expect(aHistory[0].tabId).toBe('tab-6');
  });

  test('returns all history when no filter provided', () => {
    const { a, b } = setup();
    a.tabs.push('tab-8', 'tab-9');
    moveTab('tab-8', a.id, b.id);
    moveTab('tab-9', a.id, b.id);
    expect(getMoveHistory()).toHaveLength(2);
  });
});
