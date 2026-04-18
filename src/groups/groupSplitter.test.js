import { splitGroup, splitGroupEvenly } from './groupSplitter.js';
import { createGroup, getGroup, addTabToGroup, getAllGroups, deleteGroup } from './manager.js';
import { setTags, getTags } from './tagger.js';

function setup() {
  for (const g of getAllGroups()) deleteGroup(g.id);
}

describe('splitGroup', () => {
  beforeEach(setup);

  test('distributes tabs into new groups', () => {
    createGroup('src', 'Source');
    addTabToGroup('src', 1);
    addTabToGroup('src', 2);
    addTabToGroup('src', 3);

    splitGroup('src', [
      { id: 'p1', label: 'Part 1', tabIds: [1, 2] },
      { id: 'p2', label: 'Part 2', tabIds: [3] }
    ]);

    expect(getGroup('p1').tabs).toContain(1);
    expect(getGroup('p1').tabs).toContain(2);
    expect(getGroup('p2').tabs).toContain(3);
  });

  test('removes tabs from source by default', () => {
    createGroup('src', 'Source');
    addTabToGroup('src', 10);
    addTabToGroup('src', 11);

    splitGroup('src', [{ id: 'child', label: 'Child', tabIds: [10] }]);

    expect(getGroup('src').tabs).not.toContain(10);
    expect(getGroup('src').tabs).toContain(11);
  });

  test('keeps tabs in source when keepSource=true', () => {
    createGroup('src', 'Source');
    addTabToGroup('src', 20);

    splitGroup('src', [{ id: 'copy', label: 'Copy', tabIds: [20] }], { keepSource: true });

    expect(getGroup('src').tabs).toContain(20);
    expect(getGroup('copy').tabs).toContain(20);
  });

  test('inherits tags from source group', () => {
    createGroup('src', 'Source');
    setTags('src', ['inherited']);
    addTabToGroup('src', 30);

    splitGroup('src', [{ id: 'child2', label: 'Child2', tabIds: [30] }]);

    expect(getTags('child2')).toContain('inherited');
  });

  test('throws if source group does not exist', () => {
    expect(() => splitGroup('ghost', [{ id: 'x', tabIds: [1] }])).toThrow();
  });
});

describe('splitGroupEvenly', () => {
  beforeEach(setup);

  test('splits tabs into equal partitions', () => {
    createGroup('even-src', 'Even Source');
    [1, 2, 3, 4].forEach(id => addTabToGroup('even-src', id));

    const result = splitGroupEvenly('even-src', 2, 'half');

    expect(result.length).toBe(2);
    const allTabs = result.flatMap(g => g.tabs);
    expect(allTabs).toHaveLength(4);
    expect(allTabs).toContain(1);
    expect(allTabs).toContain(4);
  });

  test('handles fewer tabs than requested count', () => {
    createGroup('small', 'Small');
    addTabToGroup('small', 99);

    const result = splitGroupEvenly('small', 5, 'tiny');
    expect(result.length).toBe(1);
  });
});
