import axios from 'axios';

// Obtiene la lista de personas desde el backend
export const getAllPersons = async () => {
  const response = await axios.get('/persons');
  return response.data;
};