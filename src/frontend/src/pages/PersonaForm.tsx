import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import type { PersonaFormValues } from '../types/Persona';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMask } from '@react-input/mask';

// Lista de países para el selector de código de área
const paises = [
  { codigo: '505', nombre: 'Nicaragua',    bandera: '🇳🇮', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '506', nombre: 'Costa Rica',   bandera: '🇨🇷', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '503', nombre: 'El Salvador',  bandera: '🇸🇻', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '504', nombre: 'Honduras',     bandera: '🇭🇳', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '502', nombre: 'Guatemala',    bandera: '🇬🇹', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '507', nombre: 'Panamá',       bandera: '🇵🇦', mask: '____-____',      placeholder: '0000-0000',      regex: /^\d{4}-\d{4}$/ },
  { codigo: '52',  nombre: 'México',       bandera: '🇲🇽', mask: '__-____-____',  placeholder: '00-0000-0000',  regex: /^\d{2}-\d{4}-\d{4}$/ },
  { codigo: '1',   nombre: 'EE.UU./Canadá',bandera: '🇨🇦 🇺🇸', mask: '(___) ___-____', placeholder: '(000) 000-0000', regex: /^\(\d{3}\) \d{3}-\d{4}$/ },
];

// Esquema de Validación
const schema = yup.object({
  nombre: yup.string()
    .required('El nombre es requerido')
    .max(100)
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, 'No se permiten números ni símbolos'),
  apellido: yup.string()
    .required('El apellido es requerido')
    .max(100)
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, 'No se permiten números ni símbolos'),
  email: yup.string()
    .required('Requerido')
    .email('Email inválido')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Debe incluir un dominio válido (ej: .com)'),
  fechaNacimiento: yup.string()
    .required('Fecha requerida')
    .test('not-future', 'No puede ser una fecha futura', val => !val || new Date(val) <= new Date()),
  codigoPais: yup.string().required('Seleccione un país'),
  numeroTelefono: yup.string().required('El número es requerido').test('formato-valido', 'El formato del número no es válido para el país.', function(value) {
    const { codigoPais } = this.parent;
    if (!value || !codigoPais) return true;

    const pais = paises.find(p => p.codigo === codigoPais);
    if (!pais) return false;
    return pais.regex.test(value);
  }),
  direccion: yup.string()
    .required('Requerido')
    .min(10, 'La dirección debe ser más descriptiva (mín. 10 letras)'),
  genero: yup.string().required('Seleccione género'),
  estadoCivil: yup.string().required('Seleccione estado civil'),
}).required();

// Tipo para los valores del formulario, separando el teléfono
type PersonaFormData = Omit<PersonaFormValues, 'telefono'> & {
  codigoPais: string;
  numeroTelefono: string;
};

