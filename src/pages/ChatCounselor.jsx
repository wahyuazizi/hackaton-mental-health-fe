import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, User, Bot, Loader2, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ChatCounselor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Halo! Saya AIRA, AI Counselor Anda. Saya di sini untuk mendengarkan dan membantu Anda dengan pendekatan Cognitive Behavioral Therapy (CBT). Apa yang ingin Anda bicarakan hari ini?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const crisisKeywords = ['bunuh diri', 'mengakhiri hidup', 'tidak ingin hidup', 'suicide', 'mati saja'];

  const detectCrisis = (message) => {
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getBotResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const message = userMessage.toLowerCase();
    if (detectCrisis(message)) {
      setShowCrisisAlert(true);
      return "Saya sangat peduli dengan keselamatan Anda. Jika Anda memiliki pikiran untuk menyakiti diri sendiri, tolong segera hubungi nomor darurat 119 atau konsultasi dengan profesional kesehatan mental. Anda tidak sendirian dalam menghadapi ini. Bisakah kita bicara tentang dukungan yang bisa membantu Anda saat ini?";
    }

    if (message.includes('cemas') || message.includes('khawatir') || message.includes('takut')) {
      return "Saya memahami Anda sedang merasa cemas. Mari kita identifikasi pikiran yang mungkin memicu kecemasan ini. Bisakah Anda ceritakan situasi spesifik yang membuat Anda merasa cemas?";
    }
    if (message.includes('judi') || message.includes('betting') || message.includes('taruhan')) {
      return "Terima kasih sudah mempercayai saya untuk membicarakan hal ini. Kecanduan judi adalah tantangan yang nyata. Mari kita eksplorasi: kapan terakhir kali Anda merasa keinginan untuk berjudi?";
    }
    if (message.includes('sedih') || message.includes('depresi') || message.includes('putus asa')) {
      return "Saya dapat merasakan bahwa Anda sedang berjuang dengan perasaan sedih. Mari kita mulai dengan mengidentifikasi pikiran apa yang muncul ketika Anda merasa sedih?";
    }
    if (message.includes('stres') || message.includes('tertekan') || message.includes('overwhelmed')) {
      return "Stres yang Anda rasakan valid dan dapat dikelola. Mari kita gunakan teknik grounding untuk menenangkan pikiran.";
    }
    if (message.includes('susah tidur') || message.includes('insomnia') || message.includes('tidak bisa tidur')) {
      return "Masalah tidur sering terkait dengan pikiran yang berputar-putar. Mari kita coba teknik 'thought stopping'.";
    }

    const responses = [
      "Terima kasih sudah berbagi dengan saya. Saya di sini untuk mendengarkan.",
      "Saya memahami bahwa ini tidak mudah. Mari kita coba identifikasi pola pikir Anda.",
      "Langkah untuk berbicara tentang masalah Anda adalah langkah yang berani.",
      "Saya ingin membantu Anda memahami hubungan antara pikiran dan perasaan Anda."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style jsx>{`
        /* Custom Scrollbar Styles */
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
        
        .scrollbar-thumb-slate-700\\/50::-webkit-scrollbar-thumb:active {
          background: rgba(71, 85, 105, 0.8);
        }
        
        /* Firefox scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(51, 65, 85, 0.5) rgba(15, 23, 42, 0.2);
        }
        
        /* Hide scrollbar for clean look until hover */
        .scrollbar-auto-hide::-webkit-scrollbar-thumb {
          background: transparent;
          transition: background 0.3s ease;
        }
        
        .scrollbar-auto-hide:hover::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
        }
        
        .scrollbar-auto-hide:hover::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 0.7);
        }
        
        /* Textarea specific scrollbar styling */
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
        
        textarea.scrollbar-thin::-webkit-scrollbar-thumb:active {
          background: rgba(85, 99, 125, 0.8);
        }
      `}</style>

      {showCrisisAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4">
          <div className="max-w-none mx-auto flex items-center justify-center space-x-3">
            <Shield className="w-6 h-6" />
            <div className="flex-1 text-center">
              <p className="font-semibold">Bantuan Darurat Tersedia</p>
              <p className="text-sm">Jika Anda dalam krisis, hubungi 119 atau layanan kesehatan mental terdekat</p>
            </div>
            <button onClick={() => setShowCrisisAlert(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className={`border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50 flex-shrink-0 ${showCrisisAlert ? 'mt-20' : ''}`}>
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
                <button className="flex items-center space-x-2 text-slate-300 hover:text-white">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Area - Full Screen Width & Height */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-slate-900/20 scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600/70 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-auto-hide">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl p-6 ${message.type === 'user' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-slate-800/50 text-slate-100 border border-slate-700/50'}`}>
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

      {/* Input Area - Fixed at Bottom, Full Width */}
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
                className="w-full resize-none rounded-2xl bg-slate-800/80 text-white p-4 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[56px] max-h-32 scrollbar-thin scrollbar-track-slate-900/20 scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600/70 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-auto-hide"
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
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 p-4 rounded-2xl h-12 w-12 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCounselor;