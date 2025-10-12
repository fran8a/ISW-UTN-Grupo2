import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrarUsuario = async (email, contraseña) => {
  try {
    const response = await api.post('/registro', { email, contraseña });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Error al registrar usuario';
  }
};

export const iniciarSesion = async (email, contraseña) => {
  try {
    const response = await api.post('/login', { email, contraseña });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Error al iniciar sesión';
  }
};

export const comprarEntradas = async (email, fechaVisita, edadesVisitantes, formaPago) => {
  try {
    const response = await api.post('/comprar-entradas', {
      email,
      fecha_visita: fechaVisita,
      edades_visitantes: edadesVisitantes,
      forma_pago: formaPago
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Error al comprar entradas';
  }
};

export const obtenerPrecios = async () => {
  try {
    const response = await api.get('/precios');
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Error al obtener precios';
  }
};