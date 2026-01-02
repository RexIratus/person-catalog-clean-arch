import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAllPersons } from '../personService';

// Mock de Axios para no hacer llamadas reales a la red
vi.mock('axios');

describe('personService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener la lista de personas correctamente', async () => {
    const mockData = [
      { id: 1, name: 'Juan Perez', email: 'juan@example.com' },
      { id: 2, name: 'Maria Lopez', email: 'maria@example.com' }
    ];

    // Simulamos que axios.get devuelve estos datos
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getAllPersons();

    expect(axios.get).toHaveBeenCalledTimes(1);
    // Verifica que se llame al endpoint correcto (asumiendo la ruta base configurada)
    expect(axios.get).toHaveBeenCalledWith('/persons'); 
    expect(result).toEqual(mockData);
  });

  it('debe manejar errores cuando la API falla', async () => {
    const errorMessage = 'Error de red';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(getAllPersons()).rejects.toThrow(errorMessage);
  });
});