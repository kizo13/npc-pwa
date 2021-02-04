import axios from 'axios';
import { LoginResponseDto } from '../dtos/login-response.dto';

const API_URL = process.env.REACT_APP_API_URL;

const api = {
  login: (email: string, password: string): Promise<LoginResponseDto> => axios
    .post<LoginResponseDto>(`${API_URL}/auth/login`, { email, password })
    .then(res => res.data)
}

export default api;
