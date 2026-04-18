// groupMerger.js — merge multiple groups into one
import { getGroup, createGroup, addTabToGroup, removeTabFromGroup, deleteGroup, getAllGroups } from './manager.js';
import { getTags, setTags } from './tagger.js';

/**
 * Merge multiple groups into a single target group.
 * Tabs from all source groups are moved to the target.
 * Tags are unioned. Source groups are deleted.
 */
export function mergeGroups(sourceGroupIds, targetGroupId, targetLabel) {
  if (!sourceGroupIds || sourceGroupIds.length === 0) {
    throw new Error('No source groups provided');
  }

  let target = getGroup(targetGroupId);
  if (!target) {
    target = createGroup(targetGroupId, targetLabel || targetGroupId);
  }

  const mergedTags = new Set(getTags(targetGroupId));

  for (const sourceId of sourceGroupIds) {
    if (sourceId === targetGroupId) continue;
    const source = getGroup(sourceId);
    if (!source) continue;

    for (const tabId of [...(source.tabs || [])]) {
      removeTabFromGroup(sourceId, tabId);
      addTabToGroup(targetGroupId, tabId);
    }

    const sourceTags = getTags(sourceId);
    for (const tag of sourceTags) mergedTags.add(tag);

    deleteGroup(sourceId);
  }

  setTags(targetGroupId, [...mergedTags]);
  return getGroup(targetGroupId);
}

/**
 * Merge all groups that share a given tag into one.
 */
export function mergeGroupsByTag(tag, targetGroupId, targetLabel) {
  const all = getAllGroups();
  const matching = all
    .filter(g => getTags(g.id).includes(tag))
    .map(g => g.id);

  if (matching.length === 0) return null;

  const target = targetGroupId || matching[0];
  const sources = matching.filter(id => id !== target);
  return mergeGroups(sources, target, targetLabel);
}
