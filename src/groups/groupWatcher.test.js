import {
  watchGroup,
  unwatchGroup,
  getWatchers,
  evaluateWatchers,
  clearWatchers,
} from './groupWatcher.js';
import { createGroup, addTabToGroup } from './manager.js';

describe('groupWatcher', () => {
  beforeEach(() => {
    clearWatchers();
  });

  test('watchGroup returns a watcherId', () => {
    const id = watchGroup('g1', { minTabs: 1 });
    expect(typeof id).toBe('string');
    expect(id).toContain('g1');
  });

  test('getWatchers returns all registered watchers', () => {
    watchGroup('g1', { minTabs: 1 });
    watchGroup('g2', { maxTabs: 5 });
    const watchers = getWatchers();
    expect(watchers).toHaveLength(2);
    expect(watchers.map(w => w.groupId)).toContain('g1');
    expect(watchers.map(w => w.groupId)).toContain('g2');
  });

  test('unwatchGroup removes watcher', () => {
    const id = watchGroup('g1', { minTabs: 1 });
    unwatchGroup(id);
    expect(getWatchers()).toHaveLength(0);
  });

  test('evaluateWatchers triggers onChange when minTabs breached', () => {
    createGroup('g-watch', 'Watch Group');
    const callback = jest.fn();
    watchGroup('g-watch', { minTabs: 2, onChange: callback });

    const triggered = evaluateWatchers();
    expect(triggered).toHaveLength(1);
    expect(triggered[0].groupId).toBe('g-watch');
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ groupId: 'g-watch', tabCount: 0 })
    );
  });

  test('evaluateWatchers triggers onChange when maxTabs breached', () => {
    createGroup('g-max', 'Max Group');
    addTabToGroup('g-max', 101);
    addTabToGroup('g-max', 102);
    addTabToGroup('g-max', 103);
    const callback = jest.fn();
    watchGroup('g-max', { maxTabs: 2, onChange: callback });

    const triggered = evaluateWatchers();
    expect(triggered.some(t => t.groupId === 'g-max')).toBe(true);
    expect(callback).toHaveBeenCalled();
  });

  test('evaluateWatchers does not trigger when within bounds', () => {
    createGroup('g-ok', 'OK Group');
    addTabToGroup('g-ok', 201);
    const callback = jest.fn();
    watchGroup('g-ok', { minTabs: 1, maxTabs: 5, onChange: callback });

    const triggered = evaluateWatchers().filter(t => t.groupId === 'g-ok');
    expect(triggered).toHaveLength(0);
    expect(callback).not.toHaveBeenCalled();
  });

  test('clearWatchers removes all watchers', () => {
    watchGroup('g1', {});
    watchGroup('g2', {});
    clearWatchers();
    expect(getWatchers()).toHaveLength(0);
  });
});
