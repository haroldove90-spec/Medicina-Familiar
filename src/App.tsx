/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicalLayout from './components/MedicalLayout';
import Dashboard from './pages/Dashboard';
import MedicalNote from './pages/MedicalNote';
import AuditLog from './pages/AuditLog';
import Login from './pages/Login';
import Expedientes from './pages/Expedientes';
import Agenda from './pages/Agenda';
import Medicos from './pages/Medicos';
import Biblioteca from './pages/Biblioteca';
import Cargos from './pages/Cargos';
import Cobros from './pages/Cobros';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Dashboard />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/expedientes" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Expedientes />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/agenda" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Agenda />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/medicos" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Medicos />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/biblioteca" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Biblioteca />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/cargos" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Cargos />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/cobros" element={
        isAuthenticated ? (
          <MedicalLayout>
            <Cobros />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/notes" element={
        isAuthenticated ? (
          <MedicalLayout>
            <MedicalNote />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/audit" element={
        isAuthenticated ? (
          <MedicalLayout>
            <AuditLog />
          </MedicalLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

