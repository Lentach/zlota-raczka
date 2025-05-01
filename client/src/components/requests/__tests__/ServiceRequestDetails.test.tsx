import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceRequestDetails from '../ServiceRequestDetails';
import { ServiceRequestProvider } from '../../../contexts/ServiceRequestContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { WebSocketProvider } from '../../../contexts/WebSocketContext';

// Mock react-router-dom's useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

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
      }
    ],
    loading: false,
    error: null,
    getRequest: jest.fn().mockResolvedValue({
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
    }),
    updateRequest: jest.fn().mockResolvedValue({
      _id: '1',
      description: 'Test request 1',
      location: 'Location 1',
      contact: 'Contact 1',
      category: 'plumbing',
      priority: 'low',
      status: 'InProgress',
      clientId: 'client1',
      handymanId: 'handyman1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })
}));

jest.mock('../../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    user: { id: 'handyman1', role: 'handyman' }
  })
}));

jest.mock('../../../contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="websocket-provider">{children}</div>,
  useWebSocket: () => ({
    socket: null,
    connected: false
  })
}));

describe('ServiceRequestDetails', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
            <ServiceRequestProvider>
              <ServiceRequestDetails />
            </ServiceRequestProvider>
          </WebSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the service request details', async () => {
    renderComponent();

    // Check if the request details are rendered
    await waitFor(() => {
      expect(screen.getByText('Test request 1')).toBeInTheDocument();
      expect(screen.getByText('Location 1')).toBeInTheDocument();
      expect(screen.getByText('Contact 1')).toBeInTheDocument();
      expect(screen.getByText('Hydraulika')).toBeInTheDocument();
      expect(screen.getByText(/Niski/)).toBeInTheDocument();
      expect(screen.getByText('Nowe')).toBeInTheDocument();
    });
  });

  it('allows handyman to accept request', async () => {
    renderComponent();

    // Wait for the request details to load
    await waitFor(() => {
      expect(screen.getByText('Test request 1')).toBeInTheDocument();
    });

    // Find and click the accept button
    const acceptButton = screen.getByText('Rozpocznij pracę');
    fireEvent.click(acceptButton);

    // Check if the request status is updated
    await waitFor(() => {
      expect(screen.getByText('W trakcie')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    // Mock loading state
    jest.spyOn(require('../../../contexts/ServiceRequestContext'), 'useServiceRequest').mockImplementation(() => ({
      loading: true,
      error: null,
      getRequest: jest.fn(),
      updateRequest: jest.fn()
    }));

    renderComponent();

    // Check for loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // Mock error state
    jest.spyOn(require('../../../contexts/ServiceRequestContext'), 'useServiceRequest').mockImplementation(() => ({
      loading: false,
      error: 'Failed to load request',
      getRequest: jest.fn(),
      updateRequest: jest.fn()
    }));

    renderComponent();

    expect(screen.getByText('Failed to load request')).toBeInTheDocument();
  });
}); 