import React from 'react';
import { Heart, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { Manga } from '../types';
import { motion } from 'motion/react';

interface FollowingViewProps {
  mangas: Manga[];
  followedIds: string[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
  onToggleFollow: (mangaId: string) => void;
}

export default function FollowingView({
  mangas,
  followedIds,
  onNavigate,
  onToggleFollow
}: FollowingViewProps) {
  const followedMangas = mangas.filter(m => followedIds.includes(m.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6" id="following-view-container">
      {/* Page Title header */}
      <div className="flex items-center space-x-2.5 pb-4 border-b border-neutral-800 mb-6">
        <Heart className="h-6 w-6 text-red-500 fill-current animate-pulse" />
        <h1 className="text-xl font-black text-white uppercase tracking-wide">
          Truyện đang theo dõi ({followedMangas.length})
        </h1>
      </div>

      {followedMangas.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-orange-500 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-200">Bạn chưa theo dõi bộ truyện nào.</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Nhấn vào nút "Theo dõi truyện" ở trang chi tiết của bộ truyện bất kỳ để lưu chúng tại đây và dễ dàng đón nhận các chương mới nhất!
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-orange-500 hover:bg-orange-400 text-neutral-950 font-black px-5 py-2.5 rounded-lg text-xs transition cursor-pointer"
          >
            Khám phá truyện mới ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" id="following-grid">
          {followedMangas.map((manga, idx) => {
            const lastChapter = manga.chapters[0];
            return (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="bg-neutral-900 border border-neutral-800/80 rounded-lg overflow-hidden flex flex-col group relative hover:border-orange-500/40 shadow transition"
              >
                {/* Cover art image container */}
                <div 
                  onClick={() => onNavigate('detail', manga.id)}
                  className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {manga.status === 'Hoàn thành' && (
                      <span className="bg-green-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md uppercase">
                        Full
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onNavigate('detail', manga.id)}
                      className="text-xs font-bold text-neutral-200 hover:text-orange-400 transition cursor-pointer line-clamp-1"
                    >
                      {manga.title}
                    </h3>
                    
                    {lastChapter && (
                      <span 
                        onClick={() => onNavigate('reader', manga.id, lastChapter.id)}
                        className="text-[11px] text-orange-400 font-extrabold block mt-1 hover:underline cursor-pointer"
                      >
                        {lastChapter.title.split(':')[0]}
                      </span>
                    )}
                  </div>

                  {/* Quick remove action button */}
                  <div className="mt-3.5 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500">
                    <button
                      onClick={() => onNavigate('detail', manga.id)}
                      className="flex items-center space-x-1 hover:text-orange-400 transition"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Xem</span>
                    </button>

                    <button
                      onClick={() => onToggleFollow(manga.id)}
                      className="flex items-center space-x-1 text-red-500/80 hover:text-red-500 transition cursor-pointer"
                      title="Bỏ theo dõi"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
