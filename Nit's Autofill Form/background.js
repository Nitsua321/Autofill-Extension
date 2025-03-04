chrome.runtime.onInstalled.addListener(() => {
  console.log("AutoFill Google Form Extension Installed");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['content.js']
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});
