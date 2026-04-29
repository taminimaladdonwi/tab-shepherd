const {
  isValidNote,
  setNote,
  getNote,
  removeNote,
  getNotesForGroup,
  getAllNotes,
  clearNotes,
  getNoteCount
} = require('./groupTabNotes');

beforeEach(() => clearNotes());

describe('isValidNote', () => {
  it('returns true for valid strings', () => {
    expect(isValidNote('hello')).toBe(true);
  });
  it('returns false for empty string', () => {
    expect(isValidNote('')).toBe(false);
    expect(isValidNote('   ')).toBe(false);
  });
  it('returns false for non-strings', () => {
    expect(isValidNote(123)).toBe(false);
    expect(isValidNote(null)).toBe(false);
  });
  it('returns false for strings exceeding 2000 chars', () => {
    expect(isValidNote('a'.repeat(2001))).toBe(false);
  });
});

describe('setNote / getNote', () => {
  it('sets and retrieves a note', () => {
    setNote('g1', 't1', 'my note');
    const note = getNote('g1', 't1');
    expect(note.text).toBe('my note');
    expect(typeof note.createdAt).toBe('number');
    expect(typeof note.updatedAt).toBe('number');
  });
  it('updates text but preserves createdAt', () => {
    setNote('g1', 't1', 'first');
    const { createdAt } = getNote('g1', 't1');
    setNote('g1', 't1', 'second');
    expect(getNote('g1', 't1').text).toBe('second');
    expect(getNote('g1', 't1').createdAt).toBe(createdAt);
  });
  it('throws on invalid note', () => {
    expect(() => setNote('g1', 't1', '')).toThrow();
  });
  it('returns null for unknown key', () => {
    expect(getNote('g1', 'unknown')).toBeNull();
  });
});

describe('removeNote', () => {
  it('removes an existing note', () => {
    setNote('g1', 't1', 'note');
    expect(removeNote('g1', 't1')).toBe(true);
    expect(getNote('g1', 't1')).toBeNull();
  });
  it('returns false for non-existent note', () => {
    expect(removeNote('g1', 'none')).toBe(false);
  });
});

describe('getNotesForGroup', () => {
  it('returns only notes for the given group', () => {
    setNote('g1', 't1', 'note1');
    setNote('g1', 't2', 'note2');
    setNote('g2', 't3', 'other');
    const result = getNotesForGroup('g1');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['t1'].text).toBe('note1');
  });
});

describe('getNoteCount', () => {
  it('counts notes per group', () => {
    setNote('g1', 't1', 'a');
    setNote('g1', 't2', 'b');
    setNote('g2', 't3', 'c');
    expect(getNoteCount('g1')).toBe(2);
    expect(getNoteCount('g2')).toBe(1);
  });
});

describe('getAllNotes', () => {
  it('returns all stored notes', () => {
    setNote('g1', 't1', 'x');
    setNote('g2', 't2', 'y');
    const all = getAllNotes();
    expect(Object.keys(all)).toHaveLength(2);
  });
});
