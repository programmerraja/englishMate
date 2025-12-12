import React, { useState, useEffect } from 'react';
import { getVocabulary, updateVocabularyItem } from '../lib/storage';
import './Flashcards.css';

const Flashcards = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        const saved = await getVocabulary();
        setWords(saved);
        setLoading(false);
    };

    const handleNext = () => {
        setIsFlipped(false);
        // Simple loop: go to next, wrap around if at end
        setCurrentIndex((prev) => (prev + 1) % words.length);
    };

    const handleResult = async (known) => {
        const word = words[currentIndex];
        const currentStats = word.stats || { confidenceLevel: 0 };
        const newConfidence = known ? (currentStats.confidenceLevel || 0) + 1 : 1;

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (known ? newConfidence : 1));

        const updates = {
            stats: {
                practicedAt: new Date().toISOString(),
                nextReviewDate: nextDate.toISOString(),
                confidenceLevel: newConfidence
            }
        };

        try {
            await updateVocabularyItem(word.id, updates);

            // Update local state to reflect changes
            const newWords = [...words];
            newWords[currentIndex] = { ...word, ...updates };
            setWords(newWords);
        } catch (e) {
            console.error("Failed to update stats", e);
        }

        handleNext();
    };

    if (loading) return <div className="fc-loading">Loading...</div>;

    if (words.length === 0) {
        return (
            <div className="fc-empty">
                <h3>No words saved yet! 📝</h3>
                <p>Go to the <b>Lookup</b> tab to search and save some words.</p>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div className="fc-container">
            <div className="progress-bar">
                Card {currentIndex + 1} of {words.length}
            </div>

            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                <div className="fc-front">
                    <h2>{currentWord.word}</h2>
                    <span className="tap-hint">👆 Tap to reveal</span>
                </div>

                <div className="fc-back">
                    <div className="fc-content">
                        <span className="fc-pos">{currentWord.partOfSpeech}</span>
                        <p className="fc-def">{currentWord.meaning}</p>
                        {currentWord.example && (
                            <p className="fc-ex">"{currentWord.example}"</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="fc-controls">
                {!isFlipped ? (
                    <button className="reveal-btn" onClick={() => setIsFlipped(true)}>
                        Show Meaning
                    </button>
                ) : (
                    <div className="rating-btns">
                        <button className="btn-hard" onClick={() => handleResult(false)}>
                            ❌ I Don't Know
                        </button>
                        <button className="btn-easy" onClick={() => handleResult(true)}>
                            ✅ I Know
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
