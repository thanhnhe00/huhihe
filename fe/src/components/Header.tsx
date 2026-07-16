import React, { useState, useEffect } from 'react';
import { Search, Menu, X, BookOpen, History, Heart, Sun, Moon, TrendingUp, ChevronDown } from 'lucide-react';
import { Manga } from '../types';
import { MOCK_MANGAS, GENRES } from '../data/mangas';

interface HeaderProps {
  currentView: 'home' | 'detail' | 'reader' | 'following' | 'history';
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string | null) => void;
  selectedGenre: string | null;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  followedCount: number;
}

export default function Header({
  currentView,
  onNavigate,
  onSearch,
  onGenreSelect,
  selectedGenre,
  darkMode,
  setDarkMode,
  followedCount
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);

  // Update live search results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = MOCK_MANGAS.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.otherTitle && m.otherTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
    onSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchResults(false);
    onNavigate('home');
  };

  const selectSearchResult = (mangaId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onNavigate('detail', mangaId);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-neutral-900 text-white shadow-md">
      {/* Upper bar: Logo + Search + Auth/Theme */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div 
          onClick={() => { onNavigate('home'); onGenreSelect(null); setSearchQuery(''); }}
          className="flex cursor-pointer items-center space-x-2 font-black tracking-tighter"
          id="nettruyen-logo"
        >
          <div className="flex h-10 items-center justify-center rounded-lg bg-orange-500 px-3 text-xl font-extrabold text-neutral-900">
            NET
          </div>
          <span className="text-xl font-black text-white hover:text-orange-400 transition">TRUYEN</span>
        </div>

        {/* Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-full max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm truyện tranh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              className="w-full h-10 pl-4 pr-10 rounded-full border border-neutral-700 bg-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              id="search-input"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-neutral-400 hover:text-orange-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 max-h-96 overflow-y-auto rounded-lg border border-neutral-700 bg-neutral-800 p-2 shadow-2xl z-50">
              <div className="px-2 py-1 text-xs font-semibold text-neutral-400 border-b border-neutral-700 mb-1">
                Kết quả tìm kiếm ({searchResults.length})
              </div>
              {searchResults.map((manga) => (
                <div
                  key={manga.id}
                  onClick={() => selectSearchResult(manga.id)}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-700/60 cursor-pointer transition"
                >
                  <img src={manga.coverUrl} alt={manga.title} className="w-10 h-14 object-cover rounded shadow" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">{manga.title}</h4>
                    <p className="text-xs text-neutral-400 truncate">{manga.author}</p>
                    <div className="flex space-x-2 mt-1">
                      {manga.genres.slice(0, 2).map((g, idx) => (
                        <span key={idx} className="text-[10px] bg-orange-500/15 text-orange-400 px-1.5 rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Icons & Controls */}
        <div className="flex items-center space-x-3">
          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-orange-500 transition-colors"
            title="Đổi giao diện"
            id="theme-toggle"
          >
            {darkMode ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Desktop follow/history shortcuts */}
          <button
            onClick={() => onNavigate('following')}
            className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              currentView === 'following'
                ? 'bg-orange-500 text-neutral-950 font-bold'
                : 'hover:bg-neutral-800 text-neutral-300'
            }`}
            id="nav-following"
          >
            <Heart className="h-4 w-4 fill-current" />
            <span>Theo Dõi</span>
            {followedCount > 0 && (
              <span className="ml-1 bg-red-600 text-white rounded-full px-1.5 py-0.2 text-[9px] font-bold">
                {followedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              currentView === 'history'
                ? 'bg-orange-500 text-neutral-950 font-bold'
                : 'hover:bg-neutral-800 text-neutral-300'
            }`}
            id="nav-history"
          >
            <History className="h-4 w-4" />
            <span>Lịch Sử</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-300 focus:outline-none md:hidden transition"
            id="mobile-menu-toggle"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Main navigation menu (Home, Hot, Thể loại dropdown, etc.) */}
      <nav className="border-t border-neutral-800 bg-neutral-950 hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center space-x-1 px-4 py-1.5 text-sm font-semibold">
          <button
            onClick={() => { onNavigate('home'); onGenreSelect(null); }}
            className={`px-3 py-2 rounded-md transition ${
              currentView === 'home' && !selectedGenre
                ? 'text-orange-500'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Trang Chủ
          </button>
          
          {/* Hot Tab */}
          <button
            onClick={() => { onNavigate('home'); onGenreSelect('hot'); }}
            className={`px-3 py-2 rounded-md flex items-center space-x-1 transition ${
              currentView === 'home' && selectedGenre === 'hot'
                ? 'text-orange-500'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Hot</span>
          </button>

          {/* Genres Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              onBlur={() => setTimeout(() => setShowGenreDropdown(false), 200)}
              className={`px-3 py-2 rounded-md flex items-center space-x-1 transition ${
                selectedGenre && selectedGenre !== 'hot'
                  ? 'text-orange-500'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span>Thể Loại</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showGenreDropdown && (
              <div className="absolute top-11 left-0 w-[450px] grid grid-cols-3 gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div
                  onMouseDown={() => { onNavigate('home'); onGenreSelect(null); }}
                  className={`p-2 text-xs rounded hover:bg-neutral-800 cursor-pointer transition font-bold ${
                    !selectedGenre ? 'text-orange-500 bg-orange-500/10' : 'text-neutral-300'
                  }`}
                >
                  Tất cả Thể Loại
                </div>
                {GENRES.map((g) => (
                  <div
                    key={g.id}
                    onMouseDown={() => { onNavigate('home'); onGenreSelect(g.name); }}
                    className={`p-2 text-xs rounded hover:bg-neutral-800 cursor-pointer transition ${
                      selectedGenre === g.name ? 'text-orange-500 bg-orange-500/10 font-bold' : 'text-neutral-300'
                    }`}
                    title={g.description}
                  >
                    {g.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('following')}
            className={`px-3 py-2 rounded-md transition ${
              currentView === 'following' ? 'text-orange-500' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Theo Dõi
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-2 rounded-md transition ${
              currentView === 'history' ? 'text-orange-500' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Lịch Sử
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-3 space-y-3 z-50">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm truyện tranh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-lg border border-neutral-700 bg-neutral-900 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <Search className="absolute right-2 top-2 h-5 w-5 text-neutral-500" />
          </form>

          {/* Mobile links list */}
          <div className="flex flex-col space-y-1 font-semibold text-sm">
            <button
              onClick={() => { onNavigate('home'); onGenreSelect(null); setShowMobileMenu(false); }}
              className={`p-2 rounded-md text-left ${
                currentView === 'home' && !selectedGenre ? 'bg-orange-500/10 text-orange-400' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => { onNavigate('home'); onGenreSelect('hot'); setShowMobileMenu(false); }}
              className={`p-2 rounded-md text-left flex items-center space-x-2 ${
                currentView === 'home' && selectedGenre === 'hot' ? 'bg-orange-500/10 text-orange-400' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Hot</span>
            </button>
            
            <div className="p-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">Thể loại</div>
            <div className="grid grid-cols-2 gap-1 px-2 pb-2">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { onNavigate('home'); onGenreSelect(g.name); setShowMobileMenu(false); }}
                  className={`p-1.5 text-xs text-left rounded ${
                    selectedGenre === g.name ? 'text-orange-400 bg-neutral-900 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-900 my-1"></div>

            <button
              onClick={() => { onNavigate('following'); setShowMobileMenu(false); }}
              className={`p-2 rounded-md text-left flex items-center justify-between ${
                currentView === 'following' ? 'bg-orange-500/10 text-orange-400' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Theo Dõi</span>
              </div>
              {followedCount > 0 && (
                <span className="bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {followedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { onNavigate('history'); setShowMobileMenu(false); }}
              className={`p-2 rounded-md text-left flex items-center space-x-2 ${
                currentView === 'history' ? 'bg-orange-500/10 text-orange-400' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Lịch Sử</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
