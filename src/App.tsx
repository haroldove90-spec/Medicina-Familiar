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

export default function App() {
  // Simple auth simulation
  const isAuthenticated = true; 

  return (
    <Router>
      <Toaster position="top-right" richColors />
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
          <MedicalLayout>
            <Expedientes />
          </MedicalLayout>
        } />

        <Route path="/agenda" element={
          <MedicalLayout>
            <Agenda />
          </MedicalLayout>
        } />

        <Route path="/medicos" element={
          <MedicalLayout>
            <Medicos />
          </MedicalLayout>
        } />

        <Route path="/biblioteca" element={
          <MedicalLayout>
            <Biblioteca />
          </MedicalLayout>
        } />

        <Route path="/cargos" element={
          <MedicalLayout>
            <Cargos />
          </MedicalLayout>
        } />

        <Route path="/cobros" element={
          <MedicalLayout>
            <Cobros />
          </MedicalLayout>
        } />

        <Route path="/notes" element={
          <MedicalLayout>
            <MedicalNote />
          </MedicalLayout>
        } />

        <Route path="/audit" element={
          <MedicalLayout>
            <AuditLog />
          </MedicalLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