export const PersonaForm = () => {
  const { id } = useParams(); // Si hay ID, es edición
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PersonaFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { codigoPais: '505' }
  });

  const selectedCodigoPais = watch('codigoPais');
  const paisSeleccionado = paises.find(p => p.codigo === selectedCodigoPais) || paises[0];
  const phoneMaskRef = useMask({ mask: paisSeleccionado.mask, replacement: { _: /\d/ } });
  const { ref: numeroTelefonoFormRef, ...numeroTelefonoProps } = register('numeroTelefono');

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get('/Personas')
      .then(res => {
          const persona = res.data.find((p: any) => p.id === Number(id));
          if (persona) {
            // Formatear fecha para el input type="date" (YYYY-MM-DD)
            const dateStr = persona.fechaNacimiento.split('T')[0];
            
            setValue('nombre', persona.nombre);
            setValue('apellido', persona.apellido);
            setValue('email', persona.email);
            setValue('fechaNacimiento', dateStr);
            
            // Parsear teléfono para separar código y número
            const telRegex = /\((\d+)\)\s*(.*)/;
            const telMatch = persona.telefono?.match(telRegex);
            if (telMatch) {
              setValue('codigoPais', telMatch[1], { shouldValidate: false });
              setValue('numeroTelefono', telMatch[2], { shouldValidate: false });
            }

            setValue('direccion', persona.direccion);
            setValue('genero', persona.genero);           
            // Normalizamos estado civil para el select (si viene "Soltera" lo pasamos a "Soltero" para que el UI lo reconozca)
            const estadoNormalizado = persona.estadoCivil.endsWith('a') ? persona.estadoCivil.slice(0, -1) + 'o' : persona.estadoCivil;
            setValue('estadoCivil', estadoNormalizado);
          } else {
            // Si no se encuentra la persona, lanzamos un error para que lo capture el catch
            throw new Error(`No se encontró la persona con el ID: ${id}`);
          }
      })
      .catch(error => {
        console.error("Error al cargar los datos de la persona:", error);
        alert("No se pudo cargar la información para la edición.");
        navigate('/personas');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // Para formularios nuevos, establecemos un país por defecto
      setValue('codigoPais', '505');
    }
  }, [id, isEdit, setValue, navigate]);

  const onSubmit = async (data: PersonaFormData) => {
    setLoading(true);
    try {
      // Se ajusta la gramática del estado civil según género
      let estadoCivilFinal = data.estadoCivil;
      if (data.genero === 'Femenino') {
        // Si es femenino, cambiamos la terminación 'o' por 'a' (ej: Soltero -> Soltera)
        estadoCivilFinal = estadoCivilFinal.replace(/o$/, 'a');
      }
      const telefonoCompleto = `(${data.codigoPais}) ${data.numeroTelefono.trim()}`;

      const payload: PersonaFormValues = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        fechaNacimiento: data.fechaNacimiento,
        telefono: telefonoCompleto,
        direccion: data.direccion,
        genero: data.genero,
        estadoCivil: estadoCivilFinal,
      };

      if (isEdit) {
        await api.put(`/Personas/${id}`, { id: Number(id), ...payload });
        alert('Actualizado correctamente');
      } else {
        await api.post('/Personas', payload);
        alert('Creado correctamente');
      }
      navigate('/personas');
    } catch (error: any) {
      console.error(error);
      alert('Error al guardar: ' + (error.response?.data?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Editar Persona' : 'Registrar Nueva Persona'}
        </h2>
        <button onClick={() => navigate('/personas')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <ArrowLeft size={20} /> Volver
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input {...register('nombre')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            <p className="text-red-500 text-xs mt-1">{errors.nombre?.message}</p>
          </div>
          
          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input {...register('apellido')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <p className="text-red-500 text-xs mt-1">{errors.apellido?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="flex gap-2">
              <div className="w-2/5 md:w-1/3">
                <select 
                  {...register('codigoPais')} 
                  onChange={(e) => {
                    register('codigoPais').onChange(e); // Comportamiento por defecto de RHF
                    setValue('numeroTelefono', '', { shouldValidate: true }); // Limpiar campo de teléfono
                  }}
                  className="w-full h-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none text-center">
                  {paises.map(p => (
                    <option key={p.codigo} value={p.codigo}>{p.bandera} +{p.codigo}</option>
                  ))}
                </select>
              </div>
              <div className="w-3/5 md:w-2/3">
                <input
                  {...numeroTelefonoProps}
                  ref={(el) => {
                    numeroTelefonoFormRef(el);
                    if (el) {
                      phoneMaskRef.current = el;
                    }
                  }}
                  placeholder={paisSeleccionado.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
            <p className="text-red-500 text-xs mt-1">{errors.codigoPais?.message || errors.numeroTelefono?.message}</p>
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input type="date" {...register('fechaNacimiento')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento?.message}</p>
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select {...register('genero')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.genero?.message}</p>
          </div>

          {/* Estado Civil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
            <select {...register('estadoCivil')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Seleccione...</option>
              <option value="Soltero">Soltero(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="Divorciado">Divorciado(a)</option>
              <option value="Viudo">Viudo(a)</option>
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.estadoCivil?.message}</p>
          </div>

          {/* Dirección (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea {...register('direccion')} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <p className="text-red-500 text-xs mt-1">{errors.direccion?.message}</p>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isEdit ? 'Actualizar Datos' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};