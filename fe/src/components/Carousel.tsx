import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, MessageSquare, Star } from 'lucide-react';
import { Manga } from '../types';

interface CarouselProps {
  mangas: Manga[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
}

export default function Carousel({ mangas, onNavigate }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hotMangas = mangas.filter(m => m.isHot);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (hotMangas.length === 0) return null;

  return (
    <div className="relative mb-8 group" id="featured-carousel">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-orange-500 uppercase flex items-center space-x-2">
          <Star className="h-5 w-5 fill-current animate-pulse text-yellow-500" />
          <span>Truyện đề cử hot nhất</span>
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:bg-orange-500 hover:text-neutral-950 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:bg-orange-500 hover:text-neutral-950 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scroller Container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hotMangas.map((manga) => {
          const lastChapter = manga.chapters[0];
          return (
            <div
              key={manga.id}
              className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] max-w-[240px] snap-start flex-shrink-0 group/card relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-lg cursor-pointer transition-all hover:-translate-y-1 hover:border-orange-500/50"
              onClick={() => onNavigate('detail', manga.id)}
            >
              {/* Image with Dark Gradient Overlay */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={manga.coverUrl}
                  alt={manga.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Badge HOT */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider animate-bounce">
                  Hot
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold space-x-0.5">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{manga.rating}</span>
                </div>

                {/* Info Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-sm font-extrabold text-white line-clamp-1 group-hover/card:text-orange-400 transition-colors">
                    {manga.title}
                  </h3>
                  
                  {/* Latest chapter & updated time */}
                  {lastChapter && (
                    <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-300">
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('reader', manga.id, lastChapter.id);
                        }}
                        className="font-bold text-orange-400 hover:underline hover:text-orange-300"
                      >
                        {lastChapter.title.split(':')[0]}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-medium">NEW</span>
                    </div>
                  )}

                  {/* Stats line */}
                  <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-neutral-400">
                    <span className="flex items-center space-x-0.5">
                      <Eye className="h-3 w-3" />
                      <span>{manga.viewCount > 1000000 ? `${(manga.viewCount / 1000000).toFixed(1)}M` : manga.viewCount}</span>
                    </span>
                    <span className="flex items-center space-x-0.5">
                      <MessageSquare className="h-3 w-3" />
                      <span>{manga.commentCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
