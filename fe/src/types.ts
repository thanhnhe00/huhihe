export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  updatedAt: string;
  pages: string[]; // List of image URLs
  viewCount: number;
}

export interface Comment {
  id: string;
  mangaId: string;
  chapterId?: string; // Optional if comment is on the main manga page
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Manga {
  id: string;
  title: string;
  otherTitle?: string;
  author: string;
  status: 'Đang tiến hành' | 'Hoàn thành';
  description: string;
  coverUrl: string;
  bannerUrl?: string;
  genres: string[]; // Genre names or IDs
  viewCount: number;
  commentCount: number;
  followerCount: number;
  rating: number;
  chapters: Chapter[];
  isHot?: boolean;
}

export interface ReadingHistoryItem {
  mangaId: string;
  chapterId: string;
  chapterTitle: string;
  mangaTitle: string;
  coverUrl: string;
  readAt: string;
}
