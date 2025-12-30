
import React from 'react';
import { Book, Search, User, Menu, Home, Heart, Compass } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'home' | 'discover' | 'favorites';
  setActiveView: (view: 'home' | 'discover' | 'favorites') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-[#1a3a3a] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6 text-[#d4af37]" />
          <span className="font-urdu text-xl font-bold">داستانِ اردو</span>
        </div>
        <div className="flex items-center gap-3">
           <Search className="w-5 h-5" onClick={() => setActiveView('discover')} />
           <Menu className="w-6 h-6" />
        </div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1a3a3a] text-white h-screen sticky top-0 shadow-xl">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <Book className="w-8 h-8 text-[#d4af37]" />
          <h1 className="font-urdu text-2xl font-bold tracking-wider">داستانِ اردو</h1>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          <button 
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'home' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'hover:bg-white/5'}`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button 
            onClick={() => setActiveView('discover')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'discover' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'hover:bg-white/5'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="font-medium">Discover</span>
          </button>
          <button 
            onClick={() => setActiveView('favorites')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'favorites' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'hover:bg-white/5'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="font-medium">My Shelf</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center font-bold text-[#1a3a3a]">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Urdu Reader</p>
              <p className="text-xs text-white/50">Free Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#faf9f6] relative">
        {/* Sticky Search Header */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 sticky top-0 z-40 items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keywords..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#1a3a3a]"
            />
          </div>
          <div className="flex gap-4">
             <button className="text-sm font-semibold text-[#1a3a3a] hover:underline">Urdu Typing Enabled</button>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
