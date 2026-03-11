export interface User {
  id: string;
  email: string;
  nickname: string;
  oauthProvider?: string;
  createdAt: string;
  updatedAt: string;
  minime?: Minime;
  miniRoom?: MiniRoom;
}

export interface Minime {
  id: string;
  userId: string;
  faceType: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessories: string[];
}

export interface MiniRoom {
  id: string;
  userId: string;
  backgroundId: string;
  bgmId?: string;
  items: ItemPlacement[];
  statusMessage: string;
}

export interface CoupleRoom {
  id: string;
  user1Id: string;
  user2Id?: string;
  invitationCode: string;
  invitationLink: string;
  isConnected: boolean;
  backgroundId: string;
  bgmId?: string;
  items: ItemPlacement[];
  connectedAt?: string;
}

export interface ItemPlacement {
  itemId: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface Post {
  id: string;
  roomType: 'mini' | 'couple';
  roomId: string;
  authorId: string;
  author?: User;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  roomType: 'mini' | 'couple';
  roomId: string;
  creatorId: string;
  title: string;
  date: string;
  description?: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  roomType: 'mini' | 'couple';
  roomId: string;
  creatorId: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'image' | 'audio';
  mimeType: string;
  fileSize: number;
  url: string;
}
