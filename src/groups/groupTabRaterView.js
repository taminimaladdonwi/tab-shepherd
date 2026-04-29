const { getRatingsForGroup, getAllRatings, getAverageRatingForGroup } = require('./groupTabRater');

function getRatingSummary(groupId) {
  const entries = getRatingsForGroup(groupId);
  const avg = getAverageRatingForGroup(groupId);
  return {
    groupId,
    totalRated: entries.length,
    averageRating: avg,
    distribution: [1, 2, 3, 4, 5].reduce((acc, r) => {
      acc[r] = entries.filter(e => e.rating === r).length;
      return acc;
    }, {})
  };
}

function getTopRatedTabs(groupId, limit = 5) {
  return getRatingsForGroup(groupId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

function getGroupsWithLowRatings(threshold = 2) {
  const all = getAllRatings();
  const byGroup = {};
  for (const entry of all) {
    if (!byGroup[entry.groupId]) byGroup[entry.groupId] = [];
    byGroup[entry.groupId].push(entry.rating);
  }
  return Object.entries(byGroup)
    .filter(([, ratings]) => {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      return avg <= threshold;
    })
    .map(([groupId]) => groupId);
}

function getUnratedGroups(allGroupIds) {
  const ratedGroupIds = new Set(getAllRatings().map(e => e.groupId));
  return allGroupIds.filter(id => !ratedGroupIds.has(id));
}

module.exports = {
  getRatingSummary,
  getTopRatedTabs,
  getGroupsWithLowRatings,
  getUnratedGroups
};
