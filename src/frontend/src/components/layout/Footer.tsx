import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026. Prueba Técnica.</p>
        <div className="flex items-center gap-1 mt-2 md:mt-0">
          <span>Desarrollado para Paynau</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span>por Argel Alfaro</span>
        </div>
      </div>
    </footer>
  );
};