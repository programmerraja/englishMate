/**
 * Saves a word to Chrome's local storage.
 * @param {Object} wordData - The word object to save.
 * @returns {Promise<void>}
 */
export const saveWord = async (wordData) => {
    try {
        // If running in dev mode (no chrome API), use localStorage
        if (!chrome?.storage?.local) {
            const existing = JSON.parse(localStorage.getItem('savedWords') || '[]');
            // Avoid duplicates
            if (!existing.some(w => w.word === wordData.word)) {
                existing.unshift({ ...wordData, timestamp: Date.now() });
                localStorage.setItem('savedWords', JSON.stringify(existing));
            }
            return;
        }

        // Chrome Extension Storage
        const result = await chrome.storage.local.get(['savedWords']);
        const existing = result.savedWords || [];

        if (!existing.some(w => w.word === wordData.word)) {
            const newWords = [{ ...wordData, timestamp: Date.now() }, ...existing];
            await chrome.storage.local.set({ savedWords: newWords });
        }
    } catch (error) {
        console.error("Storage Error:", error);
        throw error;
    }
};

/**
 * Retrieves all saved words.
 * @returns {Promise<Array>}
 */
export const getSavedWords = async () => {
    try {
        if (!chrome?.storage?.local) {
            return JSON.parse(localStorage.getItem('savedWords') || '[]');
        }

        const result = await chrome.storage.local.get(['savedWords']);
        return result.savedWords || [];
    } catch (error) {
        console.error("Storage Error:", error);
        return [];
    }
};
