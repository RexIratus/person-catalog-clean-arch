import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Persona } from '../types/Persona';
import { Edit2, Trash2, Plus, Search, Loader2, RefreshCcw, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PersonList = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [genderFilter, setGenderFilter] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState('');

  const cargarPersonas = () => {
    setLoading(true);
    api.get('/Personas')
      .then(res => setPersonas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  // Lógica de Desactivar
  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Desactivar a ${nombre}?`)) return;
    try {
      await api.delete(`/Personas/${id}`);
      setPersonas(prev => prev.map(p => p.id === id ? { ...p, activo: false } : p));
    } catch (error) {
      alert('Error al desactivar');
    }
  };

  // Lógica de botón para reactivar
  const handleReactivate = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Reactivar a ${nombre}?`)) return;
    try {
      await api.put(`/Personas/${id}/reactivate`);
      setPersonas(prev => prev.map(p => p.id === id ? { ...p, activo: true } : p));
    } catch (error) {
      alert('Error al reactivar');
    }
  };

  // Lógica de filtros de búsqueda
  const filteredPersonas = personas.filter(p => {
    // 1. Filtro de Activos/Inactivos
    if (showInactive ? p.activo : !p.activo) return false;

    // 2. Filtro de Género
    if (genderFilter && p.genero !== genderFilter) return false;

    // 3. Filtro de Estado Civil
    if (maritalStatusFilter) {
      // Usamos la raíz de la palabra para cubrir variaciones (ej: "Solter" cubre "Soltero" y "Soltera")
      const rootState = maritalStatusFilter.slice(0, -1); 
      if (!p.estadoCivil?.startsWith(rootState)) return false;
    }

    // 4. Búsqueda Global (Busca texto en todos los valores del objeto)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Concatenamos los campos relevantes para buscar en un solo string
      const fullString = `${p.nombre} ${p.apellido} ${p.email} ${p.telefono} ${p.direccion}`.toLowerCase();
      return fullString.includes(searchLower);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Catálogo de Personas</h1>
          <p className="text-gray-500">Gestión avanzada de registros</p>
        </div>
        <Link to="/personas/crear" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
          <Plus size={20} /> Nuevo Registro
        </Link>
      </div>

      {/* Barra de Herramientas (Buscador + Filtros) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        
        {/* Buscador */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg w-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo, teléfono, dirección..." 
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
            <select 
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 appearance-none w-full md:w-40"
            >
              <option value="">Todos (Género)</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
            <select 
              value={maritalStatusFilter}
              onChange={(e) => setMaritalStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 appearance-none w-full md:w-40"
            >
              <option value="">Todos (Est. Civil)</option>
              <option value="Soltero">Soltero(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="Divorciado">Divorciado(a)</option>
              <option value="Viudo">Viudo(a)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Mostrar Inactivos</span>
          </label>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <span className="text-gray-400 text-sm">Cargando datos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPersonas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search size={48} className="opacity-20" />
                      <p>No se encontraron registros con esos criterios.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredPersonas.map((persona) => (
                    <motion.tr 
                      key={persona.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-blue-50/30 transition-colors ${!persona.activo ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{persona.nombre} {persona.apellido}</div>
                        <div className="text-xs text-gray-500 flex gap-2 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{persona.genero}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{persona.estadoCivil}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono">{persona.email}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{persona.telefono}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs" title={persona.direccion}>
                        {persona.direccion}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          persona.activo 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${persona.activo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {persona.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Arreglo visual de campo */}
                        <div className="flex justify-end items-center gap-2">
                          <Link 
                            to={`/personas/editar/${persona.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          
                          {persona.activo ? (
                            <button 
                              onClick={() => handleDelete(persona.id, persona.nombre)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" 
                              title="Desactivar"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleReactivate(persona.id, persona.nombre)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                              title="Reactivar"
                            >
                              <RefreshCcw size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <span>Mostrando {filteredPersonas.length} registros</span>
          <span>Total de Registros: {personas.length}</span>
        </div>
      </div>
    </div>
  );
};