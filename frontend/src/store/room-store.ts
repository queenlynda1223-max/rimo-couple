import { create } from 'zustand';

interface RoomState {
  currentRoom: any | null;
  coupleRoom: any | null;
  miniRoom: any | null;
  setCurrentRoom: (room: any) => void;
  setCoupleRoom: (room: any) => void;
  setMiniRoom: (room: any) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  coupleRoom: null,
  miniRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCoupleRoom: (room) => set({ coupleRoom: room }),
  setMiniRoom: (room) => set({ miniRoom: room }),
}));
