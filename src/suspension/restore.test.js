import { restoreTab, restoreGroup, restoreAll } from './restore.js';
import { buildSuspendedUrl } from '../groups/suspender.js';

const ORIGINAL_URL = 'https://example.com/page';
const SUSPENDED_URL = buildSuspendedUrl(ORIGINAL_URL, 'Example');

function mockTab(id, url) {
  return { id, url };
}

beforeEach(() => {
  global.chrome = {
    tabs: {
      get: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
      query: jest.fn(),
    },
  };
});

describe('restoreTab', () => {
  it('returns false for a non-suspended tab', async () => {
    chrome.tabs.get.mockResolvedValue(mockTab(1, ORIGINAL_URL));
    const result = await restoreTab(1);
    expect(result).toBe(false);
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });

  it('restores a suspended tab to its original URL', async () => {
    chrome.tabs.get.mockResolvedValue(mockTab(1, SUSPENDED_URL));
    const result = await restoreTab(1);
    expect(result).toBe(true);
    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { url: ORIGINAL_URL });
  });
});

describe('restoreGroup', () => {
  it('restores only suspended tabs in the group', async () => {
    chrome.tabs.get
      .mockResolvedValueOnce(mockTab(1, SUSPENDED_URL))
      .mockResolvedValueOnce(mockTab(2, ORIGINAL_URL));

    const tabs = [mockTab(1, SUSPENDED_URL), mockTab(2, ORIGINAL_URL)];
    const count = await restoreGroup('group-1', tabs);
    expect(count).toBe(1);
  });
});

describe('restoreAll', () => {
  it('restores all suspended tabs', async () => {
    const tabs = [
      mockTab(1, SUSPENDED_URL),
      mockTab(2, ORIGINAL_URL),
      mockTab(3, SUSPENDED_URL),
    ];
    chrome.tabs.query.mockResolvedValue(tabs);
    chrome.tabs.get
      .mockResolvedValueOnce(mockTab(1, SUSPENDED_URL))
      .mockResolvedValueOnce(mockTab(2, ORIGINAL_URL))
      .mockResolvedValueOnce(mockTab(3, SUSPENDED_URL));

    const count = await restoreAll();
    expect(count).toBe(2);
  });
});
