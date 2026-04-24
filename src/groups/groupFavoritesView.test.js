import { getFavoriteSummary, getFavoriteGroupDetails, getNonFavoriteGroups } from './groupFavoritesView.js';
import { addFavorite, clearFavorites } from './groupFavorites.js';
import { createGroup, clearGroups } from './manager.js';

function setup() {
  clearGroups();
  clearFavorites();

  createGroup('g1', { name: 'Work', tabs: [1, 2, 3] });
  createGroup('g2', { name: 'Research', tabs: [4, 5] });
  createGroup('g3', { name: 'Personal', tabs: [6] });
  createGroup('g4', { name: 'Shopping', tabs: [] });

  addFavorite('g1', { note: 'Primary workspace' });
  addFavorite('g3', { note: 'Personal browsing' });
}

describe('getFavoriteSummary', () => {
  beforeEach(setup);

  it('returns total count of favorites', () => {
    const summary = getFavoriteSummary();
    expect(summary.totalFavorites).toBe(2);
  });

  it('includes list of favorited group ids', () => {
    const summary = getFavoriteSummary();
    expect(summary.favoriteIds).toContain('g1');
    expect(summary.favoriteIds).toContain('g3');
    expect(summary.favoriteIds).not.toContain('g2');
  });

  it('returns empty summary when no favorites exist', () => {
    clearFavorites();
    const summary = getFavoriteSummary();
    expect(summary.totalFavorites).toBe(0);
    expect(summary.favoriteIds).toEqual([]);
  });
});

describe('getFavoriteGroupDetails', () => {
  beforeEach(setup);

  it('returns group details for all favorites', () => {
    const details = getFavoriteGroupDetails();
    expect(details.length).toBe(2);
  });

  it('includes group name and tab count', () => {
    const details = getFavoriteGroupDetails();
    const work = details.find(d => d.groupId === 'g1');
    expect(work).toBeDefined();
    expect(work.name).toBe('Work');
    expect(work.tabCount).toBe(3);
  });

  it('includes the favorite note when present', () => {
    const details = getFavoriteGroupDetails();
    const personal = details.find(d => d.groupId === 'g3');
    expect(personal.note).toBe('Personal browsing');
  });

  it('returns empty array when no favorites', () => {
    clearFavorites();
    expect(getFavoriteGroupDetails()).toEqual([]);
  });
});

describe('getNonFavoriteGroups', () => {
  beforeEach(setup);

  it('returns groups that are not favorited', () => {
    const nonFavs = getNonFavoriteGroups();
    const ids = nonFavs.map(g => g.groupId);
    expect(ids).toContain('g2');
    expect(ids).toContain('g4');
    expect(ids).not.toContain('g1');
    expect(ids).not.toContain('g3');
  });

  it('returns all groups when no favorites are set', () => {
    clearFavorites();
    const nonFavs = getNonFavoriteGroups();
    expect(nonFavs.length).toBe(4);
  });

  it('returns empty array when all groups are favorited', () => {
    addFavorite('g2');
    addFavorite('g4');
    const nonFavs = getNonFavoriteGroups();
    expect(nonFavs).toEqual([]);
  });
});
