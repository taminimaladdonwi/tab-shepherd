const groupColors = new Map();
const colorHistory = new Map();

const VALID_COLORS = ['blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];

function isValidColor(color) {
  return VALID_COLORS.includes(color);
}

function setColor(groupId, color) {
  if (!groupId) throw new Error('groupId is required');
  if (!isValidColor(color)) throw new Error(`Invalid color: ${color}`);

  const previous = groupColors.get(groupId);
  if (previous) {
    const history = colorHistory.get(groupId) || [];
    history.push({ color: previous, changedAt: Date.now() });
    colorHistory.set(groupId, history);
  }

  groupColors.set(groupId, color);
  return color;
}

function getColor(groupId) {
  return groupColors.get(groupId) || null;
}

function removeColor(groupId) {
  colorHistory.delete(groupId);
  return groupColors.delete(groupId);
}

function getColorHistory(groupId) {
  return colorHistory.get(groupId) || [];
}

function getGroupsByColor(color) {
  const result = [];
  for (const [groupId, c] of groupColors.entries()) {
    if (c === color) result.push(groupId);
  }
  return result;
}

function getValidColors() {
  return [...VALID_COLORS];
}

function clearAll() {
  groupColors.clear();
  colorHistory.clear();
}

module.exports = { setColor, getColor, removeColor, getColorHistory, getGroupsByColor, getValidColors, clearAll };
