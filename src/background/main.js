console.log('English Mate Background Script Running');

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "lookup-word",
        title: "Look up \"%s\"",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookup-word") {
        chrome.tabs.sendMessage(tab.id, {
            action: "lookup",
            word: info.selectionText
        });
    }
});

// Handle Extension Icon Click
// Handle Extension Icon Click
chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked on tab:", tab.id);
    chrome.tabs.sendMessage(tab.id, {
        action: "toggle_sidebar"
    }).catch(err => console.error("Failed to send message:", err));
});
