const isDevelopment = import.meta.env.DEV;

// In production, API calls will be made to the same domain
export const API_URL = isDevelopment ? 'http://localhost:3001' : ''; 