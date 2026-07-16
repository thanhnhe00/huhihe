import React, { useState, useEffect } from 'react';
import { 
  Home, Heart, Eye, BookOpen, User, Folder, Play, ChevronRight, 
  Star, MessageSquare, Calendar, ArrowUpDown, Search, Info 
} from 'lucide-react';
import { Manga, Chapter } from '../types';
import CommentSection from '../components/CommentSection';
import { motion } from 'motion/react';

interface MangaDetailViewProps {
  mangaId: string;
  mangas: Manga[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
  onGenreSelect: (genre: string | null) => void;
  userEmail?: string;
  isFollowed: boolean;
  onToggleFollow: (mangaId: string) => void;
}

export default function MangaDetailView({
  mangaId,
  mangas,
  onNavigate,
  onGenreSelect,
  userEmail,
  isFollowed,
  onToggleFollow
}: MangaDetailViewProps) {
  const manga = mangas.find(m => m.id === mangaId);
  const [chapterQuery, setChapterQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false); // Default descending (newest chapter first)
  const [userRating, setUserRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(4.8);
  const [ratingCount, setRatingCount] = useState(1420);

  // Load rating count and average
  useEffect(() => {
    if (manga) {
      setCurrentRating(manga.rating);
      // Retrieve customized local ratings if any
      const localRate = localStorage.getItem(`rating_${manga.id}`);
      if (localRate) {
        setUserRating(parseInt(localRate));
      }
    }
    // Scroll to top
    window.scrollTo({ top: 0 });
  }, [mangaId]);

  if (!manga) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-neutral-400">
        <p className="text-base font-bold">Không tìm thấy thông tin truyện tranh này.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-4 bg-orange-500 text-neutral-950 px-4 py-2 rounded text-xs font-bold"
        >
          Trở lại Trang Chủ
        </button>
      </div>
    );
  }

  // Handle rating star click
  const handleRate = (star: number) => {
    setUserRating(star);
    localStorage.setItem(`rating_${manga.id}`, star.toString());
    
    // Average updates slightly to reflect contribution
    const newRating = ((currentRating * ratingCount + star) / (ratingCount + 1)).toFixed(1);
    setCurrentRating(parseFloat(newRating));
    setRatingCount(prev => prev + 1);
  };

  // Chapter sorting and filtering
  const getFilteredChapters = () => {
    let list = [...manga.chapters];
    
    // Search chapter number
    if (chapterQuery.trim()) {
      list = list.filter(c => c.title.toLowerCase().includes(chapterQuery.toLowerCase()));
    }

    // Sort order (default false = descending)
    if (sortAsc) {
      list.sort((a, b) => {
        const numA = parseFloat(a.title.match(/\d+/)?.join('') || '0');
        const numB = parseFloat(b.title.match(/\d+/)?.join('') || '0');
        return numA - numB;
      });
    } else {
      list.sort((a, b) => {
        const numA = parseFloat(a.title.match(/\d+/)?.join('') || '0');
        const numB = parseFloat(b.title.match(/\d+/)?.join('') || '0');
        return numB - numA;
      });
    }

    return list;
  };

  const filteredChapters = getFilteredChapters();
  const sortedChaptersAscending = [...manga.chapters].sort((a, b) => {
    const numA = parseFloat(a.title.match(/\d+/)?.join('') || '0');
    const numB = parseFloat(b.title.match(/\d+/)?.join('') || '0');
    return numA - numB;
  });

  const firstChapter = sortedChaptersAscending[0];
  const newestChapter = sortedChaptersAscending[sortedChaptersAscending.length - 1];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6" id="manga-detail-container">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-1 text-xs text-neutral-400 mb-6 bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800">
        <span 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer transition"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Trang Chủ</span>
        </span>
        <ChevronRight className="h-3 w-3" />
        <span className="hover:text-orange-500 cursor-pointer transition" onClick={() => { onNavigate('home'); onGenreSelect(manga.genres[0]); }}>
          {manga.genres[0]}
        </span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-orange-400 font-bold truncate max-w-[200px] sm:max-w-xs">{manga.title}</span>
      </div>

      {/* Main Details Wrapper */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Left Column: Cover art */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-neutral-800 shadow-xl">
              <img
                src={manga.coverUrl}
                alt={manga.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick stats / buttons directly under cover */}
            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={() => onToggleFollow(manga.id)}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-md ${
                  isFollowed
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-orange-500 hover:bg-orange-400 text-neutral-950'
                }`}
                id="toggle-follow-btn"
              >
                <Heart className={`h-4 w-4 ${isFollowed ? 'fill-current' : ''}`} />
                <span>{isFollowed ? 'Đã Theo Dõi (Bỏ thích)' : 'Theo Dõi Truyện'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: details and metadata */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight" id="manga-title">
                {manga.title}
              </h1>
              
              {manga.otherTitle && (
                <h2 className="text-xs text-neutral-400 font-bold mt-1 uppercase tracking-wide">
                  Tên khác: <span className="text-neutral-300 italic">{manga.otherTitle}</span>
                </h2>
              )}

              {/* Grid properties list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 border-y border-neutral-800 py-4 mt-4 text-xs">
                
                {/* Author */}
                <div className="flex items-center space-x-3.5 text-neutral-300">
                  <User className="h-4.5 w-4.5 text-orange-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-500 block">Tác giả</span>
                    <span className="font-bold text-neutral-200">{manga.author}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3.5 text-neutral-300">
                  <Info className="h-4.5 w-4.5 text-orange-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-500 block">Tình trạng</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      manga.status === 'Hoàn thành' ? 'bg-green-600/20 text-green-400 border border-green-500/20' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    }`}>
                      {manga.status}
                    </span>
                  </div>
                </div>

