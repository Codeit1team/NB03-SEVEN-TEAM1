import * as Axios from 'axios';

// 클라이언트 및 실행 환경 체크
const isBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV !== 'production';

// BASE_URL + /api
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3001/api';

export const axios = Axios.default.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use((config) => {
  if (isDev && isBrowser) {
    const url = config.url?.startsWith('/') ? config.url : `/${config.url}`;
    console.log(`[프론트] ${config.method?.toUpperCase()} ${BASE_URL}${url}`);
  }
  return config;
});