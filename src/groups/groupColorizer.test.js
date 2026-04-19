const { setColor, getColor, removeColor, getColorHistory, getGroupsByColor, getValidColors, clearAll } = require('./groupColorizer');

beforeEach(() => clearAll());

describe('setColor', () => {
  test('sets a valid color for a group', () => {
    expect(setColor('g1', 'blue')).toBe('blue');
    expect(getColor('g1')).toBe('blue');
  });

  test('throws on invalid color', () => {
    expect(() => setColor('g1', 'magenta')).toThrow('Invalid color');
  });

  test('throws if groupId is missing', () => {
    expect(() => setColor(null, 'blue')).toThrow('groupId is required');
  });

  test('records previous color in history on change', () => {
    setColor('g1', 'blue');
    setColor('g1', 'red');
    const history = getColorHistory('g1');
    expect(history).toHaveLength(1);
    expect(history[0].color).toBe('blue');
  });
});

describe('getColor', () => {
  test('returns null if no color set', () => {
    expect(getColor('unknown')).toBeNull();
  });
});

describe('removeColor', () => {
  test('removes color and history', () => {
    setColor('g1', 'green');
    removeColor('g1');
    expect(getColor('g1')).toBeNull();
    expect(getColorHistory('g1')).toEqual([]);
  });
});

describe('getGroupsByColor', () => {
  test('returns groups matching a color', () => {
    setColor('g1', 'blue');
    setColor('g2', 'blue');
    setColor('g3', 'red');
    expect(getGroupsByColor('blue')).toEqual(expect.arrayContaining(['g1', 'g2']));
    expect(getGroupsByColor('blue')).toHaveLength(2);
  });

  test('returns empty array if no groups match', () => {
    expect(getGroupsByColor('cyan')).toEqual([]);
  });
});

describe('getValidColors', () => {
  test('returns array of valid colors', () => {
    const colors = getValidColors();
    expect(Array.isArray(colors)).toBe(true);
    expect(colors).toContain('blue');
  });
});