                {/* Views */}
                <div className="flex items-center space-x-3.5 text-neutral-300">
                  <Eye className="h-4.5 w-4.5 text-orange-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-500 block">Lượt xem</span>
                    <span className="font-bold text-neutral-200">{manga.viewCount.toLocaleString()} lượt</span>
                  </div>
                </div>

                {/* Followers */}
                <div className="flex items-center space-x-3.5 text-neutral-300">
                  <Heart className="h-4.5 w-4.5 text-orange-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-500 block">Lượt theo dõi</span>
                    <span className="font-bold text-neutral-200">{manga.followerCount.toLocaleString()} người</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="sm:col-span-2 flex items-start space-x-3.5 text-neutral-300">
                  <Folder className="h-4.5 w-4.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block mb-1">Thể loại</span>
                    <div className="flex flex-wrap gap-1.5">
                      {manga.genres.map((g, idx) => (
                        <button
                          key={idx}
                          onClick={() => { onNavigate('home'); onGenreSelect(g); }}
                          className="bg-neutral-800 hover:bg-orange-500/15 border border-neutral-700/60 hover:border-orange-500/40 text-neutral-300 hover:text-orange-400 px-2.5 py-1 rounded text-[11px] font-bold transition"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="bg-neutral-950/40 border border-neutral-800/60 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-lg font-black">
                    {currentRating}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-200">Đánh giá trung bình</p>
                    <p className="text-[10px] text-neutral-500">Xếp hạng dựa trên {ratingCount} lượt bình chọn</p>
                  </div>
                </div>

                {/* Rating Stars clickable */}
                <div className="flex flex-col items-center sm:items-end">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => handleRate(star)}
                        className={`h-5 w-5 cursor-pointer transition ${
                          star <= (userRating || Math.round(currentRating))
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-neutral-700 hover:text-yellow-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1">
                    {userRating ? `Bạn đã đánh giá ${userRating} sao` : 'Bấm vào sao để bình chọn'}
                  </span>
                </div>
              </div>
            </div>

            {/* Read Buttons panel */}
            <div className="flex flex-wrap gap-3 pt-2">
              {firstChapter && (
                <button
                  onClick={() => onNavigate('reader', manga.id, firstChapter.id)}
                  className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 py-2.5 rounded-lg text-xs font-black shadow-lg transition cursor-pointer"
                  id="read-first-chapter"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Đọc từ đầu</span>
                </button>
              )}
              {newestChapter && (
                <button
                  onClick={() => onNavigate('reader', manga.id, newestChapter.id)}
                  className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2.5 rounded-lg text-xs font-bold border border-neutral-700 transition cursor-pointer"
                  id="read-last-chapter"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Đọc mới nhất</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comic Summary Description section */}
        <div className="border-t border-neutral-800 mt-6 pt-5">
          <h3 className="text-sm font-black text-orange-500 uppercase flex items-center space-x-2 mb-3 tracking-wider">
            <Info className="h-4 w-4 text-orange-500" />
            <span>Nội Dung / Tóm Tắt</span>
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-5xl whitespace-pre-line bg-neutral-950/20 p-3 rounded border border-neutral-800/40">
            {manga.description}
          </p>
        </div>
      </div>

      {/* Chapter List Area */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 mt-8 shadow-md">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-orange-500" />
            <span>Danh Sách Chương ({manga.chapters.length})</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search chapter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm số chương..."
                value={chapterQuery}
                onChange={(e) => setChapterQuery(e.target.value)}
                className="bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg text-xs pl-8 pr-3 h-8 focus:outline-none focus:border-orange-500 transition w-36 sm:w-44"
                id="search-chapters"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
            </div>

            {/* Sort direction toggler */}
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center space-x-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg text-xs px-2.5 h-8 transition cursor-pointer font-bold"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortAsc ? 'Cũ nhất trước' : 'Mới nhất trước'}</span>
            </button>
          </div>
        </div>

        {/* Chapters table body */}
        <div className="mt-4 max-h-96 overflow-y-auto pr-1 text-xs divide-y divide-neutral-800/60" id="chapters-list">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Không tìm thấy chương tương ứng với tìm kiếm của bạn.
            </div>
          ) : (
            filteredChapters.map((chapter) => (
              <div 
                key={chapter.id}
                onClick={() => onNavigate('reader', manga.id, chapter.id)}
                className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-neutral-800/40 cursor-pointer transition-colors group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <span className="font-extrabold text-neutral-200 group-hover:text-orange-400 transition-colors">
                    {chapter.title}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-[11px] text-neutral-500">
                  <span className="hidden sm:flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(chapter.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </span>
                  
                  <span className="flex items-center space-x-1 text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    <Eye className="h-3 w-3 text-neutral-500" />
                    <span>{chapter.viewCount.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comments section for current Manga */}
      <CommentSection mangaId={manga.id} userEmail={userEmail} />
    </div>
  );
}
