import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, ChevronLeft, ChevronRight, Eye, Heart, List, ArrowUp, 
  Settings, MessageSquare, AlertTriangle, BookOpen, RefreshCw 
} from 'lucide-react';
import { Manga, Chapter } from '../types';
import CommentSection from '../components/CommentSection';
import { motion } from 'motion/react';
import api from '../utils/api';

interface ReaderViewProps {
  mangaId: string;
  chapterId: string;
  mangas: Manga[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history' | 'management', mangaId?: string, chapterId?: string) => void;
  userEmail?: string;
  isFollowed: boolean;
  onToggleFollow: (mangaId: string) => void;
  onAddToHistory: (mangaId: string, chapterId: string, chapterTitle: string, mangaTitle: string, coverUrl: string) => void;
}

export default function ReaderView({
  mangaId,
  chapterId,
  mangas,
  onNavigate,
  userEmail,
  isFollowed,
  onToggleFollow,
  onAddToHistory
}: ReaderViewProps) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const [dbStoryId, setDbStoryId] = useState<number | null>(null);
  const [dbChapterId, setDbChapterId] = useState<number | null>(null);
  const [localIsFollowed, setLocalIsFollowed] = useState(isFollowed);

  const [imageLoadedCount, setImageLoadedCount] = useState(0);
  const [showTopBar, setShowTopBar] = useState(true);
  const [readingMode, setReadingMode] = useState<'scroll' | 'page'>('scroll');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Dynamic API fetching of chapter and story sibling list
  useEffect(() => {
    const fetchReaderData = async () => {
      setLoading(true);
      try {
        // 1. Resolve Story Details
        let storyData: any;
        const isNumeric = /^\d+$/.test(mangaId);
        if (isNumeric) {
          const res = await api.get(`/stories/${mangaId}`);
          storyData = res.data;
        } else {
          const res = await api.get(`/stories/slug/${mangaId}`);
          storyData = res.data;
        }
        setDbStoryId(storyData.storyId);

        // 2. Fetch Chapters
        const chapRes = await api.get(`/stories/${storyData.storyId}/chapters`);
        const mappedChapters = chapRes.data.map((ch: any) => ({
          id: ch.chapterId.toString(),
          mangaId: storyData.slug || storyData.storyId.toString(),
          title: ch.title || `Chapter ${ch.chapterNumber}`,
          updatedAt: ch.createdAt || new Date().toISOString(),
          pages: ch.imageUrls || [],
          viewCount: 0
        }));

        const mappedManga: Manga = {
          id: storyData.slug || storyData.storyId.toString(),
          title: storyData.title,
          otherTitle: storyData.title,
          author: storyData.author || 'Khuyết Danh',
          status: storyData.status === 'COMPLETED' || storyData.status === 'Hoàn thành' ? 'Hoàn thành' : 'Đang tiến hành',
          description: storyData.description || '',
          coverUrl: storyData.coverImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
          bannerUrl: storyData.coverImage || '',
          genres: storyData.categories ? storyData.categories.map((c: any) => c.name) : [],
          viewCount: storyData.viewCount || 0,
          commentCount: 0,
          followerCount: storyData.followCount || 0,
          rating: storyData.averageRating || 4.5,
          chapters: mappedChapters,
          isHot: storyData.averageRating && storyData.averageRating >= 4.7
        };

        setManga(mappedManga);

        // 3. Resolve Current Chapter Details
        const activeChId = parseInt(chapterId) || parseInt(mappedChapters[0]?.id || '0');
        setDbChapterId(activeChId);

        const activeChRes = await api.get(`/chapters/${activeChId}`);
        const activeChData = activeChRes.data;

        const mappedChapter: Chapter = {
          id: activeChData.chapterId.toString(),
          mangaId: storyData.slug || storyData.storyId.toString(),
          title: activeChData.title || `Chapter ${activeChData.chapterNumber}`,
          updatedAt: activeChData.createdAt || new Date().toISOString(),
          pages: activeChData.imageUrls || [],
          viewCount: 0
        };

        setChapter(mappedChapter);

        // 4. Log/Save history in database if logged in, fallback to local storage history
        if (localStorage.getItem('token')) {
          try {
            await api.post('/histories', {
              storyId: storyData.storyId,
              chapterId: activeChId,
              scrollPosition: 0,
              isPrompted: false
            });
          } catch (e) {
            console.error('Failed to log backend reading history', e);
          }
          try {
            const followStatusRes = await api.get(`/follows/${storyData.storyId}/status`);
            setLocalIsFollowed(followStatusRes.data);
          } catch (e) {
            console.error(e);
          }
        } else {
          setLocalIsFollowed(isFollowed);
        }

        // Always save locally as fallback
        onAddToHistory(
          mappedManga.id,
          mappedChapter.id,
          mappedChapter.title,
          mappedManga.title,
          mappedManga.coverUrl
        );

      } catch (err) {
        console.error('Failed to resolve reader view data', err);
        // Fallback to local props
        const fallbackManga = mangas.find(m => m.id === mangaId);
        if (fallbackManga) {
          setManga(fallbackManga);
          const fallbackCh = fallbackManga.chapters.find(c => c.id === chapterId);
          if (fallbackCh) {
            setChapter(fallbackCh);
          }
          setLocalIsFollowed(isFollowed);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReaderData();
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setImageLoadedCount(0);
    setCurrentPageIndex(0);
  }, [mangaId, chapterId, isFollowed]);

  // Handle scroll detection to toggle topbar for clean immersive mode
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 150) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-400 bg-neutral-950 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
        <p className="text-xs font-bold uppercase tracking-wider">Đang tải nội dung chương đọc...</p>
      </div>
    );
  }

