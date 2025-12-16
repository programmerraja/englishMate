const DB_KEY = 'englishMateDB';

// Helper to generate ID
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Simple fallback
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getDB = async () => {
    let db = null;

    // 1. Try to get data
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get([DB_KEY]);
        db = result[DB_KEY];
    } else {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) db = JSON.parse(raw);
    }

    // 2. If no DB, initialize default
    if (!db) {
        // Initialize default DB
        db = {
            vocabulary: [],
            sentences: [],
            userSettings: {
                apiKeys: {
                    deepgram: "",
                    gemini: "",
                    openai: ""
                },
                dailyGoal: 5
            },
            stats: {
                streak: 0,
                lastPracticeDate: null,
                wordsLearnedHistory: {} // "YYYY-MM-DD": count
            }
        };
        await saveDB(db);
    }

    // Ensure new fields exist for existing users
    if (!db.userSettings) {
        db.userSettings = { apiKeys: { deepgram: "", gemini: "", openai: "" }, dailyGoal: 5 };
        await saveDB(db);
    }
    if (!db.stats) {
        db.stats = { streak: 0, lastPracticeDate: null, wordsLearnedHistory: {} };
        await saveDB(db);
    }

    return db;
};

const saveDB = async (db) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [DB_KEY]: db });
    } else {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
};

/**
 * Saves a new vocabulary item.
 * @param {Object} item - The partial item (word, meaning, etc.)
 */
export const saveVocabularyItem = async (item) => {
    const db = await getDB();

    // Check duplicates
    if (db.vocabulary.some(v => v.word.toLowerCase() === item.word.toLowerCase())) {
        throw new Error("Word already exists");
    }

    const newItem = {
        id: generateId(),
        word: item.word,
        meaning: item.meaning || item.definition, // Handle both for now
        example: item.example || "",
        notes: item.notes || "",
        tags: item.tags || [],
        stats: {
            practicedAt: new Date().toISOString(),
            nextReviewDate: new Date().toISOString(),
            confidenceLevel: 1
        },
        ...item // Merge other fields
    };

    // Ensure critical fields are set correctly if passed in item
    if (item.id) newItem.id = item.id;
    if (item.stats) newItem.stats = item.stats;

    db.vocabulary.unshift(newItem);

    // Update Stats
    const today = new Date().toISOString().split('T')[0];
    db.stats.wordsLearnedHistory[today] = (db.stats.wordsLearnedHistory[today] || 0) + 1;

    await saveDB(db);
    return newItem;
};

/**
 * Retrieves all vocabulary items.
 */
export const getVocabulary = async () => {
    const db = await getDB();
    return db.vocabulary;
};

/**
 * Updates a vocabulary item by ID.
 * @param {string} id 
 * @param {Object} updates - Partial object to merge
 */
export const updateVocabularyItem = async (id, updates) => {
    const db = await getDB();
    const index = db.vocabulary.findIndex(v => v.id === id);

    if (index === -1) {
        throw new Error("Item not found");
    }

    // Merge updates
    db.vocabulary[index] = { ...db.vocabulary[index], ...updates };

    await saveDB(db);
    return db.vocabulary[index];
};

/**
 * Deletes a vocabulary item by ID.
 */
export const deleteVocabularyItem = async (id) => {
    const db = await getDB();
    db.vocabulary = db.vocabulary.filter(v => v.id !== id);
    await saveDB(db);
};

// --- User Settings & Stats ---

export const getUserSettings = async () => {
    const db = await getDB();
    return db.userSettings;
};

export const updateUserSettings = async (updates) => {
    const db = await getDB();
    db.userSettings = { ...db.userSettings, ...updates };
    await saveDB(db);
    return db.userSettings;
};

export const getStats = async () => {
    const db = await getDB();
    return db.stats;
};

export const updateStats = async (updates) => {
    const db = await getDB();
    db.stats = { ...db.stats, ...updates };
    await saveDB(db);
    return db.stats;
};

// --- Import / Export ---

export const getFullExportData = async () => {
    const db = await getDB();
    // Exclude API keys from export for security
    const { userSettings, ...cleanDb } = db;
    // But maybe they want to export settings sans keys? 
    // customizable based on spec, but keeping it safe for now.
    return cleanDb;
};

export const importData = async (jsonData) => {
    const db = await getDB();

    // Merge vocabulary (avoid duplicates by ID or Word)
    let newCount = 0;

    if (jsonData.vocabulary && Array.isArray(jsonData.vocabulary)) {
        for (const item of jsonData.vocabulary) {
            const exists = db.vocabulary.some(v =>
                v.id === item.id || v.word.toLowerCase() === item.word.toLowerCase()
            );
            if (!exists) {
                db.vocabulary.push(item);
                newCount++;
            }
        }
    }

    // Merge stats history if present
    if (jsonData.stats && jsonData.stats.wordsLearnedHistory) {
        db.stats.wordsLearnedHistory = {
            ...db.stats.wordsLearnedHistory,
            ...jsonData.stats.wordsLearnedHistory
        };
    }

    await saveDB(db);
    return newCount;
};
