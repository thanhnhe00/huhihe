import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp, CornerDownRight, MessageSquare, AlertCircle } from 'lucide-react';
import { Comment } from '../types';
import { generateInitialComments } from '../data/mangas';

interface CommentSectionProps {
  mangaId: string;
  chapterId?: string;
  userEmail?: string;
}

export default function CommentSection({ mangaId, chapterId, userEmail }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Load comments from localStorage or generate defaults
  useEffect(() => {
    const storageKey = `comments_${mangaId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (e) {
        const initial = generateInitialComments(mangaId);
        setComments(initial);
      }
    } else {
      const initial = generateInitialComments(mangaId);
      setComments(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  }, [mangaId]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(`comments_${mangaId}`, JSON.stringify(newComments));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const nickname = userEmail ? userEmail.split('@')[0] : 'Khách Ẩn Danh';
    const cleanEmail = userEmail || 'guest@example.com';
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${cleanEmail}`;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      mangaId,
      chapterId,
      username: nickname,
      avatar: avatarUrl,
      content: commentInput.trim(),
      timestamp: 'Vừa xong',
      likes: 0,
      replies: []
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setCommentInput('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyInput.trim()) return;

    const nickname = userEmail ? userEmail.split('@')[0] : 'Khách Ẩn Danh';
    const cleanEmail = userEmail || 'guest@example.com';
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${cleanEmail}`;

    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      mangaId,
      chapterId,
      username: nickname,
      avatar: avatarUrl,
      content: replyInput.trim(),
      timestamp: 'Vừa xong',
      likes: 0
    };

    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });

    saveComments(updated);
    setReplyInput('');
    setActiveReplyId(null);
  };

  const handleLike = (commentId: string, replyId?: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        if (replyId) {
          // Like is on a reply
          const updatedReplies = (c.replies || []).map(r => {
            if (r.id === replyId) {
              return { ...r, likes: r.likes + 1 };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        } else {
          // Like is on main comment
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });
    saveComments(updated);
  };

  // Filter comments depending on whether they are specific to a chapter
  const displayedComments = chapterId 
    ? comments.filter(c => !c.chapterId || c.chapterId === chapterId)
    : comments;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 md:p-6 mt-8" id="manga-comment-section">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800 mb-6">
        <MessageSquare className="h-5 w-5 text-orange-500" />
        <h3 className="text-base font-black text-white uppercase tracking-wide">
          Bình luận ({displayedComments.length})
        </h3>
      </div>

      {/* Main Comment Form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-orange-500/20 shadow">
            {userEmail ? userEmail[0].toUpperCase() : 'G'}
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              placeholder={chapterId ? "Nhập bình luận của bạn về chương này..." : "Chia sẻ cảm xúc của bạn về bộ truyện này..."}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
              id="comment-textarea"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-neutral-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 text-orange-400" />
                Vui lòng không bình luận spam hoặc chửi bới.
              </span>
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-orange-500 text-neutral-950 text-xs font-bold hover:bg-orange-400 disabled:opacity-50 disabled:hover:bg-orange-500 transition cursor-pointer"
                id="comment-submit"
              >
                <span>Gửi</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {displayedComments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!
          </div>
        ) : (
          displayedComments.map((comment) => (
            <div key={comment.id} className="border-b border-neutral-800/50 pb-5 last:border-0 last:pb-0">
              <div className="flex space-x-3 items-start">
                {/* Avatar */}
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-800 shadow"
                />

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-orange-400">{comment.username}</span>
                    {comment.chapterId && (
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                        Chap {comment.chapterId.split('-').pop()}
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-500">{comment.timestamp}</span>
                  </div>
                  
                  <p className="text-xs text-neutral-200 mt-1 leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Actions (Like, Reply toggle) */}
                  <div className="flex items-center space-x-4 mt-2.5 text-[11px] text-neutral-500">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center space-x-1 hover:text-orange-400 transition"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                        setReplyInput('');
                      }}
                      className="hover:text-orange-400 transition font-bold"
                    >
                      Trả lời
                    </button>
                  </div>

                  {/* Reply Form (Conditional) */}
                  {activeReplyId === comment.id && (
                    <div className="mt-3 flex items-start space-x-2 max-w-lg">
                      <input
                        type="text"
                        placeholder="Nhập câu trả lời..."
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="flex-1 text-xs rounded border border-neutral-800 bg-neutral-950 p-2 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                        id={`reply-input-${comment.id}`}
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyInput.trim()}
                        className="p-2 rounded bg-orange-500 text-neutral-950 hover:bg-orange-400 disabled:opacity-50 transition cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-neutral-800 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-2 items-start">
                          <CornerDownRight className="h-4 w-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                          <img
                            src={reply.avatar}
                            alt={reply.username}
                            className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-orange-400">{reply.username}</span>
                              <span className="text-[9px] text-neutral-500">{reply.timestamp}</span>
                            </div>
                            <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                              {reply.content}
                            </p>
                            <button
                              onClick={() => handleLike(comment.id, reply.id)}
                              className="flex items-center space-x-1 text-[10px] text-neutral-500 hover:text-orange-400 mt-1.5 transition"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
