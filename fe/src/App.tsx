import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import MangaDetailView from './views/MangaDetailView';
import ReaderView from './views/ReaderView';
import FollowingView from './views/FollowingView';
import HistoryView from './views/HistoryView';
import { MOCK_MANGAS } from './data/mangas';
import { ReadingHistoryItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'reader' | 'following' | 'history'>('home');
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true); // NetTruyen defaults to dark mode
  
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<ReadingHistoryItem[]>([]);
  
  // Personalised user email for logging comments
  const userEmail = "caohuongquynh2k6@gmail.com";

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
      />

      {/* Main active layout routing viewport */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <HomeView
            mangas={MOCK_MANGAS}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
          />
        )}

        {currentView === 'detail' && selectedMangaId && (
          <MangaDetailView
            mangaId={selectedMangaId}
            mangas={MOCK_MANGAS}
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
            mangas={MOCK_MANGAS}
            onNavigate={handleNavigate}
            userEmail={userEmail}
            isFollowed={followedIds.includes(selectedMangaId)}
            onToggleFollow={handleToggleFollow}
            onAddToHistory={handleAddToHistory}
          />
        )}

        {currentView === 'following' && (
          <FollowingView
            mangas={MOCK_MANGAS}
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
      </main>

      {/* Render footer on all pages except the chapter reader to guarantee zero distractions while reading */}
      {currentView !== 'reader' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
