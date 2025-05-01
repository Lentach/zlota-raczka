import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceRequestList from '../ServiceRequestList';
import { ServiceRequestProvider } from '../../../contexts/ServiceRequestContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { WebSocketProvider } from '../../../contexts/WebSocketContext';

// Mock the contexts
jest.mock('../../../contexts/ServiceRequestContext', () => ({
  ServiceRequestProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="service-request-provider">{children}</div>,
  useServiceRequest: () => ({
    requests: [
      {
        _id: '1',
        description: 'Test request 1',
        location: 'Location 1',
        contact: 'Contact 1',
        category: 'plumbing',
        priority: 'low',
        status: 'New',
        clientId: 'client1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        description: 'Test request 2',
        location: 'Location 2',
        contact: 'Contact 2',
        category: 'electrical',
        priority: 'high',
        status: 'InProgress',
        clientId: 'client1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    loading: false,
    error: null,
    getRequests: jest.fn()
  })
}));

jest.mock('../../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    user: { id: 'client1', role: 'client' }
  })
}));

jest.mock('../../../contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="websocket-provider">{children}</div>,
  useWebSocket: () => ({
    socket: null,
    connected: false
  })
}));

describe('ServiceRequestList', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
            <ServiceRequestProvider>
              <ServiceRequestList />
            </ServiceRequestProvider>
          </WebSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the service request list', () => {
    renderComponent();

    // Check if the requests are rendered
    expect(screen.getByText('Test request 1')).toBeInTheDocument();
    expect(screen.getByText('Test request 2')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();
  });

  it('filters requests by status', () => {
    renderComponent();

    // Open status filter
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'InProgress' } });

    // Check if only InProgress requests are shown
    expect(screen.queryByText('Test request 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test request 2')).toBeInTheDocument();
  });

  it('filters requests by category', () => {
    renderComponent();

    // Open category filter
    const categoryFilter = screen.getByLabelText('Category');
    fireEvent.change(categoryFilter, { target: { value: 'plumbing' } });

    // Check if only plumbing requests are shown
    expect(screen.getByText('Test request 1')).toBeInTheDocument();
    expect(screen.queryByText('Test request 2')).not.toBeInTheDocument();
  });

  it('filters requests by priority', () => {
    renderComponent();

    // Open priority filter
    const priorityFilter = screen.getByLabelText('Priority');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    // Check if only high priority requests are shown
    expect(screen.queryByText('Test request 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test request 2')).toBeInTheDocument();
  });

  it('searches requests by description', () => {
    renderComponent();

    // Type in search box
    const searchInput = screen.getByPlaceholderText('Szukaj w opisie, lokalizacji...');
    fireEvent.change(searchInput, { target: { value: 'Test request 1' } });

    // Check if only matching requests are shown
    expect(screen.getByText('Test request 1')).toBeInTheDocument();
    expect(screen.queryByText('Test request 2')).not.toBeInTheDocument();
  });

  it('clears all filters', () => {
    renderComponent();

    // Apply some filters
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'InProgress' } });

    // Click clear filters button
    const clearButton = screen.getByText('Wyczyść filtry');
    fireEvent.click(clearButton);

    // Check if all requests are shown again
    expect(screen.getByText('Test request 1')).toBeInTheDocument();
    expect(screen.getByText('Test request 2')).toBeInTheDocument();
  });
}); 