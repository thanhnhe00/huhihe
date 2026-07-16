import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Check, X, Shield, BookOpen, Layers,
  Users, Award, Settings, FolderPlus, ArrowLeft, RefreshCw
} from 'lucide-react';
import api from '../utils/api';

interface ManagementViewProps {
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history' | 'management', mangaId?: string, chapterId?: string) => void;
}

export default function ManagementView({ onNavigate }: ManagementViewProps) {
  const userRole = localStorage.getItem('role') || 'READER';
  const isAdmin = userRole === 'ADMIN';
  const isCreator = userRole === 'CREATOR' || isAdmin;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stories' | 'chapters' | 'moderation' | 'categories' | 'collections' | 'users'>(
    isCreator ? 'stories' : 'moderation'
  );

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data States
  const [stories, setStories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Selection states for chapters
  const [selectedStoryId, setSelectedStoryId] = useState<string>('');
  const [storyChapters, setStoryChapters] = useState<any[]>([]);

  // Modals / Form States
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    ageRating: 0,
    contentType: 'COMIC',
    categoryIds: [] as number[]
  });

  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [chapterForm, setChapterForm] = useState({
    chapterNumber: 1,
    title: '',
    content: '',
    imageUrlsInput: ''
  });

  // User management form state
  const [userLockForm, setUserLockForm] = useState({
    userId: '',
    reason: 'Violates community guidelines',
    days: 7
  });

  // Category & Collection form state
  const [newItemName, setNewItemName] = useState('');

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch stories
      const storiesRes = await api.get('/stories?size=100');
      setStories(storiesRes.data.content || []);

      // Fetch categories
      const catRes = await api.get('/categories');
      setCategories(catRes.data || []);

      // Fetch collections
      const collRes = await api.get('/collections');
      setCollections(collRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sibling chapters loader when story is selected
  const handleStorySelect = async (storyId: string) => {
    setSelectedStoryId(storyId);
    if (!storyId) {
      setStoryChapters([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/stories/${storyId}/chapters`);
      setStoryChapters(res.data || []);
    } catch (err: any) {
      setError('Không thể tải chương cho bộ truyện này.');
    } finally {
      setLoading(false);
    }
  };

  // Story Submit (Create/Update)
  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingStory) {
        await api.put(`/stories/${editingStory.storyId}`, {
          title: storyForm.title,
          author: storyForm.author,
          description: storyForm.description,
          coverImage: storyForm.coverImage,
          ageRating: storyForm.ageRating,
          categoryIds: storyForm.categoryIds
        });
        setSuccess('Cập nhật truyện thành công!');
      } else {
        await api.post('/stories', {
          title: storyForm.title,
          author: storyForm.author,
          description: storyForm.description,
          coverImage: storyForm.coverImage,
          ageRating: storyForm.ageRating,
          contentType: storyForm.contentType,
          categoryIds: storyForm.categoryIds
        });
        setSuccess('Tạo truyện mới thành công!');
      }
      setShowStoryModal(false);
      setEditingStory(null);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin truyện.');
    }
  };

  // Delete Story
  const handleDeleteStory = async (storyId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ truyện này không? Tất cả chương liên quan sẽ bị ảnh hưởng.')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/stories/${storyId}`);
      setSuccess('Xóa truyện thành công!');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa truyện.');
    }
  };

  // Chapter Submit (Create/Update)
  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoryId) return;
    setError('');
    setSuccess('');
    try {
      const imageUrls = chapterForm.imageUrlsInput
        .split(/[\n,]+/)
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (editingChapter) {
        await api.put(`/chapters/${editingChapter.chapterId}`, {
          title: chapterForm.title,
          content: chapterForm.content,
          imageUrls: imageUrls
        });
        setSuccess('Cập nhật chương thành công!');
      } else {
        await api.post(`/stories/${selectedStoryId}/chapters`, {
          chapterNumber: chapterForm.chapterNumber,
          title: chapterForm.title,
          content: chapterForm.content,
          imageUrls: imageUrls
        });
        setSuccess('Thêm chương mới thành công!');
      }
      setShowChapterModal(false);
      setEditingChapter(null);
      handleStorySelect(selectedStoryId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin chương.');
    }
  };

  // Delete Chapter
  const handleDeleteChapter = async (chapterId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương này không?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/chapters/${chapterId}`);
      setSuccess('Xóa chương thành công!');
      handleStorySelect(selectedStoryId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa chương.');
    }
  };

  // Approve / Reject Story
  const handleApproveStory = async (storyId: number) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/moderation/story/${storyId}/approve`);
      setSuccess('Duyệt đăng truyện thành công!');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể duyệt truyện.');
    }
  };

  const handleRejectStory = async (storyId: number) => {
    const reason = window.prompt('Nhập lý do từ chối:', 'Nội dung chưa đạt yêu cầu');
    if (reason === null) return;
    setError('');
    setSuccess('');
    try {
      await api.put(`/moderation/story/${storyId}/reject?reason=${encodeURIComponent(reason)}`);
      setSuccess('Từ chối duyệt truyện thành công!');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể từ chối duyệt.');
    }
  };

  // Categories CRUD
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await api.post('/categories', { name: newItemName.trim() });
      setSuccess('Thêm thể loại thành công!');
      setNewItemName('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể thêm thể loại.');
    }
  };

  // Collections CRUD
  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await api.post('/collections', { name: newItemName.trim() });
      setSuccess('Thêm bộ sưu tập thành công!');
      setNewItemName('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể thêm bộ sưu tập.');
    }
  };

  const handleDeleteCollection = async (collId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/collections/${collId}`);
      setSuccess('Xóa bộ sưu tập thành công!');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa bộ sưu tập.');
    }
  };

  // User Lock/Unlock
  const handleLockUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLockForm.userId) return;
    setError('');
    setSuccess('');
    try {
      await api.put(`/users/${userLockForm.userId}/lock?reason=${encodeURIComponent(userLockForm.reason)}&days=${userLockForm.days}`);
      setSuccess('Khóa tài khoản người dùng thành công!');
      setUserLockForm({ userId: '', reason: 'Violates community guidelines', days: 7 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể khóa tài khoản.');
    }
  };

  const handleUnlockUser = async (userId: string) => {
    if (!userId) return;
    setError('');
    setSuccess('');
    try {
      await api.put(`/users/${userId}/unlock`);
      setSuccess('Mở khóa tài khoản người dùng thành công!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể mở khóa tài khoản.');
    }
  };

  const openAddStory = () => {
    setEditingStory(null);
    setStoryForm({
      title: '',
      author: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      ageRating: 0,
      contentType: 'COMIC',
      categoryIds: []
    });
    setShowStoryModal(true);
  };

  const openEditStory = (st: any) => {
    setEditingStory(st);
    setStoryForm({
      title: st.title || '',
      author: st.author || '',
      description: st.description || '',
      coverImage: st.coverUrl || '',
      ageRating: st.ageRating || 0,
      contentType: 'COMIC',
      categoryIds: []
    });
    setShowStoryModal(true);
  };

  const openAddChapter = () => {
    setEditingChapter(null);
    setChapterForm({
      chapterNumber: storyChapters.length + 1,
      title: '',
      content: '',
      imageUrlsInput: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80\nhttps://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=800&auto=format&fit=crop&q=80'
    });
    setShowChapterModal(true);
  };

  const openEditChapter = (ch: any) => {
    setEditingChapter(ch);
    setChapterForm({
      chapterNumber: ch.chapterNumber || 1,
      title: ch.title || '',
      content: ch.content || '',
      imageUrlsInput: ch.pages ? ch.pages.join('\n') : ''
    });
    setShowChapterModal(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8" id="management-container">
      {/* Return to home button */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-orange-400 font-bold transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Trở về Trang Chủ</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Navigation Sidebar/List */}
        <div className="w-full md:w-64 bg-neutral-900 border border-neutral-800 rounded-xl p-4 h-fit space-y-2">
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Sáng tác & Đăng truyện</div>
          {isCreator && (
            <>
              <button
                onClick={() => setActiveTab('stories')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'stories' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Quản lý truyện</span>
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'chapters' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Quản lý chương</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <div className="px-3 py-2 pt-4 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Quản trị hệ thống</div>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'moderation' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Kiểm duyệt truyện ({stories.filter(s => s.status === 'PENDING' || s.status === 'DRAFT').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'categories' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <FolderPlus className="h-4 w-4" />
                <span>Quản lý Thể loại</span>
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'collections' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Bộ sưu tập</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'users' ? 'bg-orange-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Khóa/Mở Khóa Users</span>
              </button>
            </>
          )}
        </div>

        {/* Action stage Panel */}
        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-md relative">

          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-6">
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500 animate-spin" />
              <span>
                {activeTab === 'stories' && 'Quản lý truyện'}
                {activeTab === 'chapters' && 'Quản lý chương'}
                {activeTab === 'moderation' && 'Kiểm duyệt nội dung'}
                {activeTab === 'categories' && 'Thể loại hệ thống'}
                {activeTab === 'collections' && 'Bộ sưu tập nổi bật'}
                {activeTab === 'users' && 'Quản lý người dùng'}
              </span>
            </h2>
            <button
              onClick={loadData}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              title="Làm mới"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-lg mb-6 font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-lg mb-6 font-semibold">
              {success}
            </div>
          )}

          {/* TAB 1: STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-xs text-neutral-400">Danh sách các truyện tranh hiện tại trên hệ thống.</p>
                <button
                  onClick={openAddStory}
                  className="bg-orange-500 text-neutral-950 text-xs font-black px-3 py-1.5 rounded flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tạo truyện mới</span>
                </button>
              </div>

              <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto pr-1">
                {stories.map(st => (
                  <div key={st.storyId} className="py-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={st.coverImage} className="w-10 h-14 object-cover rounded shadow" />
                      <div>
                        <h4 className="font-bold text-neutral-200">{st.title}</h4>
                        <p className="text-[10px] text-neutral-500">Tác giả: {st.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditStory(st)}
                        className="p-1.5 rounded bg-neutral-850 hover:bg-neutral-800 text-orange-400"
                        title="Sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(st.storyId)}
                        className="p-1.5 rounded bg-neutral-850 hover:bg-neutral-800 text-red-400"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTERS */}
          {activeTab === 'chapters' && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Chọn truyện</label>
                <select
                  value={selectedStoryId}
                  onChange={(e) => handleStorySelect(e.target.value)}
                  className="bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg p-2.5 text-xs outline-none w-full max-w-md"
                >
                  <option value="">-- Chọn một truyện tranh --</option>
                  {stories.map(st => (
                    <option key={st.storyId} value={st.storyId}>{st.title}</option>
                  ))}
                </select>
              </div>

              {selectedStoryId && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase">Danh sách chương ({storyChapters.length})</h4>
                    <button
                      onClick={openAddChapter}
                      className="bg-orange-500 text-neutral-950 text-xs font-black px-3 py-1.5 rounded flex items-center space-x-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Thêm chương</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-800 max-h-[400px] overflow-y-auto pr-1">
                    {storyChapters.map(ch => (
                      <div key={ch.chapterId} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-neutral-200">
                            Chap {ch.chapterNumber}: {ch.title || 'Không có tiêu đề'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditChapter(ch)}
                            className="p-1.5 rounded bg-neutral-850 hover:bg-neutral-800 text-orange-400"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch.chapterId)}
                            className="p-1.5 rounded bg-neutral-850 hover:bg-neutral-800 text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">Kiểm duyệt các truyện mới đăng hoặc ở dạng nháp.</p>

              <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto pr-1">
                {stories.filter(s => s.status === 'PENDING' || s.status === 'DRAFT').length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-6">Không có truyện tranh nào cần kiểm duyệt.</p>
                ) : (
                  stories.filter(s => s.status === 'PENDING' || s.status === 'DRAFT').map(st => (
                    <div key={st.storyId} className="py-4 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={st.coverImage} className="w-10 h-14 object-cover rounded shadow" />
                        <div>
                          <h4 className="font-bold text-neutral-200">{st.title}</h4>
                          <span className="bg-yellow-500/15 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.2 rounded text-[9px] uppercase font-bold">
                            {st.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveStory(st.storyId)}
                          className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-neutral-950 font-bold"
                        >
                          Duyệt đăng
                        </button>
                        <button
                          onClick={() => handleRejectStory(st.storyId)}
                          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nhập tên thể loại mới..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-lg p-2 h-9 text-xs outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-neutral-950 text-xs font-black px-4 rounded h-9 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm</span>
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1">
                {categories.map(c => (
                  <div key={c.categoryId} className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-bold">{c.name}</span>
                    <span className="text-[10px] text-neutral-500">ID: {c.categoryId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="space-y-6">
              <form onSubmit={handleAddCollection} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nhập tên bộ sưu tập mới..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-lg p-2 h-9 text-xs outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-neutral-950 text-xs font-black px-4 rounded h-9 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm</span>
                </button>
              </form>

              <div className="divide-y divide-neutral-800 max-h-[400px] overflow-y-auto pr-1">
                {collections.map(c => (
                  <div key={c.collectionId} className="py-3 flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-bold">{c.name}</span>
                    <button
                      onClick={() => handleDeleteCollection(c.collectionId)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition"
                      title="Xóa bộ sưu tập"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: USERS LOCK/UNLOCK */}
          {activeTab === 'users' && (
            <div className="max-w-md space-y-6">
              <p className="text-xs text-neutral-400">Thực hiện khóa/mở khóa tài khoản người dùng trực tiếp bằng User ID.</p>

              <form onSubmit={handleLockUser} className="space-y-4 bg-neutral-950/40 p-4 rounded-lg border border-neutral-800">
                <h4 className="text-xs font-bold text-orange-500 uppercase">Khóa tài khoản người dùng</h4>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">User ID</label>
                  <input
                    type="number"
                    required
                    value={userLockForm.userId}
                    onChange={(e) => setUserLockForm({ ...userLockForm, userId: e.target.value })}
                    placeholder="Nhập ID người dùng..."
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Lý do</label>
                  <input
                    type="text"
                    required
                    value={userLockForm.reason}
                    onChange={(e) => setUserLockForm({ ...userLockForm, reason: e.target.value })}
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Số ngày khóa</label>
                  <input
                    type="number"
                    required
                    value={userLockForm.days}
                    onChange={(e) => setUserLockForm({ ...userLockForm, days: parseInt(e.target.value) || 7 })}
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold transition"
                  >
                    Khóa tài khoản
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnlockUser(userLockForm.userId)}
                    disabled={!userLockForm.userId}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-neutral-950 py-2 rounded-lg text-xs font-black transition disabled:opacity-40"
                  >
                    Mở khóa tài khoản
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* STORY CREATE/EDIT MODAL */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-white uppercase text-center mb-6">
              {editingStory ? 'Cập nhật truyện tranh' : 'Tạo mới truyện tranh'}
            </h3>

            <form onSubmit={handleStorySubmit} className="space-y-4 text-xs text-neutral-300">
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tên truyện</label>
                <input
                  type="text"
                  required
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tác giả</label>
                <input
                  type="text"
                  value={storyForm.author}
                  onChange={(e) => setStoryForm({ ...storyForm, author: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Ảnh bìa (URL)</label>
                <input
                  type="text"
                  value={storyForm.coverImage}
                  onChange={(e) => setStoryForm({ ...storyForm, coverImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Độ tuổi giới hạn</label>
                <input
                  type="number"
                  value={storyForm.ageRating}
                  onChange={(e) => setStoryForm({ ...storyForm, ageRating: parseInt(e.target.value) || 0 })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Thể loại</label>
                <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-3 rounded-lg border border-neutral-800 max-h-32 overflow-y-auto">
                  {categories.map(c => (
                    <label key={c.categoryId} className="flex items-center space-x-1.5 text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storyForm.categoryIds.includes(c.categoryId)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updatedIds = checked
                            ? [...storyForm.categoryIds, c.categoryId]
                            : storyForm.categoryIds.filter(id => id !== c.categoryId);
                          setStoryForm({ ...storyForm, categoryIds: updatedIds });
                        }}
                        className="rounded bg-neutral-900 border-neutral-850 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="truncate">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={storyForm.description}
                  onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-neutral-950 py-2.5 rounded-lg text-xs font-black transition cursor-pointer"
              >
                LƯU TRUYỆN TRANH
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CHAPTER CREATE/EDIT MODAL */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowChapterModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-white uppercase text-center mb-6">
              {editingChapter ? 'Cập nhật chương' : 'Thêm mới chương'}
            </h3>

            <form onSubmit={handleChapterSubmit} className="space-y-4 text-xs text-neutral-300">
              {!editingChapter && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Số chương (Chapter Number)</label>
                  <input
                    type="number"
                    required
                    value={chapterForm.chapterNumber}
                    onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tiêu đề chương (Tùy chọn)</label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  placeholder="Ví dụ: Vinh Quang, Bắt đầu..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Danh sách link ảnh các trang (Mỗi link một dòng)</label>
                <textarea
                  rows={6}
                  value={chapterForm.imageUrlsInput}
                  onChange={(e) => setChapterForm({ ...chapterForm, imageUrlsInput: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-lg p-2.5 text-neutral-200 outline-none font-mono text-[10px]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-neutral-950 py-2.5 rounded-lg text-xs font-black transition cursor-pointer"
              >
                LƯU CHƯƠNG ĐỌC
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
