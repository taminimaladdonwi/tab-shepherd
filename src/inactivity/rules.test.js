const { addRule, removeRule, getRules, getRuleById, matchRule, evaluateRule, clearRules } = require('./rules');

beforeEach(() => clearRules());

describe('addRule / getRules', () => {
  test('adds a rule and retrieves it', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    expect(getRules()).toHaveLength(1);
    expect(getRules()[0].id).toBe('r1');
  });

  test('updates existing rule with same id', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 120000 });
    expect(getRules()).toHaveLength(1);
    expect(getRules()[0].inactiveThresholdMs).toBe(120000);
  });

  test('throws on invalid rule', () => {
    expect(() => addRule({ id: 'r1' })).toThrow();
  });
});

describe('removeRule', () => {
  test('removes a rule by id', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    removeRule('r1');
    expect(getRules()).toHaveLength(0);
  });

  test('does nothing for unknown id', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    removeRule('unknown');
    expect(getRules()).toHaveLength(1);
  });
});

describe('getRuleById', () => {
  test('returns rule by id', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    expect(getRuleById('r1')).not.toBeNull();
  });

  test('returns null for unknown id', () => {
    expect(getRuleById('nope')).toBeNull();
  });
});

describe('matchRule', () => {
  test('returns matching rule for url', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    expect(matchRule('https://github.com/repo')).not.toBeNull();
  });

  test('returns null when no rule matches', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    expect(matchRule('https://example.com')).toBeNull();
  });
});

describe('evaluateRule', () => {
  test('returns shouldSuspend true when threshold exceeded', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    const result = evaluateRule('https://github.com/repo', 90000);
    expect(result.shouldSuspend).toBe(true);
    expect(result.rule.id).toBe('r1');
  });

  test('returns shouldSuspend false when under threshold', () => {
    addRule({ id: 'r1', matchPattern: 'github\.com', inactiveThresholdMs: 60000 });
    const result = evaluateRule('https://github.com/repo', 30000);
    expect(result.shouldSuspend).toBe(false);
  });

  test('returns shouldSuspend false when no rule matches', () => {
    const result = evaluateRule('https://example.com', 999999);
    expect(result.shouldSuspend).toBe(false);
    expect(result.rule).toBeNull();
  });
});
