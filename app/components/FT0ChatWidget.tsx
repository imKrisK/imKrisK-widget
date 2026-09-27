'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './FT0ChatWidget.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recruiterType?: string;
}

export default function FT0ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hi! I\'m FT0, an AI assistant trained on Kristoffer\'s background. Ask me about his operations experience, technical skills, or leadership approach. I\'ll tailor my responses based on what matters to you.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId] = useState(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ft0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recruiterType: data.recruiterType,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div>
          <h2>Ask FT0</h2>
          <p>Chat with an AI trained on Kristoffer's background</p>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.role]}`}
          >
            <div className={styles.messageContent}>
              <p>{message.content}</p>
              {message.recruiterType && (
                <span className={styles.recruiterTag}>
                  Profile: {message.recruiterType}
                </span>
              )}
            </div>
            <span className={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageContent}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className={`${styles.message} ${styles.error}`}>
            <div className={styles.messageContent}>
              <p>Error: {error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about operations, leadership, technical skills..."
          disabled={loading}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.sendButton}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
