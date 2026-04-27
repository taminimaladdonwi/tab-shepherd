import {
  getLinkSummary,
  getMostLinkedTab,
  getLinkedTabIds,
  getCrossGroupLinks
} from './groupTabLinkerView.js';
import { linkTabs, clearLinks } from './groupTabLinker.js';

const GROUP_A = 'group-a';
const GROUP_B = 'group-b';

function setup() {
  clearLinks();
  linkTabs(GROUP_A, 1, GROUP_A, 2, 'related');
  linkTabs(GROUP_A, 1, GROUP_A, 3, 'related');
  linkTabs(GROUP_A, 2, GROUP_B, 4, 'duplicate');
  linkTabs(GROUP_B, 5, GROUP_B, 6, 'related');
}

describe('getLinkSummary', () => {
  beforeEach(setup);

  it('returns total link count', () => {
    const summary = getLinkSummary();
    expect(summary.totalLinks).toBe(4);
  });

  it('returns group count', () => {
    const summary = getLinkSummary();
    expect(summary.groupCount).toBeGreaterThanOrEqual(2);
  });

  it('returns relation type breakdown', () => {
    const summary = getLinkSummary();
    expect(summary.byRelation.related).toBe(3);
    expect(summary.byRelation.duplicate).toBe(1);
  });

  it('returns empty summary when no links', () => {
    clearLinks();
    const summary = getLinkSummary();
    expect(summary.totalLinks).toBe(0);
    expect(summary.byRelation).toEqual({});
  });
});

describe('getMostLinkedTab', () => {
  beforeEach(setup);

  it('returns the tab with most links', () => {
    const result = getMostLinkedTab();
    expect(result).not.toBeNull();
    expect(result.tabId).toBe(1);
    expect(result.linkCount).toBeGreaterThanOrEqual(2);
  });

  it('returns null when no links', () => {
    clearLinks();
    expect(getMostLinkedTab()).toBeNull();
  });
});

describe('getLinkedTabIds', () => {
  beforeEach(setup);

  it('returns all tab ids linked to a given tab', () => {
    const ids = getLinkedTabIds(GROUP_A, 1);
    expect(ids).toContain(2);
    expect(ids).toContain(3);
  });

  it('returns empty array for unlinked tab', () => {
    expect(getLinkedTabIds(GROUP_A, 99)).toEqual([]);
  });
});

describe('getCrossGroupLinks', () => {
  beforeEach(setup);

  it('returns only links spanning different groups', () => {
    const cross = getCrossGroupLinks();
    expect(cross.length).toBe(1);
    expect(cross[0].sourceGroup).toBe(GROUP_A);
    expect(cross[0].targetGroup).toBe(GROUP_B);
  });

  it('returns empty when no cross-group links', () => {
    clearLinks();
    linkTabs(GROUP_A, 1, GROUP_A, 2, 'related');
    expect(getCrossGroupLinks()).toHaveLength(0);
  });
});
