/**
 * Coach page — AI-powered habit insights chat interface
 */

import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionRate } from '../utils/streakUtils';

const Icons = {
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  ),
  sparkle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  ),
  bot: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
};

// Demo responses based on user stats
function getCoachResponse(message, habits, completions) {
  const lower = message.toLowerCase();
  
  if (lower.includes('streak') || lower.includes('consistency')) {
    const avgStreak = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + calculateCurrentStreak(completions[h.id] || []), 0) / habits.length)
      : 0;
    return `Your average streak is ${avgStreak} days. To build longer streaks, try:\n\n• Start with just 1-2 habits\n• Set realistic daily targets\n• Use the "skip day" feature when life gets busy\n• Celebrate small wins to stay motivated`;
  }
  
  if (lower.includes('improve') || lower.includes('better') || lower.includes('advice')) {
    const rate = calculateCompletionRate(Object.values(completions).flat(), 30);
    if (rate < 50) {
      return `Your completion rate is ${rate}%. Here's how to improve:\n\n• Reduce your habit count — focus on 2-3 key habits\n• Make habits smaller and more achievable\n• Schedule habits at consistent times\n• Use reminders to stay on track`;
    }
    return `Great job! Your completion rate is ${rate}%. To keep improving:\n\n• Add one new habit gradually\n• Increase difficulty slightly each week\n• Track your longest streaks for motivation\n• Review your progress weekly`;
  }
  
  if (lower.includes('motivation') || lower.includes('motivated')) {
    return `Remember why you started! Here are some tips:\n\n• Visualize your future self with these habits\n• Track your progress visually — you've already built momentum\n• Find an accountability partner\n• Reward yourself for milestones\n• Focus on progress, not perfection`;
  }
  
  if (lower.includes('help') || lower.includes('what can')) {
    return `I can help you with:\n\n• Streak analysis and consistency tips\n• Completion rate insights\n• Motivation and habit-building advice\n• Habit suggestions based on your goals\n• Weekly progress reviews\n\nJust ask me anything about your habits!`;
  }
  
  // Default response
  const totalHabits = habits.length;
  const totalCompletions = Object.values(completions).flat().length;
  return `You have ${totalHabits} active habit${totalHabits !== 1 ? 's' : ''} with ${totalCompletions} total completions. You're building great momentum!\n\nAsk me about:\n• Your streaks and consistency\n• How to improve your habits\n• Motivation tips\n• Habit suggestions`;
}

export default function Coach() {
  const { habits, getHabitCompletions } = useHabits();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your habit coach. I can help you analyze your progress, stay motivated, and build better habits.\n\nYou currently have ${habits.length} active habit${habits.length !== 1 ? 's' : ''}. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Build completions map
  const completionsMap = {};
  habits.forEach(h => {
    completionsMap[h.id] = getHabitCompletions(h.id);
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate AI thinking
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get coach response
    const response = getCoachResponse(userMessage, habits, completionsMap);
    
    // Add assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'How are my streaks?',
    'How can I improve?',
    'Give me motivation',
    'What can you help with?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 className="h1" style={{ marginBottom: '4px' }}>AI Coach</h1>
        <p className="muted" style={{ fontSize: '14px' }}>
          Get personalized insights about your habits
        </p>
      </div>

      {/* Chat container */}
      <div className="card" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
      }}>
        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-line ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--leaf-soft)',
                  color: 'var(--leaf)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}>
                  {Icons.bot}
                </div>
              )}
              <div className={msg.role === 'assistant' ? 'msg-a' : 'msg-u'}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-line assistant">
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--leaf-soft)',
                color: 'var(--leaf)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}>
                {Icons.bot}
              </div>
              <div className="msg-a">
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div style={{ 
            padding: '0 20px 12px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                className="chip"
                onClick={() => {
                  setInput(prompt);
                  setTimeout(handleSend, 100);
                }}
                style={{ cursor: 'pointer' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ 
          borderTop: '1px solid var(--line)',
          padding: '16px 20px',
          background: 'var(--surface2)',
        }}>
          <div className="row-s">
            <textarea
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your habits..."
              rows={1}
              style={{ 
                resize: 'none',
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{ padding: '10px 16px' }}
            >
              {isLoading ? (
                <span className="spin" />
              ) : (
                Icons.send
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
