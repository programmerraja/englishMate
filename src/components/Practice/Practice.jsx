import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RefreshCcw, BookCheck, AlertCircle, Quote } from 'lucide-react';
import { transcribeAudio, analyzeSpeech } from '../../lib/ai-service';
import { getVocabulary } from '../../lib/storage';
import './Practice.css';

const Practice = () => {
    const [topic, setTopic] = useState("Introduce yourself and your hobbies.");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState("");

    // Audio & Canvas Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        generateTopic();
        return () => {
            // Cleanup
            if (audioContextRef.current) audioContextRef.current.close();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    const generateTopic = async () => {
        const words = await getVocabulary();
        const baseTopics = [
            "Describe your favorite travel destination.",
            "What motivates you to work hard?",
            "Discuss a recent challenge you overcame.",
            "What is your opinion on remote work?",
            "Introduce yourself and your hobbies."
        ];

        // If we have words, maybe construct a topic (simple logic for now)
        if (words.length > 5) {
            const randomWord = words[Math.floor(Math.random() * words.length)].word;
            setTopic(`Talk about a situation where you might use the word "${randomWord}".`);
        } else {
            setTopic(baseTopics[Math.floor(Math.random() * baseTopics.length)]);
        }

        setFeedback(null);
        setTranscript("");
        setError("");
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // Use webm for simplicity or wav-encoder if needed
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = handleStop;

            mediaRecorderRef.current.start();
            setIsRecording(true);
            visualize(stream);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop logic
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    const handleStop = async () => {
        // Concatenate blobs (simple webm)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        setIsProcessing(true);
        try {
            // 1. Transcribe (Deepgram usually needs WAV, but Nova-2 is robust. 
            // If strictly WAV needed, we'd need a helper. Let's try sending blob directly first).
            const text = await transcribeAudio(audioBlob);
            setTranscript(text);

            // 2. Analyze (Gemini/OpenAI)
            const result = await analyzeSpeech(text);
            setFeedback(result);
        } catch (e) {
            console.error(e);
            setError(e.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const visualize = (stream) => {
        if (!canvasRef.current) return;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyserRef.current = analyser;

        analyser.fftSize = 256;
        source.connect(analyser);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 92, 246)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        draw();
    };

    return (
        <div className="practice-container">
            <div className="topic-card glass-panel">
                <div className="topic-label">Your Speaking Topic</div>
                <div className="topic-text">{topic}</div>
                <button className="icon-btn" onClick={generateTopic} style={{ marginTop: '1rem' }}>
                    <RefreshCcw size={16} /> New Topic
                </button>
            </div>

            <div className={`recorder-section glass-panel`}>
                {isRecording && <canvas ref={canvasRef} className="visualizer-canvas" width="600" height="100"></canvas>}

                {isProcessing ? (
                    <div className="loading-pulse">Analyzing your speech...</div>
                ) : (
                    !isRecording ? (
                        <button className="record-btn" onClick={startRecording}>
                            <Mic size={32} />
                        </button>
                    ) : (
                        <button className="stop-btn" onClick={stopRecording}>
                            <Square size={32} />
                        </button>
                    )
                )}

                {error && <div className="decay-alert">{error}</div>}
            </div>

            {transcript && (
                <div className="transcript-box glass-panel">
                    <h3><Quote size={18} /> Transcript</h3>
                    <p>"{transcript}"</p>
                </div>
            )}

            {feedback && (
                <div className="feedback-grid">
                    {/* Grammar */}
                    <div className="feedback-card grammar glass-panel">
                        <h3><AlertCircle size={20} /> Grammar Fixes</h3>
                        {feedback.grammar_corrections?.length === 0 ? (
                            <p className="good-part">Perfect! No grammar errors found.</p>
                        ) : (
                            feedback.grammar_corrections?.map((item, i) => (
                                <div key={i} className="feedback-item">
                                    <div><span className="bad-part">{item.original}</span> <span className="correction-arrow">➜</span> <span className="good-part">{item.correction}</span></div>
                                    <small>{item.explanation}</small>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pronunciation */}
                    <div className="feedback-card pronunciation glass-panel">
                        <h3><Mic size={20} /> Pronunciation</h3>
                        {feedback.pronunciation_notes?.length === 0 ? (
                            <p>Clear pronunciation!</p>
                        ) : (
                            <ul>
                                {feedback.pronunciation_notes?.map((note, i) => <li key={i}>{note}</li>)}
                            </ul>
                        )}
                    </div>

                    {/* Vocab */}
                    <div className="feedback-card vocab glass-panel">
                        <h3><BookCheck size={20} /> Vocabulary Suggestions</h3>
                        {feedback.vocabulary_suggestions?.map((item, i) => (
                            <div key={i} className="feedback-item">
                                <strong>{item.word_used}</strong> could be <strong>{item.suggestion}</strong>
                                <br /><small>{item.reason}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Practice;
