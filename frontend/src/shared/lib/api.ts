import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/shared/types';

// Lazy import to avoid circular dependency (authStore → api → authStore)
let getToken: () => string | null = () => null;
let onRefreshFail: () => void = () => undefined;

export function configureApiInterceptors(opts: {
  getToken: () => string | null;
  onRefreshFail: () => void;
}) {
  getToken = opts.getToken;
  onRefreshFail = opts.onRefreshFail;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach access token ───────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: handle 401 → refresh ────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Never retry the refresh endpoint itself — that would deadlock the queue.
    const isRefreshCall = originalRequest.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>('/api/auth/refresh');
        const { accessToken } = data;

        // Dynamically update the store after refresh
        const { useAuthStore } = await import('@/features/auth/store/authStore');
        useAuthStore.getState().setAuth(useAuthStore.getState().user!, accessToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        onRefreshFail();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalise error shape
    const apiError: ApiError = {
      message: (error.response?.data as { detail?: string })?.detail ?? error.message,
      statusCode: error.response?.status ?? 0,
      errors: (error.response?.data as { errors?: Record<string, string[]> })?.errors,
    };

    return Promise.reject(apiError);
  }
);
