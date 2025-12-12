
import { fetchDefinition } from '../lib/api';
import { saveVocabularyItem } from '../lib/storage';

console.log('English Mate Background Script Running');

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "add-learning-word",
        title: "Add \"%s\" to EnglishMate",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "add-learning-word") {
        const word = info.selectionText.trim();
        if (!word) return;

        try {
            // 1. Fetch Definition
            const definitionData = await fetchDefinition(word);

            // 2. Save
            await saveVocabularyItem(definitionData);

            // 3. Notify Success
            chrome.tabs.sendMessage(tab.id, {
                action: "show_toast",
                type: "success",
                message: `Saved "${word}" to your vocabulary!`
            }).catch(() => {/* Content script might not be ready */ });

        } catch (error) {
            console.error("Context Menu Action Failed:", error);

            let errorMsg = "Failed to save word.";
            if (error.message === "Word not found") {
                errorMsg = `Use lookup for "${word}". Definition not found.`;
            } else if (error.message === "Word already exists") {
                errorMsg = `"${word}" is already in your list.`;
            }

            // 4. Notify Error
            chrome.tabs.sendMessage(tab.id, {
                action: "show_toast",
                type: "error",
                message: errorMsg
            }).catch(() => { });
        }
    }
});

// Handle Extension Icon Click
chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked on tab:", tab.id);
    chrome.tabs.sendMessage(tab.id, {
        action: "toggle_sidebar"
    }).catch(err => console.error("Failed to send message:", err));
});
