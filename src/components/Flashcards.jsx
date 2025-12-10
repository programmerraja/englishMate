import React, { useState, useEffect } from 'react';
import { getSavedWords } from '../lib/storage';
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
        const saved = await getSavedWords();
        setWords(saved);
        setLoading(false);
    };

    const handleNext = () => {
        setIsFlipped(false);
        // Simple loop: go to next, wrap around if at end
        setCurrentIndex((prev) => (prev + 1) % words.length);
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
                        <p className="fc-def">{currentWord.definition}</p>
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
                        <button className="btn-hard" onClick={handleNext}>
                            ❌ I Don't Know
                        </button>
                        <button className="btn-easy" onClick={handleNext}>
                            ✅ I Know
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
