const { getColor, getGroupsByColor, getValidColors } = require('./groupColorizer');
const { getAllGroups } = require('./manager');

function getColorSummary() {
  const groups = getAllGroups();
  const summary = {};

  for (const group of groups) {
    const color = getColor(group.id);
    summary[group.id] = {
      name: group.name,
      color: color || null
    };
  }

  return summary;
}

function getColorDistribution() {
  const colors = getValidColors();
  const distribution = {};

  for (const color of colors) {
    const groups = getGroupsByColor(color);
    if (groups.length > 0) {
      distribution[color] = groups.length;
    }
  }

  return distribution;
}

function getUncoloredGroups() {
  const groups = getAllGroups();
  return groups.filter(group => !getColor(group.id));
}

module.exports = { getColorSummary, getColorDistribution, getUncoloredGroups };
