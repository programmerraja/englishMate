import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getUserSettings } from './storage';

/**
 * Transcribes audio using Deepgram API
 * @param {Blob} audioBlob 
 * @returns {Promise<string>} The transcript
 */
export const transcribeAudio = async (audioBlob) => {
    const settings = await getUserSettings();
    const apiKey = settings.apiKeys.deepgram;

    if (!apiKey) {
        throw new Error("Deepgram API Key is missing. Please add it in Settings.");
    }

    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'audio/wav', // Adjust if blob is slightly different
        },
        body: audioBlob
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Deepgram Error: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    const transcript = data.results?.channels[0]?.alternatives[0]?.transcript;

    if (!transcript) {
        throw new Error("No transcript generated.");
    }

    return transcript;
};

/**
 * Analyzes the transcript using the Vercel AI SDK
 * @param {string} transcript 
 * @param {'gemini'|'openai'} provider 
 * @returns {Promise<Object>} Structured feedback
 */
export const analyzeSpeech = async (transcript, providerChoice = 'gemini') => {
    const settings = await getUserSettings();
    const apiKeys = settings.apiKeys;

    let model;

    if (providerChoice === 'openai') {
        if (!apiKeys.openai) throw new Error("OpenAI API Key is missing.");
        const openai = createOpenAI({ apiKey: apiKeys.openai });
        model = openai('gpt-4-turbo'); // or gpt-3.5-turbo
    } else {
        // Default to Gemini
        if (!apiKeys.gemini) throw new Error("Gemini API Key is missing.");
        const google = createGoogleGenerativeAI({ apiKey: apiKeys.gemini });
        model = google('gemini-1.5-pro'); // or gemini-pro
    }

    const prompt = `
    You are an expert English Language Coach.
    Analyze the following transcript of a student practicing speaking.
    
    Transcript: "${transcript}"
    
    Provide structured feedback in strictly valid JSON format with the following keys:
    - grammar_corrections: Array of objects { original: string, correction: string, explanation: string }
    - pronunciation_notes: Array of strings pointing out likely difficult words.
    - vocabulary_suggestions: Array of objects { word_used: string, suggestion: string, reason: string }
    - overall_score: number (1-10)
    
    Do not add markdown formatting like \`\`\`json. Just return the raw JSON.
    `;

    const { text } = await generateText({
        model: model,
        prompt: prompt,
    });

    try {
        // Clean up markdown if model adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("AI Response Parse Error:", text);
        throw new Error("Failed to parse AI feedback.");
    }
};
