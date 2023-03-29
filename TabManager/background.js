chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ savedTabs: [] });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.sync.get(['savedTabs'], (result) => {
    const newSavedTabs = result.savedTabs.filter((tab) => tab.id !== tabId);
    chrome.storage.sync.set({ savedTabs: newSavedTabs });
  });
});