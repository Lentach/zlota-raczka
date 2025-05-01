import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceRequestProvider } from './contexts/ServiceRequestContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ServiceRequestList from './components/requests/ServiceRequestList';
import ServiceRequestForm from './components/requests/ServiceRequestForm';
import ServiceRequestDetails from './components/requests/ServiceRequestDetails';
import Unauthorized from './components/auth/Unauthorized';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <ServiceRequestProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ServiceRequestList />
              </ProtectedRoute>
            } />
            <Route path="/new-request" element={
              <ProtectedRoute>
                <ServiceRequestForm />
              </ProtectedRoute>
            } />
            <Route path="/requests/:id" element={
              <ProtectedRoute>
                <ServiceRequestDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </ServiceRequestProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App; 