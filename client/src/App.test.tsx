import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the context providers
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({ user: null })
}));

jest.mock('./contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="websocket-provider">{children}</div>
}));

jest.mock('./contexts/ServiceRequestContext', () => ({
  ServiceRequestProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="service-request-provider">{children}</div>
}));

// Mock the components
jest.mock('./components/auth/Login', () => () => <div data-testid="login">Login Component</div>);
jest.mock('./components/auth/Register', () => () => <div data-testid="register">Register Component</div>);
jest.mock('./components/auth/Unauthorized', () => () => <div data-testid="unauthorized">Unauthorized Component</div>);
jest.mock('./components/requests/ServiceRequestList', () => () => <div data-testid="service-request-list">ServiceRequestList Component</div>);
jest.mock('./components/requests/ServiceRequestForm', () => () => <div data-testid="service-request-form">ServiceRequestForm Component</div>);
jest.mock('./components/requests/ServiceRequestDetails', () => () => <div data-testid="service-request-details">ServiceRequestDetails Component</div>);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>
}));

describe('App', () => {
  it('renders providers correctly', () => {
    render(<App />);

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('websocket-provider')).toBeInTheDocument();
    expect(screen.getByTestId('service-request-provider')).toBeInTheDocument();
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('renders login route', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('renders register route', () => {
    window.history.pushState({}, '', '/register');
    render(<App />);
    expect(screen.getByTestId('register')).toBeInTheDocument();
  });

  it('renders unauthorized route', () => {
    window.history.pushState({}, '', '/unauthorized');
    render(<App />);
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
  });

  it('redirects to login when accessing protected route without authentication', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });
}); 