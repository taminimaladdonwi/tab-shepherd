const {
  isValidRelation,
  linkTabs,
  unlinkTabs,
  getLinks,
  getLinksByRelation,
  getAllLinks,
  clearLinks,
  getSupportedRelations
} = require('./groupTabLinker');

beforeEach(() => {
  clearLinks();
});

describe('isValidRelation', () => {
  it('returns true for valid relations', () => {
    expect(isValidRelation('related')).toBe(true);
    expect(isValidRelation('parent')).toBe(true);
    expect(isValidRelation('child')).toBe(true);
    expect(isValidRelation('duplicate')).toBe(true);
    expect(isValidRelation('reference')).toBe(true);
  });

  it('returns false for invalid relations', () => {
    expect(isValidRelation('unknown')).toBe(false);
    expect(isValidRelation('')).toBe(false);
  });
});

describe('linkTabs', () => {
  it('creates a link between two tabs', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    const links = getLinks('g1', 't1');
    expect(links).toHaveLength(1);
    expect(links[0].toGroupId).toBe('g2');
    expect(links[0].toTabId).toBe('t2');
    expect(links[0].relation).toBe('related');
  });

  it('does not duplicate existing links', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    expect(getLinks('g1', 't1')).toHaveLength(1);
  });

  it('throws on invalid relation', () => {
    expect(() => linkTabs('g1', 't1', 'g2', 't2', 'invalid')).toThrow();
  });

  it('allows multiple different relations', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    linkTabs('g1', 't1', 'g2', 't2', 'duplicate');
    expect(getLinks('g1', 't1')).toHaveLength(2);
  });
});

describe('unlinkTabs', () => {
  it('removes a specific link', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    unlinkTabs('g1', 't1', 'g2', 't2');
    expect(getLinks('g1', 't1')).toHaveLength(0);
  });

  it('does nothing if link does not exist', () => {
    expect(() => unlinkTabs('g1', 't1', 'g2', 't2')).not.toThrow();
  });
});

describe('getLinksByRelation', () => {
  it('filters links by relation type', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'parent');
    linkTabs('g1', 't1', 'g3', 't3', 'child');
    const parents = getLinksByRelation('g1', 't1', 'parent');
    expect(parents).toHaveLength(1);
    expect(parents[0].toGroupId).toBe('g2');
  });
});

describe('getAllLinks', () => {
  it('returns all links across all tabs', () => {
    linkTabs('g1', 't1', 'g2', 't2', 'related');
    linkTabs('g1', 't2', 'g3', 't3', 'reference');
    expect(getAllLinks()).toHaveLength(2);
  });

  it('returns empty array when no links exist', () => {
    expect(getAllLinks()).toHaveLength(0);
  });
});

describe('getSupportedRelations', () => {
  it('returns a list of valid relation types', () => {
    const relations = getSupportedRelations();
    expect(Array.isArray(relations)).toBe(true);
    expect(relations).toContain('related');
    expect(relations).toContain('parent');
  });
});
