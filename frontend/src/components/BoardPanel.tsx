'use client';

import { useEffect, useState } from 'react';
import { contentApi, mediaApi } from '@/lib/api';
import { Plus, Pencil, Trash2, Image as ImageIcon, X, Send } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface BoardPanelProps {
  roomType: 'mini' | 'couple';
  roomId: string;
  userId: string;
}

export function BoardPanel({ roomType, roomId, userId }: BoardPanelProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [roomType, roomId]);

  const loadPosts = async () => {
    try {
      const { data } = await contentApi.getPosts(roomType, roomId);
      setPosts(data.posts || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!content.trim()) return;
    try {
      const { data } = await contentApi.createPost(roomType, roomId, { content });
      setPosts([data.post, ...posts]);
      setContent('');
      setShowForm(false);
      toast.success('게시글이 작성되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (postId: string) => {
    if (!editContent.trim()) return;
    try {
      await contentApi.updatePost(roomType, roomId, postId, { content: editContent });
      setPosts(posts.map(p => p.id === postId ? { ...p, content: editContent } : p));
      setEditingId(null);
      toast.success('게시글이 수정되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await contentApi.deletePost(roomType, roomId, postId);
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('게시글이 삭제되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-4 mb-20 md:mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">게시판</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> 글쓰기
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 생각을 하고 있나요?"
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => { setShowForm(false); setContent(''); }} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
              취소
            </button>
            <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">
              <Send className="w-4 h-4" /> 등록
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl">
          <p className="text-gray-400">아직 게시글이 없어요</p>
          <p className="text-sm text-gray-300 mt-1">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass rounded-2xl p-4">
              {editingId === post.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-gray-500">취소</button>
                    <button onClick={() => handleUpdate(post.id)} className="px-3 py-1.5 text-sm bg-pink-500 text-white rounded-lg">저장</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                    {post.authorId === userId && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingId(post.id); setEditContent(post.content); }}
                          className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
