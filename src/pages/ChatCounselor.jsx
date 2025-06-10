import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, User, Bot, Loader2, Heart, Shield, AlertTriangle } from 'lucide-react';

const ChatCounselor = ({ userRiskLevel = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Halo! Saya AIRA, AI Counselor Anda. Saya di sini untuk mendengarkan dan membantu Anda dengan pendekatan Cognitive Behavioral Therapy (CBT). Apa yang ingin Anda bicarakan hari ini?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [crisisResources, setCrisisResources] = useState([
    'Nomor Gawat Darurat: 119',
    'Hotline Kemkes: 1500-567',
    'Into The Light: intothelightid.org'
  ]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Backend API URL - sesuaikan dengan URL backend Anda
  const API_BASE_URL = 'https://hackaton-mental-health.yellowwave-80a93936.southeastasia.azurecontainerapps.io';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToBackend = async (message, userRiskLevel = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: conversationHistory,
          user_risk_level: userRiskLevel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling backend:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update messages and conversation history
    setMessages(prev => [...prev, userMessage]);
    const newConversationHistory = [...conversationHistory, {
      role: 'user',
      content: inputMessage
    }];
    setConversationHistory(newConversationHistory);

    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(currentMessage, userRiskLevel);
      
      // Handle crisis detection
      if (response.is_crisis) {
        setShowCrisisAlert(true);
        setCrisisResources(response.crisis_resources || []);
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: response.response
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: 'Maaf, saya mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat. Jika Anda dalam keadaan darurat, hubungi 119 atau layanan kesehatan mental terdekat.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const CrisisAlert = () => (
    <div className="bg-red-600 text-white p-4 shadow-lg border-b border-red-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Bantuan Darurat Tersedia</p>
              <p className="text-sm mb-2">Jika Anda dalam krisis, segera hubungi layanan darurat:</p>
              <div className="space-y-1 text-sm">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>•</span>
                    <span>{resource}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowCrisisAlert(false)} 
            className="text-white hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-track-slate-900\\/20::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.2);
          border-radius: 10px;
        }
        
        .scrollbar-thumb-slate-700\\/50::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        .scrollbar-thumb-slate-700\\/50:hover::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.7);
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(51, 65, 85, 0.5) rgba(15, 23, 42, 0.2);
        }
        
        textarea.scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea.scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 8px;
          margin: 4px;
        }
        
        textarea.scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.4);
          border-radius: 8px;
          border: 1px solid transparent;
          background-clip: content-box;
        }
        
        textarea.scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.6);
        }
      `}</style>

      {/* Header */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50 flex-shrink-0">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
                <button className="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
                </button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">AIRA - AI Counselor</div>
                <div className="text-slate-400 text-xs">Cognitive Behavioral Therapy (CBT)</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Online</span>
              {/* Demo button to show crisis alert */}
              <button 
                onClick={() => setShowCrisisAlert(true)} 
                className="ml-4 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
              >
                Demo Crisis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Crisis Alert - positioned right below header */}
      {showCrisisAlert && <CrisisAlert />}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-slate-900/20 scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600/70">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl p-6 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-slate-800/50 text-slate-100 border border-slate-700/50'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap text-base">{message.content}</p>
                    <p className="text-xs mt-3 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <div className="bg-slate-800/50 text-slate-100 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-slate-300">AIRA sedang mengetik...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                placeholder="Ketik pesan Anda..."
                className="w-full resize-none rounded-2xl bg-slate-800/80 text-white p-4 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[56px] max-h-32 scrollbar-thin"
                style={{ 
                  height: 'auto',
                  minHeight: '56px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 p-4 rounded-2xl h-12 w-12 flex-shrink-0 flex items-center justify-center transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCounselor;