// lib/gestionesAPI.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API = axios.create({
  baseURL: 'http://18.216.126.104/api',
  timeout: 15000,
});

/** Inyecta el token en el header Authorization */
export async function setAuthTokenFromStorage() {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
}

/** LOGIN: guarda token y prepara cliente */
export async function login(email, password) {
  const { data } = await API.post('/login', { email, password });
  // Intenta obtener el token con varias llaves comunes
  const token = data?.token || data?.access_token || data?.data?.token;
  if (!token) throw new Error('No se recibió token de autenticación');

  await AsyncStorage.setItem('token', token);
  await setAuthTokenFromStorage();
  return data;
}

/** LISTAR PROYECTOS (requiere token) */
export async function getProjects() {
  await setAuthTokenFromStorage();
  const { data } = await API.get('/projects');
  return data;
}

/** LOGOUT opcional */
export async function logout() {
  await setAuthTokenFromStorage();
  try { await API.post('/logout'); } catch {}
  await AsyncStorage.removeItem('token');
  delete API.defaults.headers.common.Authorization;
}
