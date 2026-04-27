const {
  isValidLabel,
  setLabel,
  getLabel,
  removeLabel,
  getLabelsForGroup,
  findTabsByLabel,
  clearLabels,
  getAllLabels
} = require('./groupTabLabeler');

beforeEach(() => {
  clearLabels('g1');
  clearLabels('g2');
});

describe('isValidLabel', () => {
  it('accepts valid labels', () => {
    expect(isValidLabel('My Tab')).toBe(true);
    expect(isValidLabel('work-notes')).toBe(true);
  });
  it('rejects empty or too-long labels', () => {
    expect(isValidLabel('')).toBe(false);
    expect(isValidLabel('a'.repeat(65))).toBe(false);
  });
  it('rejects non-string values', () => {
    expect(isValidLabel(null)).toBe(false);
    expect(isValidLabel(42)).toBe(false);
  });
});

describe('setLabel / getLabel', () => {
  it('stores and retrieves a label', () => {
    setLabel('g1', 't1', 'Important');
    expect(getLabel('g1', 't1')).toBe('Important');
  });
  it('trims whitespace on set', () => {
    setLabel('g1', 't2', '  trimmed  ');
    expect(getLabel('g1', 't2')).toBe('trimmed');
  });
  it('throws on invalid label', () => {
    expect(() => setLabel('g1', 't3', '')).toThrow();
  });
  it('returns null for unlabeled tab', () => {
    expect(getLabel('g1', 'unknown')).toBeNull();
  });
});

describe('removeLabel', () => {
  it('removes an existing label', () => {
    setLabel('g1', 't1', 'ToRemove');
    expect(removeLabel('g1', 't1')).toBe(true);
    expect(getLabel('g1', 't1')).toBeNull();
  });
  it('returns false for non-existent label', () => {
    expect(removeLabel('g1', 'ghost')).toBe(false);
  });
});

describe('getLabelsForGroup', () => {
  it('returns all labels for a group', () => {
    setLabel('g1', 't1', 'Alpha');
    setLabel('g1', 't2', 'Beta');
    setLabel('g2', 't3', 'Gamma');
    const result = getLabelsForGroup('g1');
    expect(result).toEqual({ t1: 'Alpha', t2: 'Beta' });
  });
});

describe('findTabsByLabel', () => {
  it('finds tabs whose label contains the search string', () => {
    setLabel('g1', 't1', 'work notes');
    setLabel('g1', 't2', 'personal');
    const found = findTabsByLabel('g1', 'work');
    expect(found).toContain('t1');
    expect(found).not.toContain('t2');
  });
});

describe('clearLabels', () => {
  it('removes all labels for a group', () => {
    setLabel('g1', 't1', 'X');
    setLabel('g1', 't2', 'Y');
    clearLabels('g1');
    expect(getLabelsForGroup('g1')).toEqual({});
  });
});
