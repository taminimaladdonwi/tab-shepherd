import { getMoveHistory } from './groupTabMover.js';
import { getAllGroups } from './manager.js';

/**
 * Returns a summary of how many tabs have been moved into/out of each group.
 */
export function getMoveSummary() {
  const history = getMoveHistory();
  const summary = {};

  for (const { fromGroupId, toGroupId } of history) {
    if (!summary[fromGroupId]) summary[fromGroupId] = { out: 0, in: 0 };
    if (!summary[toGroupId]) summary[toGroupId] = { out: 0, in: 0 };
    summary[fromGroupId].out += 1;
    summary[toGroupId].in += 1;
  }

  return summary;
}

/**
 * Returns the most active destination group (most tabs moved into it).
 */
export function getMostActiveDestination() {
  const summary = getMoveSummary();
  let topGroup = null;
  let topCount = 0;

  for (const [groupId, counts] of Object.entries(summary)) {
    if (counts.in > topCount) {
      topCount = counts.in;
      topGroup = groupId;
    }
  }

  return topGroup ? { groupId: topGroup, inboundMoves: topCount } : null;
}

/**
 * Returns groups that have never had a tab moved into or out of them.
 */
export function getUntouchedGroups() {
  const summary = getMoveSummary();
  const allGroups = getAllGroups();
  return allGroups.filter((g) => !summary[g.id]);
}
