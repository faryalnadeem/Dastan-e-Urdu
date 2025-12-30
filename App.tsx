
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import NovelCard from './components/NovelCard';
import Reader from './components/Reader';
import { NOVELS } from './data';
import { Novel, Genre } from './types';
import { TrendingUp, Award, Calendar, Sparkles, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'discover' | 'favorites'>('home');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const handleNovelClick = (novel: Novel) => {
    setSelectedNovel(novel);
  };

  const filteredNovels = useMemo(() => {
    return NOVELS.filter(novel => {
      // Filter by Favorite view
      if (activeView === 'favorites' && !favorites.includes(novel.id)) return false;
      
      // Filter by Genre
      if (selectedGenre !== 'All' && novel.genre !== selectedGenre) return false;

      // Search matching logic (Title, Author, Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = novel.title.toLowerCase().includes(query);
        const matchesAuthor = novel.author.toLowerCase().includes(query);
        const matchesDesc = novel.description.toLowerCase().includes(query);
        const matchesGenreTag = novel.genre.toLowerCase().includes(query);
        
        return matchesTitle || matchesAuthor || matchesDesc || matchesGenreTag;
      }

      return true;
    });
  }, [activeView, favorites, searchQuery, selectedGenre]);

  const genres: (Genre | 'All')[] = ['All', 'Social', 'Romance', 'Mystery', 'Classic', 'Action'];

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {/* Hero Section - Hidden if searching or not on home */}
      {activeView === 'home' && !searchQuery && (
        <div className="mb-12 relative h-96 rounded-3xl overflow-hidden shadow-2xl bg-[#1a3a3a]">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a3a] to-transparent p-12 flex flex-col justify-center text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Must Read</span>
            </div>
            <h2 className="font-urdu text-5xl font-bold mb-4 drop-shadow-md">نمل (Namal)</h2>
            <p className="max-w-md text-lg text-white/80 mb-8 font-medium">
              Explore Nimra Ahmed's masterpiece of justice, revenge, and mystery. Now with interactive AI summaries.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleNovelClick(NOVELS.find(n => n.id === 'n2')!)}
                className="px-8 py-3 bg-[#d4af37] text-[#1a3a3a] font-bold rounded-xl hover:bg-[#c29d2e] transition-all shadow-lg"
              >
                Read Now
              </button>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                Add to Shelf
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Feedback for Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : activeView === 'favorites' ? 'My Library' : 'Explore Library'}
            </h2>
            <p className="text-sm text-gray-500">
              {filteredNovels.length} novels found
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button 
                key={genre} 
                onClick={() => setSelectedGenre(genre)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all border ${
                  selectedGenre === genre 
                    ? 'bg-[#1a3a3a] text-white border-[#1a3a3a]' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#1a3a3a]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredNovels.length > 0 ? (
          filteredNovels.map(novel => (
            <NovelCard 
              key={novel.id} 
              novel={novel} 
              onClick={handleNovelClick} 
            />
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
            <XCircle className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No matching novels found</h3>
            <p className="text-gray-400 max-w-sm">
              We couldn't find anything matching your criteria. Try adjusting your search or filters.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
              className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all text-sm font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Reader Overlay */}
      {selectedNovel && (
        <Reader 
          novel={selectedNovel} 
          onClose={() => setSelectedNovel(null)} 
        />
      )}

      {/* Footer Decoration */}
      <footer className="mt-20 py-12 border-t border-gray-200 text-center">
        <div className="flex justify-center gap-8 mb-6">
           <div className="text-center">
             <p className="font-bold text-[#1a3a3a] text-xl">100+</p>
             <p className="text-xs text-gray-400 uppercase tracking-tighter">Classic Novels</p>
           </div>
           <div className="text-center">
             <p className="font-bold text-[#1a3a3a] text-xl">AI-Ready</p>
             <p className="text-xs text-gray-400 uppercase tracking-tighter">Literary Engine</p>
           </div>
           <div className="text-center">
             <p className="font-bold text-[#1a3a3a] text-xl">24/7</p>
             <p className="text-xs text-gray-400 uppercase tracking-tighter">Reading Lounge</p>
           </div>
        </div>
        <p className="font-urdu text-2xl text-gray-300 mb-2">اردو ہے جس کا نام ہمیں جانتے ہیں داغ</p>
        <p className="text-sm text-gray-400">© 2024 Dastan-e-Urdu. Digital Library of Pakistan.</p>
      </footer>
    </Layout>
  );
};

export default App;
