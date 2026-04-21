import { sortAllGroups } from './groupSorter.js';
import { getTags } from './tagger.js';
import { getColor } from './groupColorizer.js';
import { isPinned } from './groupPinner.js';
import { getGroupTabCount } from './groupStats.js';

export function getSortedGroupView(field = 'name', direction = 'asc') {
  const groups = sortAllGroups(field, direction);

  return groups.map(group => ({
    id: group.id,
    name: group.name,
    tabCount: getGroupTabCount(group.id),
    color: getColor(group.id) || null,
    tags: getTags(group.id),
    pinned: isPinned(group.id),
    createdAt: group.createdAt || null,
  }));
}

export function getSortedGroupNames(field = 'name', direction = 'asc') {
  return sortAllGroups(field, direction).map(g => g.name);
}

export function getSortSummary(field = 'name', direction = 'asc') {
  const view = getSortedGroupView(field, direction);
  return {
    sortedBy: field,
    direction,
    totalGroups: view.length,
    groups: view,
  };
}
