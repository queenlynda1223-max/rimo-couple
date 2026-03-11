'use client';

import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TodoPanelProps {
  roomType: 'mini' | 'couple';
  roomId: string;
  userId: string;
}

export function TodoPanel({ roomType, roomId, userId }: TodoPanelProps) {
  const [incomplete, setIncomplete] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, [roomType, roomId]);

  const loadTodos = async () => {
    try {
      const { data } = await contentApi.getTodos(roomType, roomId);
      setIncomplete(data.incomplete || []);
      setCompleted(data.completed || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const { data } = await contentApi.createTodo(roomType, roomId, { title: newTitle });
      setIncomplete([data.todo, ...incomplete]);
      setNewTitle('');
      toast.success('할 일이 추가되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (todoId: string, isCompleted: boolean) => {
    try {
      await contentApi.updateTodo(roomType, roomId, todoId, { isCompleted: !isCompleted });
      if (isCompleted) {
        const todo = completed.find(t => t.id === todoId);
        if (todo) {
          setCompleted(completed.filter(t => t.id !== todoId));
          setIncomplete([{ ...todo, isCompleted: false }, ...incomplete]);
        }
      } else {
        const todo = incomplete.find(t => t.id === todoId);
        if (todo) {
          setIncomplete(incomplete.filter(t => t.id !== todoId));
          setCompleted([{ ...todo, isCompleted: true, completedAt: new Date().toISOString() }, ...completed]);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (todoId: string, isCompleted: boolean) => {
    try {
      await contentApi.deleteTodo(roomType, roomId, todoId);
      if (isCompleted) {
        setCompleted(completed.filter(t => t.id !== todoId));
      } else {
        setIncomplete(incomplete.filter(t => t.id !== todoId));
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  return (
    <div className="space-y-4 mb-20 md:mb-4">
      <h3 className="font-semibold text-gray-800 text-lg">할 일</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 할 일을 입력하세요"
          className="flex-1 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : (
        <>
          {incomplete.length === 0 && completed.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl">
              <Check className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">할 일이 없어요</p>
            </div>
          )}

          {incomplete.length > 0 && (
            <div className="space-y-2">
              {incomplete.map((todo) => (
                <div key={todo.id} className="glass rounded-xl p-3 flex items-center gap-3 group">
                  <button
                    onClick={() => handleToggle(todo.id, false)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50 transition-colors flex items-center justify-center"
                  >
                    <Circle className="w-4 h-4 text-transparent" />
                  </button>
                  <span className="flex-1 text-sm text-gray-800">{todo.title}</span>
                  <button
                    onClick={() => handleDelete(todo.id, false)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">완료됨 ({completed.length})</p>
              {completed.map((todo) => (
                <div key={todo.id} className="glass rounded-xl p-3 flex items-center gap-3 group opacity-60">
                  <button
                    onClick={() => handleToggle(todo.id, true)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </button>
                  <span className="flex-1 text-sm text-gray-500 line-through">{todo.title}</span>
                  <button
                    onClick={() => handleDelete(todo.id, true)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
