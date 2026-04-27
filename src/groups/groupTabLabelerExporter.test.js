const { exportLabels, validateLabelImport, importLabels } = require('./groupTabLabelerExporter');
const { setLabel, getLabel, clearLabels } = require('./groupTabLabeler');

beforeEach(() => {
  clearLabels('g1');
  clearLabels('g2');
});

describe('exportLabels', () => {
  it('exports labels as JSON with version 1', () => {
    setLabel('g1', 't1', 'Research');
    const json = exportLabels();
    const data = JSON.parse(json);
    expect(data.version).toBe(1);
    expect(Array.isArray(data.labels)).toBe(true);
    const entry = data.labels.find(e => e.groupId === 'g1' && e.tabId === 't1');
    expect(entry).toBeDefined();
    expect(entry.label).toBe('Research');
  });
});

describe('validateLabelImport', () => {
  it('passes valid data', () => {
    const data = { version: 1, labels: [{ groupId: 'g1', tabId: 't1', label: 'Valid' }] };
    expect(validateLabelImport(data)).toHaveLength(0);
  });
  it('fails on wrong version', () => {
    const data = { version: 99, labels: [] };
    expect(validateLabelImport(data)).toContain('Unsupported version');
  });
  it('fails on missing labels array', () => {
    const errors = validateLabelImport({ version: 1 });
    expect(errors.some(e => e.includes('labels must be an array'))).toBe(true);
  });
  it('fails on invalid label in entry', () => {
    const data = { version: 1, labels: [{ groupId: 'g1', tabId: 't1', label: '' }] };
    const errors = validateLabelImport(data);
    expect(errors.some(e => e.includes('invalid label'))).toBe(true);
  });
});

describe('importLabels', () => {
  it('imports labels from valid JSON', () => {
    const json = JSON.stringify({
      version: 1,
      labels: [{ groupId: 'g1', tabId: 't5', label: 'Imported' }]
    });
    const result = importLabels(json);
    expect(result.imported).toBe(1);
    expect(getLabel('g1', 't5')).toBe('Imported');
  });
  it('throws on invalid JSON', () => {
    expect(() => importLabels('not-json')).toThrow('Invalid JSON');
  });
  it('throws on validation failure', () => {
    const bad = JSON.stringify({ version: 1, labels: [{ groupId: 'g1', tabId: 't1', label: '' }] });
    expect(() => importLabels(bad)).toThrow('Import validation failed');
  });
});
