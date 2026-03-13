import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rimo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '오류가 발생했습니다';
    const enrichedError = new Error(message);
    (enrichedError as any).status = status;
    return Promise.reject(enrichedError);
  },
);

export default api;

export const authApi = {
  signup: (data: { email: string; password: string; nickname?: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const userApi = {
  getUser: (userId: string) => api.get(`/users/${userId}`),
  updateUser: (userId: string, data: any) => api.patch(`/users/${userId}`, data),
  getMinime: (userId: string) => api.get(`/users/${userId}/minime`),
  updateMinime: (userId: string, data: any) => api.put(`/users/${userId}/minime`, data),
  updateStatus: (userId: string, statusMessage: string) =>
    api.patch(`/rooms/mini/${userId}/status`, { statusMessage }),
};

export const roomApi = {
  getMiniRoom: (userId: string) => api.get(`/rooms/mini/${userId}`),
  updateMiniRoom: (userId: string, data: any) => api.patch(`/rooms/mini/${userId}`, data),
  createCoupleRoom: () => api.post('/rooms/couple'),
  getMyCoupleRoom: () => api.get('/rooms/couple/my'),
  getCoupleRoom: (roomId: string) => api.get(`/rooms/couple/${roomId}`),
  updateCoupleRoom: (roomId: string, data: any) => api.patch(`/rooms/couple/${roomId}`, data),
  getInvitation: (roomId: string) => api.post(`/rooms/couple/${roomId}/invite`),
  joinCoupleRoom: (invitationCode: string) => api.post('/rooms/couple/join', { invitationCode }),
};

export const contentApi = {
  getPosts: (roomType: string, roomId: string) =>
    api.get(`/rooms/${roomType}/${roomId}/posts`),
  createPost: (roomType: string, roomId: string, data: { content: string; images?: string[] }) =>
    api.post(`/rooms/${roomType}/${roomId}/posts`, data),
  updatePost: (roomType: string, roomId: string, postId: string, data: any) =>
    api.patch(`/rooms/${roomType}/${roomId}/posts/${postId}`, data),
  deletePost: (roomType: string, roomId: string, postId: string) =>
    api.delete(`/rooms/${roomType}/${roomId}/posts/${postId}`),

  getSchedules: (roomType: string, roomId: string) =>
    api.get(`/rooms/${roomType}/${roomId}/schedules`),
  createSchedule: (roomType: string, roomId: string, data: { title: string; date: string; description?: string }) =>
    api.post(`/rooms/${roomType}/${roomId}/schedules`, data),
  updateSchedule: (roomType: string, roomId: string, scheduleId: string, data: any) =>
    api.patch(`/rooms/${roomType}/${roomId}/schedules/${scheduleId}`, data),
  deleteSchedule: (roomType: string, roomId: string, scheduleId: string) =>
    api.delete(`/rooms/${roomType}/${roomId}/schedules/${scheduleId}`),

  getTodos: (roomType: string, roomId: string) =>
    api.get(`/rooms/${roomType}/${roomId}/todos`),
  createTodo: (roomType: string, roomId: string, data: { title: string }) =>
    api.post(`/rooms/${roomType}/${roomId}/todos`, data),
  updateTodo: (roomType: string, roomId: string, todoId: string, data: any) =>
    api.patch(`/rooms/${roomType}/${roomId}/todos/${todoId}`, data),
  deleteTodo: (roomType: string, roomId: string, todoId: string) =>
    api.delete(`/rooms/${roomType}/${roomId}/todos/${todoId}`),
};

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getFile: (fileId: string) => api.get(`/media/${fileId}`),
  deleteFile: (fileId: string) => api.delete(`/media/${fileId}`),
};
