import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Menu, X, LogOut } from 'lucide-react';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/personas', label: 'Catálogo', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <img src="/logo.png" alt="PersonCatalog" className="h-8 w-auto object-contain" />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:relative z-40 w-64 bg-slate-900 text-white h-screen transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6">
          <img src="/logo.png" alt="Gestor de Personas" className="h-10 w-auto object-contain mb-2" />
          <p className="text-xs text-gray-400 mt-1">MVP de Gestor de Personas</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                <span className="font-medium">{item.label}</span>
                {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <button 
                onClick={() => {
                    if(confirm('¿Desea recargar la sesión actual?')) {
                    window.location.href = '/login-fake';
                    }
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors"
                >
                <LogOut size={18} />
                <span>Refrescar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Desktop */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 hidden md:flex items-center px-8 justify-between sticky top-0 z-20">
          <h2 className="text-lg font-semibold text-gray-700">
            {navItems.find(i => i.path === location.pathname)?.label || 'Portal'}
          </h2>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Argel Alfaro</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <img
              src="/avatar.jpg"
              alt="Argel Alfaro"
              className="w-9 h-9 rounded-full object-cover shadow-md border border-gray-200 bg-gray-100"
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-8">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};