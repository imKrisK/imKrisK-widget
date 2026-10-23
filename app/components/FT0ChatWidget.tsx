'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './FT0ChatWidget.module.css';
import StructuredResponse from './StructuredResponse';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structuredContent?: any;
  timestamp: string;
  recruiterType?: string;
}

interface FT0Props {
  profileType?: 'operations' | 'technical';
  isFloating?: boolean;
}

export default function FT0ChatWidget({ profileType = 'operations', isFloating = false }: FT0Props) {
  const initialMessage = profileType === 'technical'
    ? 'Hi! I\'m FT0, an AI trained on Kristoffer\'s technical background and innovation work. Ask me about AI systems, software architecture, open-source projects, patents, or technical leadership. I\'ll provide detailed technical insights.'
    : 'Hi! I\'m FT0, an AI assistant trained on Kristoffer\'s background. Ask me about his operations experience, technical skills, or leadership approach. I\'ll tailor my responses based on what matters to you.';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId] = useState(() => Math.random().toString(36).substring(7));
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize floating widget position
  useEffect(() => {
    if (isFloating) {
      // Position in bottom-right corner
      setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 500 });
    }
  }, [isFloating]);

  // Load position from localStorage
  useEffect(() => {
    if (isFloating) {
      const savedPosition = localStorage.getItem('ft0-widget-position');
      const savedMinimized = localStorage.getItem('ft0-widget-minimized');
      if (savedPosition) {
        try {
          setPosition(JSON.parse(savedPosition));
        } catch (e) {
          console.error('Failed to restore widget position:', e);
        }
      }
      if (savedMinimized) {
        setIsMinimized(JSON.parse(savedMinimized));
      }
    }
  }, [isFloating]);

  // Save position to localStorage
  useEffect(() => {
    if (isFloating) {
      localStorage.setItem('ft0-widget-position', JSON.stringify(position));
      localStorage.setItem('ft0-widget-minimized', JSON.stringify(isMinimized));
    }
  }, [position, isMinimized, isFloating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isFloating) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isFloating]);

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
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Include the new user message in the API call
      const updatedMessages = [...messages, userMessage];
      
      const response = await fetch('/api/ft0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
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
        structuredContent: data.structuredResponse,
        timestamp: new Date().toISOString(),
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

  const containerStyle = isFloating
    ? {
        position: 'fixed' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '400px',
        zIndex: 9999,
      }
    : {};

  return (
    <div 
      ref={widgetRef}
      className={`${styles.widget} ${isFloating ? styles.floating : ''} ${isDragging ? styles.dragging : ''}`}
      style={containerStyle}
    >
      <div 
        ref={headerRef}
        className={styles.header}
        onMouseDown={handleMouseDown}
        style={{ cursor: isFloating ? 'grab' : 'default' }}
      >
        <div>
          <h2>Ask FT0</h2>
          <p>Chat with an AI trained on Kristoffer's background</p>
        </div>
        {isFloating && (
          <div className={styles.headerControls}>
            <button
              className={styles.controlButton}
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand' : 'Minimize'}
              aria-label="Toggle widget"
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          <div className={styles.messages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageContent}>
                  {message.structuredContent ? (
                    <StructuredResponse data={message.structuredContent} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  {message.recruiterType && (
                    <span className={styles.recruiterTag}>
                      Profile: {message.recruiterType}
                    </span>
                  )}
                </div>
                <span className={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
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
        </>
      )}
    </div>
  );
}
