import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceRequestForm from '../ServiceRequestForm';
import { ServiceRequestProvider } from '../../../contexts/ServiceRequestContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { WebSocketProvider } from '../../../contexts/WebSocketContext';

// Mock the contexts
jest.mock('../../../contexts/ServiceRequestContext', () => ({
  ServiceRequestProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="service-request-provider">{children}</div>,
  useServiceRequest: () => ({
    loading: false,
    error: null,
    createRequest: jest.fn().mockResolvedValue({
      _id: '1',
      description: 'Test request',
      location: 'Test location',
      contact: 'Test contact',
      category: 'plumbing',
      priority: 'low',
      status: 'New',
      clientId: 'client1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
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

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ServiceRequestForm', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
            <ServiceRequestProvider>
              <ServiceRequestForm />
            </ServiceRequestProvider>
          </WebSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('Opis problemu')).toBeInTheDocument();
    expect(screen.getByLabelText('Lokalizacja')).toBeInTheDocument();
    expect(screen.getByLabelText('Kontakt')).toBeInTheDocument();
    expect(screen.getByLabelText('Kategoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Priorytet')).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    renderComponent();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Opis problemu'), {
      target: { value: 'Test request' }
    });
    fireEvent.change(screen.getByLabelText('Lokalizacja'), {
      target: { value: 'Test location' }
    });
    fireEvent.change(screen.getByLabelText('Kontakt'), {
      target: { value: 'Test contact' }
    });
    fireEvent.change(screen.getByLabelText('Kategoria'), {
      target: { value: 'plumbing' }
    });
    fireEvent.change(screen.getByLabelText('Priorytet'), {
      target: { value: 'low' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Wyślij zgłoszenie'));

    // Check if navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows validation errors for empty fields', async () => {
    renderComponent();

    // Submit form without filling in any fields
    fireEvent.click(screen.getByText('Wyślij zgłoszenie'));

    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText('Wypełnij wszystkie wymagane pola')).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    // Mock loading state
    jest.spyOn(require('../../../contexts/ServiceRequestContext'), 'useServiceRequest').mockImplementation(() => ({
      loading: true,
      error: null,
      createRequest: jest.fn()
    }));

    renderComponent();

    // Check for loading state
    expect(screen.getByText('Wysyłanie...')).toBeInTheDocument();
    expect(screen.getByText('Wysyłanie...')).toBeDisabled();
  });

  it('shows error state after failed submission', async () => {
    // Mock error state
    const mockCreateRequest = jest.fn().mockRejectedValue(new Error('Nie udało się utworzyć zgłoszenia'));
    jest.spyOn(require('../../../contexts/ServiceRequestContext'), 'useServiceRequest').mockImplementation(() => ({
      loading: false,
      error: 'Nie udało się utworzyć zgłoszenia',
      createRequest: mockCreateRequest
    }));

    renderComponent();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Opis problemu'), {
      target: { value: 'Test request' }
    });
    fireEvent.change(screen.getByLabelText('Lokalizacja'), {
      target: { value: 'Test location' }
    });
    fireEvent.change(screen.getByLabelText('Kontakt'), {
      target: { value: 'Test contact' }
    });
    fireEvent.change(screen.getByLabelText('Kategoria'), {
      target: { value: 'plumbing' }
    });
    fireEvent.change(screen.getByLabelText('Priorytet'), {
      target: { value: 'low' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Wyślij zgłoszenie'));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Nie udało się utworzyć zgłoszenia')).toBeInTheDocument();
    });
  });
}); 