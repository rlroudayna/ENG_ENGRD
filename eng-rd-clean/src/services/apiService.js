// src/services/apiService.js
import { adminClient, publicClient } from '../utils/axiosConfig';

// ==================== NEWS API ====================
export async function fetchNews() {
  const { data } = await publicClient.get('/api/news');
  return data;
}

export async function fetchNewsById(id) {
  const { data } = await publicClient.get(`/api/news/${id}`);
  return data;
}

export async function createNews(newsData) {
  const { data } = await adminClient.post('/api/news', newsData);
  return data;
}

export async function updateNews(id, newsData) {
  const { data } = await adminClient.put(`/api/news/${id}`, newsData);
  return data;
}

export async function deleteNews(id) {
  const { data } = await adminClient.delete(`/api/news/${id}`);
  return data;
}

// ==================== JOBS API ====================
export async function fetchJobs() {
  const { data } = await publicClient.get('/api/jobs');
  return data;
}

export async function fetchJobById(id) {
  const { data } = await publicClient.get(`/api/jobs/${id}`);
  return data;
}

export async function createJob(jobData) {
  const { data } = await adminClient.post('/api/admin/jobs', jobData);
  return data;
}

export async function updateJob(id, jobData) {
  const { data } = await adminClient.put(`/api/admin/jobs/${id}`, jobData);
  return data;
}

export async function deleteJob(id) {
  const { data } = await adminClient.delete(`/api/admin/jobs/${id}`);
  return data;
}

// ==================== APPLICATIONS API ====================
export async function submitApplication(applicationData) {
  const { data } = await publicClient.post('/api/applications', applicationData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function fetchApplications() {
  const { data } = await adminClient.get('/api/applications');
  return data;
}

export async function deleteApplication(id) {
  const { data } = await adminClient.delete(`/api/applications/${id}`);
  return data;
}

// ==================== MESSAGES/CONTACT API ====================
export async function sendMessage(messageData) {
  const { data } = await publicClient.post('/api/messages', messageData);
  return data;
}

export async function fetchMessages() {
  const { data } = await adminClient.get('/api/messages');
  return data;
}

export async function deleteMessage(id) {
  const { data } = await adminClient.delete(`/api/messages/${id}`);
  return data;
}

// ==================== HOME CONTENT API ====================
export async function fetchHomeContent() {
  const { data } = await publicClient.get('/api/home-content');
  return data;
}

export async function updateHomeContent(contentData) {
  const { data } = await adminClient.put('/api/home-content', contentData);
  return data;
}

// ==================== AUTH API ====================
export async function loginAdmin(username, password) {
  const { data } = await publicClient.post('/api/auth/admin/login', {
    username,
    password
  });
  return data;
}

export async function verifyToken(token) {
  const { data } = await publicClient.post('/api/auth/admin/verify', { token });
  return data;
}

export async function logoutAdmin() {
  const { data } = await adminClient.post('/api/auth/admin/logout');
  return data;
}

// ==================== UPLOAD API ====================
export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const { data } = await adminClient.post('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function uploadVideo(videoFile) {
  const formData = new FormData();
  formData.append('video', videoFile);
  
  const { data } = await adminClient.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

// ==================== UTILITY FUNCTIONS ====================
export function getFileURL(filename) {
  const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : window.location.origin;
  return `${baseURL}/uploads/${filename}`;
}

// WebSocket connection helper
export function createWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'localhost:5000'
    : window.location.host;
  
  return new WebSocket(`${protocol}//${host}/ws`);
}

export default {
  // News
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
  
  // Jobs
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
  
  // Applications
  submitApplication,
  fetchApplications,
  deleteApplication,
  
  // Messages
  sendMessage,
  fetchMessages,
  deleteMessage,
  
  // Home Content
  fetchHomeContent,
  updateHomeContent,
  
  // Auth
  loginAdmin,
  verifyToken,
  logoutAdmin,
  
  // Upload
  uploadImage,
  uploadVideo,
  
  // Utilities
  getFileURL,
  createWebSocket
};