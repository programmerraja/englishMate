import React, { useEffect, useRef, useState } from 'react';

import { Send, User, Bot, Loader2 } from 'lucide-react';
import { saveMessageToSession, updateChatSession } from '../../lib/storage';
import { streamChat } from '../../lib/ai-service';
// import { useChat } from 'ai/react';

const ChatView = ({ session, provider, onSessionTitleChange }) => {
    // Custom fetch function to bridge AI SDK `useChat` with our `streamChat` service
    // `useChat` by default calls an API endpoint. We want to call our client-side service.
    // However, `useChat` expects a response stream from `api`.
    // Vercel AI SDK 3.x is flexible. We can use `useChat` mostly for UI state 
    // but might need to manually handle the submission if we are not hitting a Next.js API route.

    // Actually, `useChat` is designed for Server Actions or API routes. 
    // Since we are likely pure client-side (Extension), we might need to use `streamText` directly 
    // and manage state manually OR mock the fetch.

    // Let's implement manual state to be safe and compatible with our `ai-service.js`.

    const [messages, setMessages] = useState(session.messages || []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Sync when session changes
    useEffect(() => {
        setMessages(session.messages || []);
        setInput('');
        setIsLoading(false);
    }, [session.id]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input };

        // 1. Optimistic Update
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // 2. Persist User Message
        await saveMessageToSession(session.id, userMsg);

        // 3. Generate Title if it's the first message
        if (messages.length === 0) {
            const generatedTitle = input.substring(0, 30) + (input.length > 30 ? '...' : '');
            onSessionTitleChange(session.id, generatedTitle);
        }

        try {
            // 4. Call AI Service
            const { textStream } = await streamChat(newMessages, provider);

            // 5. Stream Response
            let fullResponse = "";
            const assistantMsgId = (Date.now() + 1).toString();

            // Add placeholder for assistant
            setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

            for await (const delta of textStream) {
                fullResponse += delta;
                setMessages(prev => prev.map(m =>
                    m.id === assistantMsgId ? { ...m, content: fullResponse } : m
                ));
            }

            // 6. Persist Assistant Message
            await saveMessageToSession(session.id, {
                id: assistantMsgId,
                role: 'assistant',
                content: fullResponse
            });

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                content: `Error: ${error.message || "Failed to get response."}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-view">
            <div className="messages-list">
                {messages.map((m, i) => (
                    <div key={m.id || i} className={`message-row ${m.role}`}>
                        <div className="message-avatar">
                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className="message-bubble glass-panel">
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="message-row assistant">
                        <div className="message-avatar"><Bot size={16} /></div>
                        <div className="message-bubble glass-panel typing-indicator">
                            <Loader2 size={16} className="spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area glass-panel" onSubmit={handleSend}>
                <input
                    className="chat-input"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatView;
