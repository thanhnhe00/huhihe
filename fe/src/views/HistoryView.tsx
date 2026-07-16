import React from 'react';
import { History, Trash2, Play, AlertCircle, BookOpen } from 'lucide-react';
import { ReadingHistoryItem } from '../types';
import { motion } from 'motion/react';

interface HistoryViewProps {
  historyItems: ReadingHistoryItem[];
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history', mangaId?: string, chapterId?: string) => void;
  onClearHistory: (mangaId?: string) => void;
}

export default function HistoryView({
  historyItems,
  onNavigate,
  onClearHistory
}: HistoryViewProps) {
  // Sort items to show newest reads first
  const sortedHistory = [...historyItems].sort(
    (a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6" id="history-view-container">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-6">
        <div className="flex items-center space-x-2.5">
          <History className="h-6 w-6 text-orange-500" />
          <h1 className="text-xl font-black text-white uppercase tracking-wide">
            Lịch sử đọc truyện ({sortedHistory.length})
          </h1>
        </div>

        {sortedHistory.length > 0 && (
          <button
            onClick={() => onClearHistory()}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-bold transition cursor-pointer"
            id="clear-all-history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa toàn bộ lịch sử</span>
          </button>
        )}
      </div>

      {sortedHistory.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-orange-500 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-200">Bạn chưa đọc bộ truyện nào.</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Hệ thống sẽ tự động lưu lại các chương truyện bạn đã đọc tại đây để bạn có thể dễ dàng theo dõi tiến độ và tiếp tục đọc bất cứ lúc nào!
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-orange-500 hover:bg-orange-400 text-neutral-950 font-black px-5 py-2.5 rounded-lg text-xs transition cursor-pointer"
          >
            Bắt đầu đọc truyện ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto" id="history-items-list">
          {sortedHistory.map((item, idx) => {
            const formattedDate = new Date(item.readAt).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });

            return (
              <motion.div
                key={`${item.mangaId}-${item.chapterId}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className="bg-neutral-900 border border-neutral-800/80 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-4 hover:border-neutral-700 transition shadow"
              >
                {/* Comic info section left */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  <img
                    src={item.coverUrl}
                    alt={item.mangaTitle}
                    className="w-12 h-16 object-cover rounded shadow-md flex-shrink-0 cursor-pointer"
                    onClick={() => onNavigate('detail', item.mangaId)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 
                      onClick={() => onNavigate('detail', item.mangaId)}
                      className="text-sm font-black text-white hover:text-orange-400 cursor-pointer transition truncate"
                    >
                      {item.mangaTitle}
                    </h3>
                    
                    <p className="text-xs text-orange-400 font-extrabold mt-1">
                      Đang đọc: <span className="underline">{item.chapterTitle.split(':')[0]}</span>
                    </p>

                    <p className="text-[10px] text-neutral-500 mt-1 italic">
                      Đọc lúc: {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Actions right */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => onNavigate('reader', item.mangaId, item.chapterId)}
                    className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-black px-3.5 py-2 rounded-lg text-xs transition cursor-pointer shadow"
                    title="Đọc tiếp"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span className="hidden sm:inline">Đọc tiếp</span>
                  </button>

                  <button
                    onClick={() => onClearHistory(item.mangaId)}
                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-800 rounded transition cursor-pointer"
                    title="Xóa khỏi lịch sử"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
