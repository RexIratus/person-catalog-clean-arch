import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePersons } from '../usePersons';
import * as personService from '../../services/personService';

// Mock del servicio para aislar el hook
vi.mock('../../services/personService');

describe('usePersons Hook', () => {
  it('debe retornar el estado inicial de carga', () => {
    // Simulamos una promesa pendiente para verificar el estado inicial
    personService.getAllPersons.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePersons());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('debe cargar los datos exitosamente', async () => {
    const mockPersons = [{ id: 1, name: 'Test User' }];
    personService.getAllPersons.mockResolvedValue(mockPersons);

    const { result } = renderHook(() => usePersons());

    // Esperamos a que loading sea false
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockPersons);
    expect(result.current.error).toBe(null);
  });

  it('debe manejar errores del servicio', async () => {
    const mockError = new Error('Fallo al cargar');
    personService.getAllPersons.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePersons());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toEqual([]);
  });
});