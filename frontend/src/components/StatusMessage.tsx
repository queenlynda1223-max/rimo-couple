'use client';

import { useState } from 'react';
import { userApi } from '@/lib/api';
import { Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface StatusMessageProps {
  roomId: string;
  userId: string;
  statusMessage: string;
  isOwner: boolean;
  onUpdate: (msg: string) => void;
}

export function StatusMessage({ roomId, userId, statusMessage, isOwner, onUpdate }: StatusMessageProps) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(statusMessage);

  const handleSave = async () => {
    if (message.length > 100) {
      toast.error('상태 메시지는 100자 이하여야 합니다');
      return;
    }
    try {
      await userApi.updateStatus(userId, message);
      onUpdate(message);
      setEditing(false);
      toast.success('상태 메시지가 업데이트되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="glass rounded-2xl p-4 mb-4">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
            placeholder="지금 기분을 알려주세요..."
            className="flex-1 px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoFocus
          />
          <button onClick={handleSave} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg">
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => { setEditing(false); setMessage(statusMessage); }} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 italic">
            {statusMessage || '상태 메시지를 설정해보세요'}
          </p>
          {isOwner && (
            <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-gray-600">
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
