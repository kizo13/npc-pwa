import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { UserDto } from '../dtos/entities.dto';
import { LoginResponseDto, TokenResponseDto } from '../dtos/api-responses.dto';

const API_URL = process.env.REACT_APP_API_URL;

const protectedApi = axios.create({
  baseURL: API_URL,
});

const getAuthorizationHeaderConfig = (): AxiosRequestConfig => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getRefreshHeaderConfig = (): AxiosRequestConfig => {
  const token = localStorage.getItem('refresh_token');
  return {
    headers: { Authorization: `Refresh ${token}` },
  };
};

const api = {
  login: (email: string, password: string): Promise<LoginResponseDto> => axios
    .post<LoginResponseDto>(`${API_URL}/auth/login`, { email, password })
    .then((res) => {
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      return res.data;
    }),

  logout: (): Promise<null> => protectedApi
    .post('/auth/logout', null, getAuthorizationHeaderConfig())
    .then((res) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return res.data;
    }),

  refreshAccessToken: (): Promise<TokenResponseDto> => axios
    .get<TokenResponseDto>(`${API_URL}/auth/refresh`, getRefreshHeaderConfig())
    .then((res) => {
      localStorage.setItem('access_token', res.data.access_token);
      return res.data;
    }),

  getUsers: (): Promise<Array<UserDto>> => protectedApi
    .get('/users')
    .then((res) => res.data),
};

protectedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

protectedApi.interceptors.response.use((response) => response, (error: AxiosError) => {
  if (error.config && error.response && error.response.status === 401) {
    return api.refreshAccessToken().then((tokenData) => {
      error.config.headers.Authorization = `Bearer ${tokenData.access_token}`;
      return axios.request(error.config);
    });
  }

  return Promise.reject(error);
});

export default api;
