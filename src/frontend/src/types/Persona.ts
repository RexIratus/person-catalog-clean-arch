export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // Se recibe como string ISO desde la API
  email: string;
  telefono: string;
  direccion: string;
  genero: string;
  estadoCivil: string;
  activo: boolean;
  rowVersion: string;
}

// Para el formulario de creación
export type PersonaFormValues = Omit<Persona, 'id' | 'activo' | 'rowVersion'>;