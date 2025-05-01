import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';

interface ServiceRequest {
  _id: string;
  description: string;
  location: string;
  contact: string;
  category: 'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'New' | 'InProgress' | 'Completed' | 'Cancelled';
  clientId: string;
  handymanId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceRequestContextType {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  createRequest: (data: Partial<ServiceRequest>) => Promise<ServiceRequest>;
  getRequests: () => Promise<void>;
  getRequest: (id: string) => Promise<ServiceRequest>;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => Promise<ServiceRequest>;
}

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined);

export const useServiceRequest = () => {
  const context = useContext(ServiceRequestContext);
  if (!context) {
    throw new Error('useServiceRequest must be used within a ServiceRequestProvider');
  }
  return context;
};

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { socket } = useWebSocket();

  const createRequest = async (data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ServiceRequest>('http://localhost:5000/api/requests', data);
      setRequests(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ServiceRequest[]>('http://localhost:5000/api/requests');
      setRequests(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching requests';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRequest = async (id: string): Promise<ServiceRequest> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ServiceRequest>(`http://localhost:5000/api/requests/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<ServiceRequest>(`http://localhost:5000/api/requests/${id}`, data);
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket event handlers
  React.useEffect(() => {
    if (socket) {
      socket.on('requestCreated', (newRequest: ServiceRequest) => {
        console.log('WebSocket: New request created:', newRequest);
        setRequests(prev => [newRequest, ...prev]);
      });

      socket.on('requestUpdated', (updatedRequest: ServiceRequest) => {
        console.log('WebSocket: Request updated:', updatedRequest);
        setRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req));
      });

      socket.on('requestDeleted', (deletedId: string) => {
        console.log('WebSocket: Request deleted:', deletedId);
        setRequests(prev => prev.filter(req => req._id !== deletedId));
      });

      return () => {
        socket.off('requestCreated');
        socket.off('requestUpdated');
        socket.off('requestDeleted');
      };
    }
  }, [socket]);

  return (
    <ServiceRequestContext.Provider
      value={{
        requests,
        loading,
        error,
        createRequest,
        getRequests,
        getRequest,
        updateRequest
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
}; 