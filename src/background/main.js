
import { fetchDefinition } from '../lib/api';
import { saveVocabularyItem } from '../lib/storage';

console.log('English Mate Background Script Running');

chrome.runtime.onInstalled.addListener(() => {
    // 1. Create Context Menu
    chrome.contextMenus.create({
        id: "add-learning-word",
        title: "Add \"%s\" to EnglishMate",
        contexts: ["selection"]
    });

    // 2. Set Side Panel Behavior
    // Allows users to open the side panel by clicking the action toolbar icon
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
        chrome.sidePanel
            .setPanelBehavior({ openPanelOnActionClick: true })
            .catch((error) => console.error(error));
    }
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
