const {
  isValidCategory,
  setCategory,
  getCategory,
  removeCategory,
  getCategoriesForGroup,
  getTabsByCategory,
  getCategoryDistribution,
  clearCategories,
  VALID_CATEGORIES
} = require('./groupTabCategorizer');

beforeEach(() => clearCategories());

describe('isValidCategory', () => {
  test('returns true for valid categories', () => {
    for (const cat of VALID_CATEGORIES) {
      expect(isValidCategory(cat)).toBe(true);
    }
  });

  test('returns false for unknown category', () => {
    expect(isValidCategory('unknown')).toBe(false);
    expect(isValidCategory('')).toBe(false);
  });
});

describe('setCategory / getCategory', () => {
  test('sets and retrieves a category', () => {
    setCategory('g1', 't1', 'work');
    const result = getCategory('g1', 't1');
    expect(result).not.toBeNull();
    expect(result.category).toBe('work');
    expect(result.assignedAt).toBeLessThanOrEqual(Date.now());
  });

  test('stores previousCategory on update', () => {
    setCategory('g1', 't1', 'work');
    setCategory('g1', 't1', 'personal');
    const result = getCategory('g1', 't1');
    expect(result.category).toBe('personal');
    expect(result.previousCategory).toBe('work');
  });

  test('throws for invalid category', () => {
    expect(() => setCategory('g1', 't1', 'invalid')).toThrow();
  });

  test('returns null for unset tab', () => {
    expect(getCategory('g1', 'missing')).toBeNull();
  });
});

describe('removeCategory', () => {
  test('removes an existing category', () => {
    setCategory('g1', 't1', 'media');
    expect(removeCategory('g1', 't1')).toBe(true);
    expect(getCategory('g1', 't1')).toBeNull();
  });

  test('returns false for non-existent entry', () => {
    expect(removeCategory('g1', 'ghost')).toBe(false);
  });
});

describe('getCategoriesForGroup', () => {
  test('returns all categorized tabs for a group', () => {
    setCategory('g1', 't1', 'work');
    setCategory('g1', 't2', 'social');
    setCategory('g2', 't3', 'media');
    const result = getCategoriesForGroup('g1');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['t1'].category).toBe('work');
    expect(result['t2'].category).toBe('social');
  });
});

describe('getTabsByCategory', () => {
  test('returns tab ids matching category in group', () => {
    setCategory('g1', 't1', 'work');
    setCategory('g1', 't2', 'work');
    setCategory('g1', 't3', 'personal');
    const result = getTabsByCategory('g1', 'work');
    expect(result).toHaveLength(2);
    expect(result).toContain('t1');
    expect(result).toContain('t2');
  });
});

describe('getCategoryDistribution', () => {
  test('returns count of 0 for all categories when empty', () => {
    const dist = getCategoryDistribution('g1');
    for (const cat of VALID_CATEGORIES) {
      expect(dist[cat]).toBe(0);
    }
  });

  test('counts categories correctly', () => {
    setCategory('g1', 't1', 'work');
    setCategory('g1', 't2', 'work');
    setCategory('g1', 't3', 'media');
    const dist = getCategoryDistribution('g1');
    expect(dist['work']).toBe(2);
    expect(dist['media']).toBe(1);
    expect(dist['personal']).toBe(0);
  });
});
