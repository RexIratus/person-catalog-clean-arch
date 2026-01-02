import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface Estadisticas {
  total: number;
  activos: number;
  inactivos: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulamos un pequeño delay para ver la animación de carga
    api.get('/Personas/estadisticas')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        setError('No se pudo conectar con el servidor.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-96 justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !stats) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center">
      {error || 'Error desconocido'}
    </div>
  );

  const data = [
    { name: 'Activos', value: stats.activos, color: '#10b981' }, // Emerald 500
    { name: 'Inactivos', value: stats.inactivos, color: '#ef4444' }, // Red 500
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen en tiempo real del sistema</p>
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <Activity size={16} className="text-green-500 animate-pulse" />
          Sistema Operativo
        </div>
      </div>
      
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Registrados" 
          value={stats.total} 
          icon={Users} 
          color="bg-blue-500" 
          delay={0} 
        />
        <MetricCard 
          title="Usuarios Activos" 
          value={stats.activos} 
          icon={UserCheck} 
          color="bg-emerald-500" 
          delay={0.1} 
        />
        <MetricCard 
          title="Inactivos / Eliminados" 
          value={stats.inactivos} 
          icon={UserX} 
          color="bg-rose-500" 
          delay={0.2} 
        />
      </div>

      {/* Gráfico y Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">Distribución de Estado</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center text-center">
          <div className="p-4 bg-white/10 rounded-full mb-4">
            <Activity size={32} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Estado del Sistema</h3>
          <p className="text-gray-400 mb-6 max-w-xs">
            La base de datos está respondiendo correctamente. Los servicios de backend (API .NET 8) y persistencia (MySQL) están operativos.
          </p>
          <div className="flex gap-4 text-sm font-mono">
            <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded border border-green-500/30">
              API: Online
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              DB: Connected
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente auxiliar para tarjeta
const MetricCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: delay + 0.2 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${color}`} />
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-4xl font-bold text-gray-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl text-white shadow-md ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);