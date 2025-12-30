
import React, { useState, useEffect } from 'react';
import { Novel, ChatMessage } from '../types';
import { ChevronLeft, ChevronRight, X, Sparkles, MessageSquare, BookMarked, Settings, Info } from 'lucide-react';
import { getNovelSummary, chatWithAssistant } from '../services/gemini';

interface ReaderProps {
  novel: Novel;
  onClose: () => void;
}

const Reader: React.FC<ReaderProps> = ({ novel, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  const fetchSummary = async () => {
    setIsSummaryLoading(true);
    const result = await getNovelSummary(novel);
    setSummary(result);
    setIsSummaryLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsChatLoading(true);

    const assistantResponse = await chatWithAssistant(novel, userInput, chatMessages);
    const assistantMsg: ChatMessage = { role: 'assistant', content: assistantResponse };
    setChatMessages(prev => [...prev, assistantMsg]);
    setIsChatLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom duration-300">
      {/* Sidebar - Novel Info */}
      <div className="hidden lg:flex w-80 bg-gray-50 border-r flex-col p-8 overflow-y-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Exit Reader</span>
        </button>

        <img src={novel.coverImage} className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg mb-6" alt={novel.title} />
        
        <h1 className="font-urdu text-3xl font-bold text-right mb-2">{novel.title}</h1>
        <p className="font-urdu text-lg text-right text-[#d4af37] mb-6">{novel.author}</p>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Synopsis
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{novel.description}</p>
          </div>

          <div className="bg-[#1a3a3a] text-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI Assistant
            </h3>
            <p className="text-xs text-white/70 mb-4">Get chapter insights, character maps, and more.</p>
            <button 
              onClick={() => { setIsAiOpen(true); if(!summary) fetchSummary(); }}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all"
            >
              Consult AI Expert
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Content */}
      <div className="flex-1 flex flex-col h-full bg-[#faf9f6]">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b bg-white flex justify-between items-center">
          <button onClick={onClose}><X className="w-6 h-6" /></button>
          <span className="font-urdu font-bold truncate px-4">{novel.title}</span>
          <button onClick={() => setIsAiOpen(true)}><Sparkles className="w-6 h-6 text-[#d4af37]" /></button>
        </div>

        {/* Reading Controls */}
        <div className="p-4 bg-white/50 backdrop-blur-sm border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              A-
            </button>
            <span className="text-xs font-bold text-gray-500">{fontSize}px</span>
            <button 
              onClick={() => setFontSize(prev => Math.min(48, prev + 2))}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              A+
            </button>
          </div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#d4af37]" />
            <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#d4af37]" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 scroll-smooth">
          <div 
            dir="rtl" 
            className="font-urdu mx-auto max-w-3xl leading-[3] text-gray-800"
            style={{ fontSize: `${fontSize}px` }}
          >
            {novel.content[currentPage] || "This page is empty."}
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="p-6 bg-white border-t flex items-center justify-between">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-30 hover:bg-gray-200 transition-all font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            Pichey
          </button>
          <div className="text-sm font-bold text-gray-400">
            Page {currentPage + 1} of {novel.content.length}
          </div>
          <button 
            disabled={currentPage === novel.content.length - 1}
            onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a3a3a] text-white rounded-lg disabled:opacity-30 hover:bg-[#254d4d] transition-all font-semibold"
          >
            Aagay
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Assistant Overlay/Panel */}
      {isAiOpen && (
        <div className="fixed inset-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[450px] bg-white shadow-2xl z-[70] flex flex-col border-l animate-in slide-in-from-right duration-300">
          <div className="p-6 bg-[#1a3a3a] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-bold leading-none">AI Book Companion</h3>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Powered by Gemini</span>
              </div>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="hover:rotate-90 transition-transform">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Summary Section */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-3 h-3" />
                AI Literary Analysis
              </h4>
              {isSummaryLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse w-4/6"></div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-urdu text-lg text-right leading-loose whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            </section>

            <div className="border-t pt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                Deep Dive Discussion
              </h4>
              
              <div className="space-y-4 mb-20">
                {chatMessages.length === 0 && (
                  <p className="text-sm text-gray-500 text-center italic py-4">
                    Ask me about the characters, their motivations, or the historical setting.
                  </p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#1a3a3a] text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                      <p className={`${msg.role === 'assistant' ? 'font-urdu text-right text-lg' : 'text-sm'}`}>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none animate-pulse">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t flex gap-2">
            <input 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Sawaal puchiye..." 
              className="flex-1 px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1a3a3a] font-urdu text-right"
            />
            <button 
              type="submit"
              disabled={isChatLoading}
              className="p-2 bg-[#d4af37] text-[#1a3a3a] rounded-xl hover:bg-[#c29d2e] transition-all disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reader;
