import { v4 as uuidv4 } from 'uuid'; // Fallback if crypto not available, but we'll try native first.

const DB_KEY = 'englishMateDB';

// Helpher to generate ID
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

    // 2. If no DB, check for migration from old 'savedWords'
    if (!db) {
        let oldWords = [];
        if (!chrome?.storage?.local) {
            oldWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
        } else {
            const result = await chrome.storage.local.get(['savedWords']);
            oldWords = result.savedWords || [];
        }

        // Initialize default DB
        db = {
            vocabulary: [],
            sentences: []
        };

        // Migrate if we found old data
        if (oldWords.length > 0) {
            console.log("Migrating old data...", oldWords);
            db.vocabulary = oldWords.map(w => ({
                id: generateId(),
                word: w.word,
                meaning: w.definition,
                example: w.example || "",
                notes: "",
                tags: [],
                stats: {
                    practicedAt: w.timestamp ? new Date(w.timestamp).toISOString() : new Date().toISOString(),
                    nextReviewDate: new Date().toISOString(),
                    confidenceLevel: 1
                },
                originalData: w // Keep original just in case
            }));
        }

        // Save the new initialized DB
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
        ...item // Merge any other fields provided, but above defaults take precedence if not in item
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

    // Special handling for nested stats if partially provided? 
    // Logic: if updates.stats is provided, it replaces the stats object usually. 
    // If we want partial stats update, we should handle it in the caller or here.
    // For now, assume caller passes full stats object or we just do shallow merge of top level properties.
    // Actually, let's allow deep merge for stats if needed, but standard spread usually replaces nested objects.
    // Let's rely on caller to provide complete stats object if they update stats.

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

// --- Backward Compatibility Wrapper (Optional) ---
export const saveWord = async (wordData) => {
    // Adapter for old saveWord calls to new system
    return saveVocabularyItem(wordData);
};

export const getSavedWords = async () => {
    // Adapter for old getSavedWords calls
    const vocab = await getVocabulary();
    // Map back to old format if necessary, or just return new format 
    // and let components handle it (since we are updating components too).
    // The components expect { word, definition, example... }
    // New format: { word, meaning, example... }
    // We should probably ensure 'definition' exists for legacy components until we update them.
    return vocab.map(v => ({
        ...v,
        definition: v.meaning, // Map meaning back to definition for compatibility
    }));
};
