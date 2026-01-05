import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Menu, X, LogOut, Github, Linkedin } from 'lucide-react';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/personas', label: 'Catálogo', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-30">
        <img src="/logo.png" alt="PersonCatalog" className="h-9 w-auto object-contain" />
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:relative z-50 w-64 bg-slate-900 text-white h-screen transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* --- Sidebar Header --- */}
        {/* Mobile: Logo + Close Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 md:hidden">
          <img src="/logo.png" alt="PersonCatalog" className="h-9 w-auto object-contain" />
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        {/* Desktop: Logo + Text */}
        <div className="hidden md:block p-6 text-center">
          <img src="/logo.png" alt="Gestor de Personas" className="h-12 w-auto object-contain mx-auto mb-2" />
          <p className="text-xs text-gray-400 mt-1">MVP de Gestor de Personas</p>
        </div>

        <nav className="mt-4 px-2 space-y-1">
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

        <div className="absolute bottom-0 w-full border-t border-slate-800">
            {/* Mobile User Info */}
            <div className="p-4 md:hidden border-b border-slate-800">
              <div className="flex items-center gap-3">
                  <img
                      src="/avatar.jpg"
                      alt="Argel Alfaro"
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                  />
                  <div>
                      <p className="font-semibold text-white">Argel Alfaro</p>
                      <p className="text-xs text-gray-400">Full-Stack Developer</p>
                  </div>
              </div>
              <div className="flex items-center justify-around mt-4 pt-4 border-t border-slate-700">
                  <a href="https://www.linkedin.com/in/aalfaro0895/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><Linkedin size={20}/></a>
                  <a href="https://github.com/RexIratus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={20}/></a>
              </div>
            </div>

            <div className="p-2">
              <button 
                  onClick={() => {
                      if(confirm('¿Desea recargar la sesión actual?')) {
                      window.location.href = '/login-fake';
                      }
                  }}
                  className="flex items-center gap-3 text-gray-400 hover:bg-slate-800 hover:text-white w-full px-3 py-3 transition-colors rounded-lg"
                  >
                  <LogOut size={18} />
                  <span className="font-medium">Refrescar Sesión</span>
              </button>
            </div>
        </div>
      </aside>

      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
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
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="text-center hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Argel Alfaro</p>
                <p className="text-xs text-gray-500">Full-Stack Developer</p>
              </div>
              <img
                src="/avatar.jpg"
                alt="Argel Alfaro"
                className="w-9 h-9 rounded-full object-cover shadow-md border border-gray-200 bg-gray-100"
              />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-slate-900/10 border border-gray-100 origin-top-right z-30"
                >
                  <div className="p-2">
                    <a href="https://www.linkedin.com/in/aalfaro0895/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Linkedin size={16} className="text-blue-700" />
                      <span>Visitar mi LinkedIn</span>
                    </a>
                    <a href="https://github.com/RexIratus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Github size={16} className="text-gray-800" />
                      <span>Ver mi GitHub</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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