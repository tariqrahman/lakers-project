const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment ? 'http://localhost:3001' : ''; 