'use client';

import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { Plus, Pencil, Trash2, Calendar, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SchedulePanelProps {
  roomType: 'mini' | 'couple';
  roomId: string;
  userId: string;
}

export function SchedulePanel({ roomType, roomId, userId }: SchedulePanelProps) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, [roomType, roomId]);

  const loadSchedules = async () => {
    try {
      const { data } = await contentApi.getSchedules(roomType, roomId);
      setSchedules(data.schedules || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !date) {
      toast.error('제목과 날짜는 필수입니다');
      return;
    }
    try {
      const { data } = await contentApi.createSchedule(roomType, roomId, { title, date, description: description || undefined });
      setSchedules([...schedules, data.schedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setTitle('');
      setDate('');
      setDescription('');
      setShowForm(false);
      toast.success('일정이 추가되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await contentApi.deleteSchedule(roomType, roomId, scheduleId);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
      toast.success('일정이 삭제되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date(new Date().toDateString());

  return (
    <div className="space-y-4 mb-20 md:mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">일정</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> 일정 추가
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="메모 (선택)"
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">취소</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600">추가</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400">등록된 일정이 없어요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`glass rounded-2xl p-4 border-l-4 ${isUpcoming(schedule.date) ? 'border-l-pink-400' : 'border-l-gray-300'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{schedule.title}</h4>
                  <p className="text-sm text-pink-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    {formatDate(schedule.date)}
                  </p>
                  {schedule.description && (
                    <p className="text-sm text-gray-500 mt-2">{schedule.description}</p>
                  )}
                </div>
                {schedule.creatorId === userId && (
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
