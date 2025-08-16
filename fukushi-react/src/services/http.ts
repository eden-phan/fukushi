import axios, { AxiosError, type AxiosInstance } from 'axios';
import config from '@/constants/config';
import { getToken, removeTokens, setToken } from './auth';

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  constructor() {
    this.accessToken = getToken('access_token') || '';
    this.refreshToken = getToken('refresh_token') || '';
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === '/login' || url === '/register') {
          const data = response.data;
          this.accessToken = data.access_token;
          // this.refreshToken = data.data.refresh_token
          setToken('access_token', data.access_token);
          this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
          // setToken('refresh_token', data._data.token)
          // setProfile(data.data.user)
        } else if (url === '/logout') {
          this.accessToken = '';
          this.refreshToken = '';
          removeTokens();
        }
        return response;
      },
      (error: AxiosError) => {
        // Do something with response error
        return Promise.reject(error);
      },
    );
  }
}
const http = new Http().instance;
export default http;
