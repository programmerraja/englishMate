/**
 * Fetches the definition of a word from the Free Dictionary API.
 * @param {string} word - The word to look up.
 * @returns {Promise<Object|null>} - The formatted word data or null if not found.
 */
export const fetchDefinition = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Word not found");
            }
            throw new Error("Network error");
        }

        const data = await response.json();
        const entry = data[0];

        // Extract the most relevant meaning (first one usually)
        const meaningObj = entry.meanings?.[0] || {};
        const definitionObj = meaningObj.definitions?.[0] || {};

        return {
            word: entry.word,
            phonetic: entry.phonetic || entry.phonetics?.find(p => p.text)?.text || "",
            partOfSpeech: meaningObj.partOfSpeech || "unknown",
            definition: definitionObj.definition || "No definition available",
            example: definitionObj.example || "",
            audio: entry.phonetics?.find(p => p.audio)?.audio || ""
        };

    } catch (error) {
        // In production, we might want to log this to a service
        console.error("Dictionary API Error:", error);
        throw error;
    }
};
