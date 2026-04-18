const { evaluateTab, getTabsEligibleForSuspension } = require('./ruleEngine');
const tracker = require('./tracker');
const whitelist = require('./whitelist');
const rules = require('./rules');

jest.mock('./tracker');
jest.mock('./whitelist');
jest.mock('./rules');

beforeEach(() => jest.clearAllMocks());

describe('evaluateTab', () => {
  test('returns whitelisted when url is whitelisted', () => {
    whitelist.isWhitelisted.mockReturnValue(true);
    const result = evaluateTab({ id: 1, url: 'https://example.com' });
    expect(result.shouldSuspend).toBe(false);
    expect(result.reason).toBe('whitelisted');
  });

  test('returns no_activity_record when no inactivity data', () => {
    whitelist.isWhitelisted.mockReturnValue(false);
    tracker.getInactiveDuration.mockReturnValue(null);
    const result = evaluateTab({ id: 1, url: 'https://example.com' });
    expect(result.shouldSuspend).toBe(false);
    expect(result.reason).toBe('no_activity_record');
  });

  test('returns shouldSuspend true when rule matched and threshold exceeded', () => {
    whitelist.isWhitelisted.mockReturnValue(false);
    tracker.getInactiveDuration.mockReturnValue(90000);
    rules.evaluateRule.mockReturnValue({ shouldSuspend: true, rule: { id: 'r1' } });
    const result = evaluateTab({ id: 1, url: 'https://github.com' });
    expect(result.shouldSuspend).toBe(true);
    expect(result.reason).toBe('rule_matched');
    expect(result.rule.id).toBe('r1');
  });

  test('returns threshold_not_reached when rule exists but not exceeded', () => {
    whitelist.isWhitelisted.mockReturnValue(false);
    tracker.getInactiveDuration.mockReturnValue(10000);
    rules.evaluateRule.mockReturnValue({ shouldSuspend: false, rule: { id: 'r1' } });
    const result = evaluateTab({ id: 2, url: 'https://github.com' });
    expect(result.shouldSuspend).toBe(false);
    expect(result.reason).toBe('threshold_not_reached');
  });

  test('returns no_rule when no rule matches', () => {
    whitelist.isWhitelisted.mockReturnValue(false);
    tracker.getInactiveDuration.mockReturnValue(10000);
    rules.evaluateRule.mockReturnValue({ shouldSuspend: false, rule: null });
    const result = evaluateTab({ id: 3, url: 'https://noop.com' });
    expect(result.reason).toBe('no_rule');
  });
});

describe('getTabsEligibleForSuspension', () => {
  test('returns only tabs eligible for suspension', () => {
    whitelist.isWhitelisted.mockReturnValue(false);
    tracker.getInactiveDuration.mockReturnValue(90000);
    rules.evaluateRule
      .mockReturnValueOnce({ shouldSuspend: true, rule: { id: 'r1' } })
      .mockReturnValueOnce({ shouldSuspend: false, rule: { id: 'r1' } });
    const tabs = [
      { id: 1, url: 'https://github.com' },
      { id: 2, url: 'https://github.com/other' }
    ];
    const eligible = getTabsEligibleForSuspension(tabs);
    expect(eligible).toHaveLength(1);
    expect(eligible[0].tabId).toBe(1);
  });
});
