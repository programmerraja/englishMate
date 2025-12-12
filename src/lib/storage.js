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
    if (!chrome?.storage?.local) {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) db = JSON.parse(raw);
    } else {
        const result = await chrome.storage.local.get([DB_KEY]);
        db = result[DB_KEY];
    }

    // 2. If no DB, initialize default
    if (!db) {
        // Initialize default DB
        db = {
            vocabulary: [],
            sentences: []
        };
        await saveDB(db);
    }

    return db;
};

const saveDB = async (db) => {
    if (!chrome?.storage?.local) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } else {
        await chrome.storage.local.set({ [DB_KEY]: db });
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
