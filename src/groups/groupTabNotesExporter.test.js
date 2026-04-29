const { exportNotes, validateNotesImport, importNotes } = require('./groupTabNotesExporter');
const { setNote, getNote, clearNotes } = require('./groupTabNotes');

beforeEach(() => clearNotes());

describe('exportNotes', () => {
  it('exports all notes with version and timestamp', () => {
    setNote('g1', 't1', 'hello');
    const exported = exportNotes();
    expect(exported.version).toBe(1);
    expect(typeof exported.exportedAt).toBe('number');
    expect(exported.notes['g1::t1'].text).toBe('hello');
  });
  it('exports empty notes object when no notes set', () => {
    const exported = exportNotes();
    expect(Object.keys(exported.notes)).toHaveLength(0);
  });
});

describe('validateNotesImport', () => {
  it('returns true for valid export data', () => {
    setNote('g1', 't1', 'test');
    expect(validateNotesImport(exportNotes())).toBe(true);
  });
  it('returns false for missing version', () => {
    expect(validateNotesImport({ notes: {} })).toBe(false);
  });
  it('returns false for wrong version', () => {
    expect(validateNotesImport({ version: 2, notes: {} })).toBe(false);
  });
  it('returns false for invalid note entry', () => {
    expect(validateNotesImport({
      version: 1,
      notes: { 'g1::t1': { text: 123, createdAt: 0, updatedAt: 0 } }
    })).toBe(false);
  });
  it('returns false for key without separator', () => {
    expect(validateNotesImport({
      version: 1,
      notes: { 'badkey': { text: 'hi', createdAt: 0, updatedAt: 0 } }
    })).toBe(false);
  });
});

describe('importNotes', () => {
  it('imports notes and makes them retrievable', () => {
    setNote('g1', 't1', 'original');
    const exported = exportNotes();
    clearNotes();
    const count = importNotes(exported);
    expect(count).toBe(1);
    expect(getNote('g1', 't1').text).toBe('original');
  });
  it('clears existing notes by default', () => {
    setNote('g2', 't2', 'existing');
    setNote('g1', 't1', 'to export');
    const exported = exportNotes();
    clearNotes();
    setNote('g3', 't3', 'should be removed');
    importNotes(exported);
    expect(getNote('g3', 't3')).toBeNull();
  });
  it('merges when merge option is true', () => {
    setNote('g1', 't1', 'note');
    const exported = exportNotes();
    setNote('g2', 't2', 'keep me');
    importNotes(exported, { merge: true });
    expect(getNote('g2', 't2').text).toBe('keep me');
    expect(getNote('g1', 't1').text).toBe('note');
  });
  it('throws on invalid data', () => {
    expect(() => importNotes({ version: 99 })).toThrow();
  });
});
