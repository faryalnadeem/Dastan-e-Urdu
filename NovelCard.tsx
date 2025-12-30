
import React from 'react';
import { Novel } from '../types';
import { Star, BookOpen } from 'lucide-react';

interface NovelCardProps {
  novel: Novel;
  onClick: (novel: Novel) => void;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, onClick }) => {
  return (
    <div 
      onClick={() => onClick(novel)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={novel.coverImage} 
          alt={novel.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full py-2 bg-[#d4af37] text-[#1a3a3a] font-bold rounded-lg flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Read Now
          </button>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {novel.rating}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37]">{novel.genre}</span>
          <span className="text-[10px] text-gray-400">{novel.publishedDate}</span>
        </div>
        <h3 className="font-urdu text-xl font-bold text-right mb-1 text-[#1a3a3a] line-clamp-1">{novel.title}</h3>
        <p className="font-urdu text-sm text-right text-gray-500 mb-3 line-clamp-1">{novel.author}</p>
        <p className="text-xs text-gray-600 line-clamp-2 mt-auto">{novel.description}</p>
      </div>
    </div>
  );
};

export default NovelCard;
