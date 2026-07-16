import React, { useState, useEffect } from 'react';
import { Search, Menu, X, BookOpen, History, Heart, Sun, Moon, TrendingUp, ChevronDown, LogOut, User, Lock, Mail, Calendar, Settings } from 'lucide-react';
import { Manga } from '../types';
import { MOCK_MANGAS, GENRES } from '../data/mangas';
import api from '../utils/api';

interface HeaderProps {
  currentView: 'home' | 'detail' | 'reader' | 'following' | 'history' | 'management';
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history' | 'management', mangaId?: string, chapterId?: string) => void;
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string | null) => void;
  selectedGenre: string | null;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  followedCount: number;
  onAuthChange?: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  onSearch,
  onGenreSelect,
  selectedGenre,
  darkMode,
  setDarkMode,
  followedCount,
  onAuthChange
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);

  // Auth State
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('2000-01-01');
  const [roleInput, setRoleInput] = useState<'READER' | 'CREATOR'>('READER');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync auth state
  useEffect(() => {
    const handleAuthUpdate = () => {
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleAuthUpdate);
    window.addEventListener('unauthorized-api-call', handleLogout);
    return () => {
      window.removeEventListener('storage', handleAuthUpdate);
      window.removeEventListener('unauthorized-api-call', handleLogout);
    };
  }, []);

  // Update live search results from real backend API using debounced search
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await api.get(`/stories?search=${encodeURIComponent(searchQuery)}&size=10`);
          const storyCards = res.data.content || [];
          const mapped: Manga[] = storyCards.map((card: any) => ({
            id: card.storyId.toString(),
            title: card.title,
            author: card.author || 'Khuyết Danh',
            coverUrl: card.coverImage,
            genres: card.categoryNames || [],
            viewCount: 0,
            commentCount: 0,
            followerCount: 0,
            rating: card.averageRating || 5.0,
            chapters: []
          }));
          setSearchResults(mapped);
          setShowSearchResults(true);
        } catch (e) {
          console.error('Failed to fetch search suggestions', e);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
      onSearch(searchQuery);
    };

    const timer = setTimeout(fetchSearchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchResults(false);
    onNavigate('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUsername(null);
    setRole(null);
    setShowProfileMenu(false);
    if (onAuthChange) onAuthChange();
    onNavigate('home');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: usernameInput,
        password: passwordInput,
      });
      const { token, role: userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', usernameInput);
      localStorage.setItem('role', userRole);

      setUsername(usernameInput);
      setRole(userRole);
      setSuccessMsg('Đăng nhập thành công!');

      setTimeout(() => {
        setShowAuthModal(false);
        setUsernameInput('');
        setPasswordInput('');
        if (onAuthChange) onAuthChange();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: usernameInput,
        password: passwordInput,
        email: emailInput,
        birthDate: birthDateInput,
        role: roleInput
      });
      setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setAuthMode('login');
      setEmailInput('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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

          {/* Authentication & Profile dropdown */}
          {username ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold hover:bg-neutral-800 text-neutral-300 transition"
                id="profile-dropdown-btn"
              >
                <div className="w-5 h-5 rounded-full bg-orange-500 text-neutral-950 flex items-center justify-center font-black text-[9px] uppercase">
                  {username[0]}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{username}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-750 bg-neutral-850 p-1 shadow-2xl z-50">
                  <div className="px-3 py-2 text-[10px] font-black text-neutral-400 border-b border-neutral-700/50 mb-1 tracking-wider uppercase">
                    Quyền: {role === 'ADMIN' ? 'Admin' : role === 'CREATOR' ? 'Sáng tác' : 'Độc giả'}
                  </div>
                  {(role === 'CREATOR' || role === 'ADMIN') && (
                    <button
                      onClick={() => { setShowProfileMenu(false); onNavigate('management'); }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-850 hover:text-orange-400 rounded-md transition font-semibold flex items-center space-x-2"
                      id="nav-management"
                    >
                      <Settings className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Bảng điều khiển</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-neutral-850 hover:text-red-300 rounded-md transition font-semibold flex items-center space-x-2"
                    id="logout-btn"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-500 hover:bg-orange-400 text-neutral-950 transition cursor-pointer shadow"
              id="login-btn"
            >
              <span>Đăng Nhập</span>
            </button>
          )}

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

      {/* Sleek Authentication Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => { setShowAuthModal(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-white text-center mb-6">
              {authMode === 'login' ? 'ĐĂNG NHẬP HỆ THỐNG' : 'ĐĂNG KÝ TÀI KHOẢN'}
            </h3>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4 font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg mb-4 font-semibold text-center">
                {successMsg}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tên tài khoản</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Nhập tên tài khoản..."
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <User className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <Lock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 py-2.5 rounded-lg text-xs font-black transition cursor-pointer shadow mt-2"
                >
                  {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                </button>

                <div className="text-center text-xs text-neutral-400 mt-4">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-orange-400 font-bold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tên tài khoản</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Nhập tên tài khoản..."
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <User className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <Mail className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <Lock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Ngày sinh</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={birthDateInput}
                      onChange={(e) => setBirthDateInput(e.target.value)}
                      className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 pl-8 text-neutral-200 outline-none transition"
                    />
                    <Calendar className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Vai trò</label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as any)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-300 outline-none cursor-pointer"
                  >
                    <option value="READER">Độc giả (Reader)</option>
                    <option value="CREATOR">Người sáng tác (Creator)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 py-2.5 rounded-lg text-xs font-black transition cursor-pointer shadow mt-2"
                >
                  {loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
                </button>

                <div className="text-center text-xs text-neutral-400 mt-4">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-orange-400 font-bold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
