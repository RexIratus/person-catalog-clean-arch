import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { PersonList } from './pages/PersonList';
import { PersonaForm } from './pages/PersonaForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Rutas CRUD */}
          <Route path="personas" element={<PersonList />} />
          <Route path="personas/crear" element={<PersonaForm />} />
          <Route path="personas/editar/:id" element={<PersonaForm />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;