import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'detail' | 'reader' | 'following' | 'history') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 border-t border-neutral-900 mt-12 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About section */}
        <div>
          <div 
            onClick={() => onNavigate('home')}
            className="flex cursor-pointer items-center space-x-2 font-black tracking-tighter text-white mb-4"
          >
            <div className="flex h-8 items-center justify-center rounded bg-orange-500 px-2.5 text-md font-extrabold text-neutral-900">
              NET
            </div>
            <span className="text-lg font-black text-white">TRUYEN CLONE</span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            NetTruyen Clone - Cổng đọc truyện tranh trực tuyến miễn phí lớn nhất Việt Nam. 
            Cập nhật liên tục các thể loại Manga, Manhua, Manhwa chất lượng cao với tốc độ nhanh nhất. 
            Trang web được phát triển phục vụ mục đích học tập và giải trí cá nhân.
          </p>
        </div>

        {/* Categories / Shortcuts */}
        <div>
          <h3 className="text-sm font-bold text-neutral-200 mb-4 uppercase tracking-wider">Từ khóa nổi bật</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Truyện tranh', 'Đọc truyện online', 'NetTruyen', 'Manga hot', 'Manhwa hay', 'Truyện hành động', 'Truyện ngôn tình', 'Truyện dịch nhanh nhất', 'Truyện tranh màu', 'Full chap'].map((tag, idx) => (
              <span key={idx} className="bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 px-2 py-1 rounded cursor-pointer transition">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Contact & Disclaimer */}
        <div>
          <h3 className="text-sm font-bold text-neutral-200 mb-4 uppercase tracking-wider">Miễn trừ trách nhiệm</h3>
          <p className="text-xs leading-relaxed text-neutral-500 mb-2">
            Mọi nội dung trên trang web này đều được sưu tầm từ các nguồn công cộng trên Internet. 
            Chúng tôi không sở hữu bản quyền hay lưu trữ trực tiếp bất kỳ nội dung truyện tranh nào. 
            Nếu có bất kỳ vấn đề nào về bản quyền, vui lòng liên hệ email hỗ trợ.
          </p>
          <div className="text-xs text-neutral-500 mt-4">
            Liên hệ: <span className="text-orange-500 hover:underline cursor-pointer">caohuongquynh2k6@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600">
        <p>© 2026 NetTruyen Clone. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <span className="hover:text-neutral-400 cursor-pointer transition">Điều khoản bảo mật</span>
          <span className="hover:text-neutral-400 cursor-pointer transition">Liên hệ quảng cáo</span>
          <span className="hover:text-neutral-400 cursor-pointer transition">Sơ đồ trang web</span>
        </div>
      </div>
    </footer>
  );
}
