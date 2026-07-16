import React, { useState } from 'react';
import { Eye, Trophy, Star } from 'lucide-react';
import { Manga } from '../types';

interface SidebarProps {
  mangas: Manga[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
}

type TabType = 'week' | 'month' | 'all';

export default function Sidebar({ mangas, onNavigate }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // We sort mangas based on different metrics to simulate top week/month/all
  const getRankedMangas = () => {
    const list = [...mangas];
    if (activeTab === 'week') {
      // Sort primarily by rating then views
      return list.sort((a, b) => b.rating - a.rating || b.viewCount - a.viewCount);
    } else if (activeTab === 'month') {
      // Sort by comment count
      return list.sort((a, b) => b.commentCount - a.commentCount || b.viewCount - a.viewCount);
    } else {
      // Sort by viewCount
      return list.sort((a, b) => b.viewCount - a.viewCount);
    }
  };

  const ranked = getRankedMangas().slice(0, 7);

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-md" id="top-rankings-sidebar">
      {/* Title */}
      <h3 className="text-sm font-black text-orange-500 uppercase flex items-center space-x-2 mb-4 tracking-wider pb-2 border-b border-neutral-800">
        <Trophy className="h-4 w-4 text-yellow-500" />
        <span>Bảng Xếp Hạng</span>
      </h3>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 mb-4 text-xs font-semibold">
        {(['all', 'month', 'week'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 border-b-2 transition ${
              activeTab === tab
                ? 'border-orange-500 text-orange-500 font-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab === 'all' ? 'Top All' : tab === 'month' ? 'Top Tháng' : 'Top Tuần'}
          </button>
        ))}
      </div>

      {/* Ranked List */}
      <div className="space-y-4">
        {ranked.map((manga, index) => {
          const isTop3 = index < 3;
          const rankColor = index === 0 
            ? 'bg-yellow-500 text-neutral-950 font-black' 
            : index === 1 
            ? 'bg-neutral-300 text-neutral-950 font-black' 
            : index === 2 
            ? 'bg-amber-600 text-white font-black' 
            : 'bg-neutral-800 text-neutral-400';

          return (
            <div
              key={manga.id}
              onClick={() => onNavigate('detail', manga.id)}
              className="flex items-center space-x-3 group cursor-pointer hover:bg-neutral-800/40 p-1.5 rounded transition"
            >
              {/* Rank Badge */}
              <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${rankColor} flex-shrink-0 shadow`}>
                {index + 1}
              </div>

              {/* Cover Art */}
              <img
                src={manga.coverUrl}
                alt={manga.title}
                className="w-10 h-14 object-cover rounded shadow flex-shrink-0"
                referrerPolicy="no-referrer"
              />

              {/* Manga Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-200 group-hover:text-orange-400 transition-colors line-clamp-1">
                  {manga.title}
                </h4>
                
                <p className="text-[10px] text-orange-400 font-bold mt-0.5">
                  {manga.chapters[0]?.title.split(':')[0] || 'Chương mới nhất'}
                </p>

                {/* Views count */}
                <div className="flex items-center space-x-1 mt-1 text-[9px] text-neutral-500">
                  <Eye className="h-3 w-3" />
                  <span>
                    {manga.viewCount > 1000000 
                      ? `${(manga.viewCount / 1000000).toFixed(1)}M` 
                      : manga.viewCount.toLocaleString()} lượt xem
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