  if (!manga || !chapter) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-neutral-400">
        <p className="text-sm font-semibold">Không thể tìm thấy chương đọc tương ứng.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-4 bg-orange-500 text-neutral-950 px-4 py-2 rounded text-xs font-bold"
        >
          Trở về Trang Chủ
        </button>
      </div>
    );
  }

  const currentChapterIndex = manga.chapters.findIndex(c => c.id === chapter.id);

  // NetTruyen chapters are listed newest-first inside our data structure.
  // Therefore:
  // - Previous Chapter (lower number) is the NEXT element in the array.
  // - Next Chapter (higher number) is the PREVIOUS element in the array.
  const hasPrevChapter = currentChapterIndex < manga.chapters.length - 1;
  const hasNextChapter = currentChapterIndex > 0;

  const handlePrevChapter = () => {
    if (hasPrevChapter) {
      const prevChapter = manga.chapters[currentChapterIndex + 1];
      onNavigate('reader', manga.id, prevChapter.id);
    }
  };

  const handleNextChapter = () => {
    if (hasNextChapter) {
      const nextChapter = manga.chapters[currentChapterIndex - 1];
      onNavigate('reader', manga.id, nextChapter.id);
    }
  };

  const handleToggleFollowClick = async () => {
    if (!manga || !dbStoryId) return;

    if (localStorage.getItem('token')) {
      try {
        if (localIsFollowed) {
          await api.delete(`/follows/${dbStoryId}`);
          setLocalIsFollowed(false);
        } else {
          await api.post('/follows', { storyId: dbStoryId });
          setLocalIsFollowed(true);
        }
      } catch (e) {
        console.error('Failed to toggle follow in reader view', e);
      }
    }
    onToggleFollow(manga.id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-16" id="manga-reader-container">
      
      {/* Top Header Controls (Dynamic Show/Hide) */}
      <div className={`fixed top-0 inset-x-0 bg-neutral-900 border-b border-neutral-800 z-40 transition-transform duration-300 shadow-md ${
        showTopBar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between text-xs font-bold">
          {/* Left shortcuts */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded bg-neutral-800 text-neutral-300 hover:text-white transition"
              title="Về trang chủ"
            >
              <Home className="h-4 w-4" />
            </button>
            <span className="text-neutral-600 hidden sm:inline">/</span>
            <button
              onClick={() => onNavigate('detail', manga.id)}
              className="text-neutral-300 hover:text-orange-400 truncate max-w-[120px] sm:max-w-[200px] transition"
              title="Xem thông tin chi tiết"
            >
              {manga.title}
            </button>
          </div>

          {/* Center Navigation controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handlePrevChapter}
              disabled={!hasPrevChapter}
              className="p-1.5 sm:p-2 rounded bg-neutral-800 text-neutral-300 hover:bg-orange-500 hover:text-neutral-950 disabled:opacity-40 transition cursor-pointer"
              title="Chương trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Chapter Selection Dropdown */}
            <select
              value={chapter.id}
              onChange={(e) => onNavigate('reader', manga.id, e.target.value)}
              className="bg-neutral-850 text-orange-400 border border-neutral-700 rounded px-2 py-1.5 h-8 focus:outline-none focus:border-orange-500 cursor-pointer font-extrabold max-w-[120px] sm:max-w-xs"
              id="reader-chapter-dropdown"
            >
              {manga.chapters.map((c) => (
                <option key={c.id} value={c.id} className="text-neutral-300 font-bold">
                  {c.title.split(':')[0]}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextChapter}
              disabled={!hasNextChapter}
              className="p-1.5 sm:p-2 rounded bg-neutral-800 text-neutral-300 hover:bg-orange-500 hover:text-neutral-950 disabled:opacity-40 transition cursor-pointer"
              title="Chương sau"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right quick save / settings */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleToggleFollowClick}
              className={`p-2 rounded ${localIsFollowed ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'bg-neutral-800 text-neutral-400 hover:text-orange-400'} transition cursor-pointer`}
              title={localIsFollowed ? 'Bỏ theo dõi' : 'Theo dõi truyện'}
            >
              <Heart className={`h-4 w-4 ${localIsFollowed ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Spacing for sticky topbar */}
      <div className="h-16"></div>

      {/* Immersive Reading Stage */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 text-center">
        {/* Breadcrumb banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-6 inline-block text-xs font-semibold">
          <span className="text-neutral-400">Bạn đang đọc </span>
          <span className="text-orange-400 font-black">{manga.title}</span>
          <span className="text-neutral-400"> - </span>
          <span className="text-white font-extrabold">{chapter.title}</span>
          <p className="text-[10px] text-neutral-500 mt-1 italic">
            (Nếu hình ảnh không tải được, vui lòng bấm nút làm mới trang hoặc chuyển chương)
          </p>
        </div>

        {/* Scrollable feed of high quality chapter pages */}
        <div className="space-y-3 flex flex-col items-center bg-neutral-950 p-1 sm:p-3 rounded-lg border border-neutral-900 shadow-2xl" id="reader-pages-list">
          {chapter.pages.map((pageUrl, idx) => (
            <div key={idx} className="relative w-full max-w-2xl bg-neutral-900/40 border border-neutral-900 rounded overflow-hidden min-h-[400px] flex items-center justify-center">
              
              {/* Overlay with subtle page indicator */}
              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-[10px] text-orange-400 font-bold px-2 py-0.5 rounded shadow z-10">
                Trang {idx + 1} / {chapter.pages.length}
              </div>

              {/* Real panel overlay with chapter text or watermarks to feel absolutely professional */}
              <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm text-[9px] text-neutral-400 px-2 py-0.5 rounded shadow z-10 border border-neutral-800/40">
                NetTruyen.com — {chapter.title.split(':')[0]}
              </div>

              {/* The Actual high quality cover visual */}
              <img
                src={pageUrl}
                alt={`${chapter.title} page ${idx + 1}`}
                onLoad={() => setImageLoadedCount(prev => prev + 1)}
                className="w-full h-auto object-contain transition-opacity duration-300"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Big Bottom Navigation bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('detail', manga.id)}
            className="flex items-center space-x-1.5 text-xs font-bold text-neutral-400 hover:text-orange-400 transition"
          >
            <List className="h-4 w-4" />
            <span>Danh sách chương</span>
          </button>

          {/* Navigation controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevChapter}
              disabled={!hasPrevChapter}
              className="px-4 py-2 bg-neutral-800 hover:bg-orange-500 hover:text-neutral-950 text-neutral-200 rounded text-xs font-bold disabled:opacity-40 transition cursor-pointer"
            >
              Chương trước
            </button>
            <button
              onClick={handleNextChapter}
              disabled={!hasNextChapter}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 rounded text-xs font-black transition cursor-pointer"
            >
              Chương sau
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-xs font-bold text-neutral-400 hover:text-orange-400 transition cursor-pointer"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Lên đầu trang</span>
          </button>
        </div>
      </div>

      {/* Chapter Comments Section */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 mt-8">
        <CommentSection mangaId={manga.id} chapterId={chapter.id} userEmail={userEmail} />
      </div>
    </div>
  );
}
