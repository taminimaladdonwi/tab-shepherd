import { getAllGroups } from './manager.js';
import { getGroupTabCount } from './groupStats.js';
import { getColor } from './groupColorizer.js';
import { isPinned } from './groupPinner.js';

const SORT_FIELDS = ['name', 'tabCount', 'color', 'pinned', 'created'];

export function sortGroups(groups, field = 'name', direction = 'asc') {
  if (!SORT_FIELDS.includes(field)) {
    throw new Error(`Invalid sort field: ${field}. Must be one of: ${SORT_FIELDS.join(', ')}`);
  }

  const sorted = [...groups].sort((a, b) => {
    let valA, valB;

    switch (field) {
      case 'name':
        valA = (a.name || '').toLowerCase();
        valB = (b.name || '').toLowerCase();
        break;
      case 'tabCount':
        valA = getGroupTabCount(a.id);
        valB = getGroupTabCount(b.id);
        break;
      case 'color':
        valA = getColor(a.id) || '';
        valB = getColor(b.id) || '';
        break;
      case 'pinned':
        valA = isPinned(a.id) ? 0 : 1;
        valB = isPinned(b.id) ? 0 : 1;
        break;
      case 'created':
        valA = a.createdAt || 0;
        valB = b.createdAt || 0;
        break;
      default:
        return 0;
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

export function sortAllGroups(field = 'name', direction = 'asc') {
  const groups = getAllGroups();
  return sortGroups(groups, field, direction);
}

export function getSortedGroupIds(field = 'name', direction = 'asc') {
  return sortAllGroups(field, direction).map(g => g.id);
}

export function getSupportedSortFields() {
  return [...SORT_FIELDS];
}
