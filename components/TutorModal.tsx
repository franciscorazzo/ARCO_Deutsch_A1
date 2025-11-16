import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Modal } from './Modal';
import { TutorIcon } from './icons';
import type { ChatMessage } from '../types';

interface TutorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const model = 'gemini-2.5-flash';
const systemInstruction = `You are Professor Klaus, a friendly and encouraging German language tutor. Your student is a beginner at the A1 level. Your goal is to help them learn and practice German.
- Keep your explanations simple, clear, and concise.
- Use a mix of German and the user's language (assume Portuguese if not specified) to explain concepts, but encourage the use of German.
- When the user asks for a translation, provide it, but also give a simple example sentence.
- If the user makes a mistake in German, gently correct them and explain why.
- Be patient and supportive. Start the conversation with a warm welcome in German.`;

export const TutorModal: React.FC<TutorModalProps> = ({ isOpen, onClose }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            try {
                if (!aiRef.current) {
                    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
                }
                const newChat = aiRef.current.chats.create({
                    model,
                    config: { systemInstruction },
                });
                setChat(newChat);

                const welcomeMessage: ChatMessage = {
                    role: 'model',
                    content: 'Hallo! Ich bin Professor Klaus. Wie kann ich dir heute mit deinem Deutsch helfen?',
                };
                setMessages([welcomeMessage]);
                setError(null);
                setUserInput('');
            } catch(e: any) {
                console.error("Failed to initialize AI Tutor:", e);
                setError('Falha ao iniciar o tutor de IA. Por favor, tente novamente mais tarde.');
                setMessages([]);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const result: GenerateContentResponse = await chat.sendMessage({ message: userInput });
            const modelResponse: ChatMessage = { role: 'model', content: result.text || '' };
            setMessages(prev => [...prev, modelResponse]);
        } catch (err) {
            console.error("AI chat error:", err);
            setError('Desculpe, não consegui processar sua pergunta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tutor AI - Professor Klaus">
            <div className="flex flex-col h-[70vh]">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.role === 'model' && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                                    <TutorIcon />
                                </div>
                            )}
                            <div className={`max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                                <TutorIcon />
                            </div>
                            <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                     {error && (
                        <div className="p-3 my-4 text-center text-red-600 bg-red-100 rounded-lg">
                            <p className="font-bold">Ocorreu um erro</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Pergunte algo em alemão..."
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                            disabled={isLoading || !!error}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim() || !!error}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};
