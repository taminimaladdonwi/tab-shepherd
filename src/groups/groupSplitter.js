// groupSplitter.js — split a group into multiple groups by a partition function
import { getGroup, createGroup, addTabToGroup, removeTabFromGroup } from './manager.js';
import { getTags, setTags } from './tagger.js';

/**
 * Split a group into multiple groups.
 * @param {string} sourceGroupId
 * @param {Array<{id: string, label: string, tabIds: number[]}>} partitions
 * @param {object} options
 * @param {boolean} options.keepSource — if false, removes partitioned tabs from source (default true)
 * @returns {Array} created groups
 */
export function splitGroup(sourceGroupId, partitions, options = {}) {
  const { keepSource = false } = options;
  const source = getGroup(sourceGroupId);
  if (!source) throw new Error(`Group not found: ${sourceGroupId}`);

  const sourceTags = getTags(sourceGroupId);
  const created = [];

  for (const partition of partitions) {
    const { id, label, tabIds } = partition;
    if (!id || !Array.isArray(tabIds)) continue;

    let group = getGroup(id);
    if (!group) group = createGroup(id, label || id);

    for (const tabId of tabIds) {
      if (!(source.tabs || []).includes(tabId)) continue;
      addTabToGroup(id, tabId);
      if (!keepSource) removeTabFromGroup(sourceGroupId, tabId);
    }

    // Inherit source tags
    setTags(id, [...new Set([...sourceTags, ...(getTags(id))])]);
    created.push(getGroup(id));
  }

  return created;
}

/**
 * Auto-split a group into N roughly equal groups.
 */
export function splitGroupEvenly(sourceGroupId, count, newGroupIdPrefix) {
  const source = getGroup(sourceGroupId);
  if (!source) throw new Error(`Group not found: ${sourceGroupId}`);

  const tabs = [...(source.tabs || [])];
  const partitions = [];
  const size = Math.ceil(tabs.length / count);

  for (let i = 0; i < count; i++) {
    const slice = tabs.slice(i * size, (i + 1) * size);
    if (slice.length === 0) break;
    partitions.push({
      id: `${newGroupIdPrefix}-${i + 1}`,
      label: `${newGroupIdPrefix} ${i + 1}`,
      tabIds: slice
    });
  }

  return splitGroup(sourceGroupId, partitions);
}
