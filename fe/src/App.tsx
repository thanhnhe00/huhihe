import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import MangaDetailView from './views/MangaDetailView';
import ReaderView from './views/ReaderView';
import FollowingView from './views/FollowingView';
import HistoryView from './views/HistoryView';
import ManagementView from './views/ManagementView';
import { ReadingHistoryItem, Manga, Genre } from './types';
import api from './utils/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'reader' | 'following' | 'history' | 'management'>('home');
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true); // NetTruyen defaults to dark mode
  
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<ReadingHistoryItem[]>([]);
  
  // Real or fallback logged-in user credentials
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const userEmail = username ? `${username}@gmail.com` : "caohuongquynh2k6@gmail.com";

  // Dynamic mangas and categories loaded from backend
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [categories, setCategories] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load real backend data
  const fetchBackendData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await api.get('/categories');
      const catList: Genre[] = catRes.data.map((c: any) => ({
        id: c.name,
        name: c.name,
        description: `Thể loại ${c.name}`
      }));
      setCategories(catList);

      // 2. Fetch stories (up to 100 for proper catalog indexing)
      const storiesRes = await api.get('/stories?size=100');
      const storyCards = storiesRes.data.content || [];

      // 3. Concurrently fetch details and chapters for each story
      const fullMangas = await Promise.all(
        storyCards.map(async (card: any) => {
          try {
            const detailRes = await api.get(`/stories/${card.storyId}`);
            const story = detailRes.data;
            const chapRes = await api.get(`/stories/${card.storyId}/chapters`);

            const chapters = chapRes.data.map((ch: any) => ({
              id: ch.chapterId.toString(),
              mangaId: story.slug || story.storyId.toString(),
              title: ch.title || `Chapter ${ch.chapterNumber}`,
              updatedAt: ch.createdAt || new Date().toISOString(),
              pages: ch.imageUrls || [],
              viewCount: 0
            }));

            return {
              id: story.slug || story.storyId.toString(),
              title: story.title,
              otherTitle: story.title,
              author: story.author || 'Khuyết Danh',
              status: story.status === 'COMPLETED' || story.status === 'Hoàn thành' ? 'Hoàn thành' : 'Đang tiến hành',
              description: story.description || '',
              coverUrl: story.coverImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
              bannerUrl: story.coverImage || '',
              genres: story.categories ? story.categories.map((c: any) => c.name) : [],
              viewCount: story.viewCount || 0,
              commentCount: 0,
              followerCount: story.followCount || 0,
              rating: story.averageRating || 4.5,
              chapters: chapters,
              isHot: story.averageRating && story.averageRating >= 4.7
            };
          } catch (e) {
            console.error('Error fetching details for storyId', card.storyId, e);
            return null;
          }
        })
      );

      setMangas(fullMangas.filter(Boolean) as Manga[]);
    } catch (err) {
      console.error('Failed to fetch initial stories/categories', err);
    } finally {
      setLoading(false);
    }
  };

  // Validate token with /auth/me on app mount and then load initial stories/categories
  useEffect(() => {
    const validateTokenAndLoad = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileRes = await api.get('/auth/me');
          setUsername(profileRes.data.username);
          setRole(profileRes.data.role);
          localStorage.setItem('username', profileRes.data.username);
          localStorage.setItem('role', profileRes.data.role);
        } catch (e) {
          console.error('Session expired or invalid token. Logging out...', e);
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          setUsername(null);
          setRole(null);
        }
      }
      fetchBackendData();
    };

    validateTokenAndLoad();
  }, []);

  const handleAuthChange = () => {
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
    fetchBackendData();
  };

  // Load state from localStorage on init
  useEffect(() => {
    const savedFollows = localStorage.getItem('followed_mangas');
    if (savedFollows) {
      try {
        setFollowedIds(JSON.parse(savedFollows));
      } catch (e) {
        console.error('Failed to parse followed_mangas', e);
      }
    }

    const savedHistory = localStorage.getItem('reading_history');
    if (savedHistory) {
      try {
        setHistoryItems(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse reading_history', e);
      }
    }

    const savedTheme = localStorage.getItem('theme_dark');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Update theme class in body element
  useEffect(() => {
    localStorage.setItem('theme_dark', darkMode.toString());
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#e5e5e5';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f5f5f7';
      document.body.style.color = '#1c1c1e';
    }
  }, [darkMode]);

  // Navigate utility
  const handleNavigate = (
    view: 'home' | 'detail' | 'reader' | 'following' | 'history',
    mangaId?: string,
    chapterId?: string
  ) => {
    setCurrentView(view);
    if (mangaId) setSelectedMangaId(mangaId);
    if (chapterId) setSelectedChapterId(chapterId);
    
    // Auto-scroll to top when moving between screens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Followed list
  const handleToggleFollow = (mangaId: string) => {
    let updated: string[];
    if (followedIds.includes(mangaId)) {
      updated = followedIds.filter(id => id !== mangaId);
    } else {
      updated = [...followedIds, mangaId];
    }
    setFollowedIds(updated);
    localStorage.setItem('followed_mangas', JSON.stringify(updated));
  };

  // Add Item to Reading History list
  const handleAddToHistory = (
    mangaId: string,
    chapterId: string,
    chapterTitle: string,
    mangaTitle: string,
    coverUrl: string
  ) => {
    // Filter out existing history entry for the SAME manga to avoid duplicate listings
    const cleanHistory = historyItems.filter(item => item.mangaId !== mangaId);
    
    const newItem: ReadingHistoryItem = {
      mangaId,
      chapterId,
      chapterTitle,
      mangaTitle,
      coverUrl,
      readAt: new Date().toISOString()
    };

    const updated = [newItem, ...cleanHistory];
    setHistoryItems(updated);
    localStorage.setItem('reading_history', JSON.stringify(updated));
  };

  // Clear specific or total reading histories
  const handleClearHistory = (mangaId?: string) => {
    let updated: ReadingHistoryItem[];
    if (mangaId) {
      updated = historyItems.filter(item => item.mangaId !== mangaId);
    } else {
      updated = [];
    }
    setHistoryItems(updated);
    localStorage.setItem('reading_history', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      darkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-[#f5f5f7] text-[#1c1c1e]'
    }`} id="nettruyen-app">
      
      {/* Shared Header component */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearch={setSearchQuery}
        onGenreSelect={setSelectedGenre}
        selectedGenre={selectedGenre}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        followedCount={followedIds.length}
        onAuthChange={handleAuthChange}
      />

      {/* Main active layout routing viewport */}
      <main className="flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider">Đang tải dữ liệu thực tế từ máy chủ...</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                mangas={mangas}
                onNavigate={handleNavigate}
                searchQuery={searchQuery}
                selectedGenre={selectedGenre}
                onGenreSelect={setSelectedGenre}
                genresList={categories}
              />
            )}

            {currentView === 'detail' && selectedMangaId && (
              <MangaDetailView
                mangaId={selectedMangaId}
                mangas={mangas}
                onNavigate={handleNavigate}
                onGenreSelect={setSelectedGenre}
                userEmail={userEmail}
                isFollowed={followedIds.includes(selectedMangaId)}
                onToggleFollow={handleToggleFollow}
              />
            )}

            {currentView === 'reader' && selectedMangaId && selectedChapterId && (
              <ReaderView
                mangaId={selectedMangaId}
                chapterId={selectedChapterId}
                mangas={mangas}
                onNavigate={handleNavigate}
                userEmail={userEmail}
                isFollowed={followedIds.includes(selectedMangaId)}
                onToggleFollow={handleToggleFollow}
                onAddToHistory={handleAddToHistory}
              />
            )}

            {currentView === 'following' && (
              <FollowingView
                mangas={mangas}
                followedIds={followedIds}
                onNavigate={handleNavigate}
                onToggleFollow={handleToggleFollow}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                historyItems={historyItems}
                onNavigate={handleNavigate}
                onClearHistory={handleClearHistory}
              />
            )}

            {currentView === 'management' && (
              <ManagementView
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Render footer on all pages except the chapter reader to guarantee zero distractions while reading */}
      {currentView !== 'reader' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
