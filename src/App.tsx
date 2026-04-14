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

