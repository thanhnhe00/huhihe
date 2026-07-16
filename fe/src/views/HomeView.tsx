import React, { useState } from 'react';
import { LayoutGrid, Filter, Calendar, Eye, MessageSquare, Heart, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Manga } from '../types';
import Carousel from '../components/Carousel';
import Sidebar from '../components/Sidebar';
import { GENRES } from '../data/mangas';
import { motion } from 'motion/react';

interface HomeViewProps {
  mangas: Manga[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
  searchQuery: string;
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}

type SortType = 'updated' | 'views' | 'new';
type StatusFilter = 'all' | 'ongoing' | 'completed';

export default function HomeView({
  mangas,
  onNavigate,
  searchQuery,
  selectedGenre,
  onGenreSelect
}: HomeViewProps) {
  const [sortBy, setSortBy] = useState<SortType>('updated');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter & Sort Logic
  const getFilteredMangas = () => {
    let result = [...mangas];

    // Search query
    if (searchQuery.trim().length > 0) {
      result = result.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.otherTitle && m.otherTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre selection (special value 'hot' is used to filter featured comics)
    if (selectedGenre) {
      if (selectedGenre === 'hot') {
        result = result.filter(m => m.isHot);
      } else {
        result = result.filter(m => m.genres.includes(selectedGenre));
      }
    }

    // Status filter
    if (statusFilter === 'ongoing') {
      result = result.filter(m => m.status === 'Đang tiến hành');
    } else if (statusFilter === 'completed') {
      result = result.filter(m => m.status === 'Hoàn thành');
    }

    // Sorting
    if (sortBy === 'views') {
      result.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === 'new') {
      // Just sort by alphabetical/id to simulate newly added
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // 'updated' - default, sorted by latest chapter update timestamp
      result.sort((a, b) => {
        const aTime = a.chapters[0] ? new Date(a.chapters[0].updatedAt).getTime() : 0;
        const bTime = b.chapters[0] ? new Date(b.chapters[0].updatedAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    return result;
  };

  const filtered = getFilteredMangas();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6" id="home-view-container">
      {/* Featured Carousel slider (Only show on Trang Chủ root without filtering genre/searching) */}
      {!selectedGenre && searchQuery.trim().length === 0 && (
        <Carousel mangas={mangas} onNavigate={onNavigate} />
      )}

      {/* Grid Layout: Main Feed left, rankings right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content (Columns: 3/4 on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Filtering and sorting toolbar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            
            {/* Left side: status / filters info */}
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <Filter className="h-4 w-4 text-orange-500" />
                <span>
                  {selectedGenre 
                    ? `Thể loại: ${selectedGenre === 'hot' ? 'Truyện Hot' : selectedGenre}` 
                    : searchQuery 
                    ? `Tìm kiếm: "${searchQuery}"` 
                    : 'Mới cập nhật'}
                </span>
                <span className="text-xs font-normal text-neutral-400">({filtered.length} truyện)</span>
              </h2>
            </div>

            {/* Right side: Sorting & Status selection */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Status Selector */}
              <div className="flex items-center space-x-1 bg-neutral-950 rounded border border-neutral-800 p-0.5">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded transition ${statusFilter === 'all' ? 'bg-orange-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setStatusFilter('ongoing')}
                  className={`px-2.5 py-1 rounded transition ${statusFilter === 'ongoing' ? 'bg-orange-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  Đang tiến hành
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-2.5 py-1 rounded transition ${statusFilter === 'completed' ? 'bg-orange-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  Hoàn thành
                </button>
              </div>

              {/* Sorters Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="bg-neutral-950 text-neutral-300 border border-neutral-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-orange-500 transition cursor-pointer"
              >
                <option value="updated">Mới cập nhật</option>
                <option value="views">Lượt xem nhiều</option>
                <option value="new">Tên truyện A-Z</option>
              </select>
            </div>
          </div>

          {/* Manga Grid List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">
              <p className="text-sm font-semibold mb-2">Không tìm thấy truyện tranh nào phù hợp.</p>
              <button 
                onClick={() => { onGenreSelect(null); setStatusFilter('all'); setSortBy('updated'); }}
                className="text-xs bg-orange-500 text-neutral-950 px-4 py-2 rounded font-bold hover:bg-orange-400 transition"
              >
                Xem tất cả truyện
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="manga-cards-grid">
              {filtered.map((manga, idx) => (
                <motion.div
                  key={manga.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.4) }}
                  className="bg-neutral-900 border border-neutral-800/80 rounded-lg overflow-hidden flex flex-col group relative hover:border-orange-500/40 shadow hover:shadow-orange-500/5 transition duration-200"
                >
                  {/* Thumbnail Cover container */}
                  <div 
                    onClick={() => onNavigate('detail', manga.id)}
                    className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={manga.coverUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick overlay details */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-2 flex items-center justify-between text-[10px] text-neutral-300">
                      <span className="flex items-center space-x-0.5 bg-neutral-950/60 px-1 py-0.2 rounded backdrop-blur-sm">
                        <Eye className="h-3 w-3 text-orange-400" />
                        <span>{manga.viewCount > 1000000 ? `${(manga.viewCount / 1000000).toFixed(1)}M` : manga.viewCount.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-0.5 bg-neutral-950/60 px-1 py-0.2 rounded backdrop-blur-sm">
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                        <span>{manga.followerCount > 1000 ? `${(manga.followerCount / 1000).toFixed(1)}k` : manga.followerCount}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {manga.isHot && (
                        <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow uppercase">
                          Hot
                        </span>
                      )}
                      {manga.status === 'Hoàn thành' && (
                        <span className="bg-green-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow uppercase">
                          Full
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => onNavigate('detail', manga.id)}
                        className="text-xs font-bold text-neutral-200 hover:text-orange-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
                        title={manga.title}
                      >
                        {manga.title}
                      </h3>
                    </div>

                    {/* Chapter List inside card */}
                    <div className="mt-2.5 space-y-1.5">
                      {manga.chapters.slice(0, 3).map((chapter, index) => (
                        <div key={chapter.id} className="flex items-center justify-between text-[11px]">
                          <span 
                            onClick={() => onNavigate('reader', manga.id, chapter.id)}
                            className="text-orange-400 hover:text-orange-300 hover:underline cursor-pointer font-semibold truncate max-w-[120px]"
                            title={chapter.title}
                          >
                            {chapter.title.split(':')[0].replace('Chapter ', 'Chap ')}
                          </span>
                          <span className="text-[10px] text-neutral-500 italic">
                            {index === 0 ? 'Mới' : 'Cũ'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Simple pagination footer design to keep the layout authentic to nettruyen */}
          {filtered.length > 0 && (
            <div className="flex justify-center items-center space-x-2 pt-6">
              <button className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-bold hover:bg-neutral-800">
                « Đầu
              </button>
              <button className="px-3 py-1.5 rounded bg-orange-500 text-neutral-950 text-xs font-black">
                1
              </button>
              <button className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-bold hover:bg-neutral-800">
                Cuối »
              </button>
            </div>
          )}
        </div>

        {/* Right Rankings list (Column: 1/4 on desktop, hide on mobile/tablet if needed, but sidebar is fully responsive) */}
        <div className="space-y-6">
          <Sidebar mangas={mangas} onNavigate={onNavigate} />
          
          {/* Secondary genre filter widget in sidebar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-md">
            <h3 className="text-sm font-black text-orange-500 uppercase flex items-center space-x-2 mb-3 pb-2 border-b border-neutral-800 tracking-wider">
              <LayoutGrid className="h-4 w-4" />
              <span>Thể loại truyện</span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-300">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { onNavigate('home'); onGenreSelect(g.name); }}
                  className={`p-1.5 text-left rounded hover:bg-neutral-800/80 hover:text-orange-400 transition-colors ${
                    selectedGenre === g.name ? 'text-orange-400 bg-orange-500/10 font-bold' : ''
                  }`}
                  title={g.description}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
