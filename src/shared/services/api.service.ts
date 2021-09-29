import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { NpcDto, UserDto } from '../dtos/entities.dto';
import {
  LoginResponseDto, NpcsPaginatedDto, TokenResponseDto,
} from '../dtos/api-responses.dto';
import { FilterDto } from '../../contexts/filterContext';
import { PaginationDto } from '../dtos/pagination.dto';
import { CreateNpcDto, UpdateNpcDto } from '../dtos/api-requests.dto';

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
    })
    .catch((err) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw err;
    }),

  getUsers: (): Promise<Array<UserDto>> => protectedApi
    .get<Array<UserDto>>('/users')
    .then((res) => res.data),

  getNpcs: (filter: FilterDto, pagination: PaginationDto): Promise<NpcsPaginatedDto> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clearedFilter = Object.fromEntries(Object.entries(filter).filter(([_, v]) => !!v));
    const query: PaginationDto = { ...pagination, filter: clearedFilter };
    const queryStr = qs.stringify(query);
    return protectedApi
      .get<NpcsPaginatedDto>(`/npcs${queryStr ? `?${queryStr}` : ''}`)
      .then((res) => res.data);
  },

  createNpc: (data: CreateNpcDto): Promise<NpcDto> => {
    const formData = new FormData();
    formData.append('file', data.file as File);
    if (data.age) {
      formData.append('age', data.age);
    }
    if (data.class.length > 0) {
      data.class
        .forEach((c) => formData.append('class[]', c.trim()));
    }
    if (data.culture) {
      formData.append('culture', data.culture);
    }
    if (data.gender) {
      formData.append('gender', data.gender);
    }
    if (data.race) {
      formData.append('race', data.race);
    }

    return protectedApi
      .post('/npcs', formData)
      .then((res) => res.data);
  },

  updateNpc: (npcId: number, data: UpdateNpcDto): Promise<NpcDto> => protectedApi
    .put(`/npcs/${npcId}`, data)
    .then((res) => res.data),

  deleteNpc: (npcId: number): Promise<null> => protectedApi
    .delete(`/npcs/${npcId}`),

  getAvailableClasses: (filter?: string): Promise<Array<string>> => protectedApi
    .get<Array<string>>('/npcs/classes', { params: { filter } })
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
    }).catch(() => {});
  }

  return Promise.reject(error);
});

export default api;
