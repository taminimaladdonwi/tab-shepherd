const {
  setAnnotation,
  getAnnotation,
  removeAnnotation,
  getAnnotationsForGroup,
  getAllAnnotations,
  clearAnnotations,
  getAnnotatedTabCount
} = require('./groupTabAnnotator');

beforeEach(() => clearAnnotations());

describe('setAnnotation', () => {
  test('stores a note for a tab in a group', () => {
    const entry = setAnnotation('g1', 't1', 'important tab');
    expect(entry.note).toBe('important tab');
    expect(entry.createdAt).toBeDefined();
    expect(entry.updatedAt).toBeDefined();
  });

  test('preserves createdAt on update', () => {
    const first = setAnnotation('g1', 't1', 'first note');
    const second = setAnnotation('g1', 't1', 'updated note');
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.note).toBe('updated note');
  });

  test('throws if note is not a string', () => {
    expect(() => setAnnotation('g1', 't1', 42)).toThrow();
  });

  test('throws if groupId is missing', () => {
    expect(() => setAnnotation('', 't1', 'note')).toThrow();
  });
});

describe('getAnnotation', () => {
  test('returns null for unknown tab', () => {
    expect(getAnnotation('g1', 'unknown')).toBeNull();
  });

  test('returns stored annotation', () => {
    setAnnotation('g1', 't2', 'hello');
    const result = getAnnotation('g1', 't2');
    expect(result.note).toBe('hello');
  });
});

describe('removeAnnotation', () => {
  test('removes an existing annotation', () => {
    setAnnotation('g1', 't3', 'to remove');
    expect(removeAnnotation('g1', 't3')).toBe(true);
    expect(getAnnotation('g1', 't3')).toBeNull();
  });

  test('returns false when annotation does not exist', () => {
    expect(removeAnnotation('g1', 'nope')).toBe(false);
  });
});

describe('getAnnotationsForGroup', () => {
  test('returns only annotations for the given group', () => {
    setAnnotation('g1', 't1', 'note1');
    setAnnotation('g1', 't2', 'note2');
    setAnnotation('g2', 't1', 'other');
    const result = getAnnotationsForGroup('g1');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['t1'].note).toBe('note1');
  });
});

describe('getAnnotatedTabCount', () => {
  test('returns correct count for group', () => {
    setAnnotation('g3', 'ta', 'a');
    setAnnotation('g3', 'tb', 'b');
    expect(getAnnotatedTabCount('g3')).toBe(2);
  });

  test('returns 0 for group with no annotations', () => {
    expect(getAnnotatedTabCount('empty')).toBe(0);
  });
});

describe('getAllAnnotations', () => {
  test('returns all annotations across groups', () => {
    setAnnotation('g1', 't1', 'x');
    setAnnotation('g2', 't2', 'y');
    const all = getAllAnnotations();
    expect(Object.keys(all)).toHaveLength(2);
  });
});
