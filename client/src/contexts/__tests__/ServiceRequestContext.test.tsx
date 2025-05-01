import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ServiceRequestProvider, useServiceRequest } from '../ServiceRequestContext';
import { AuthProvider } from '../AuthContext';
import { WebSocketProvider } from '../WebSocketContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    close: jest.fn(),
  };
  return {
    io: jest.fn(() => mockSocket),
  };
});

// Test component that uses the ServiceRequest context
const TestComponent = () => {
  const { requests, loading, error, createRequest, getRequests } = useServiceRequest();
  
  return (
    <div>
      <div data-testid="loading-status">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error-status">{error || 'No Error'}</div>
      <div data-testid="requests-count">{requests.length}</div>
      <button onClick={() => getRequests()} data-testid="fetch-button">
        Fetch Requests
      </button>
      <button 
        onClick={() => createRequest({
          description: 'Test request',
          location: 'Test location',
          contact: 'Test contact',
          category: 'plumbing',
          priority: 'low',
          status: 'New'
        })}
        data-testid="create-button"
      >
        Create Request
      </button>
    </div>
  );
};

describe('ServiceRequestContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const mockRequests = [
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
  ];

  const mockAxiosResponse = {
    data: mockRequests,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      url: 'http://localhost:5000/api/requests',
      method: 'GET',
      headers: {},
      transformRequest: undefined,
      transformResponse: undefined,
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1
    }
  };

  it('provides initial state and methods', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockAxiosResponse);
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <ServiceRequestProvider>
            <TestComponent />
          </ServiceRequestProvider>
        </WebSocketProvider>
      </AuthProvider>
    );

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error-status')).toHaveTextContent('No Error');
    expect(screen.getByTestId('requests-count')).toHaveTextContent('0');
  });

  it('handles getRequests successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockAxiosResponse);
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <ServiceRequestProvider>
            <TestComponent />
          </ServiceRequestProvider>
        </WebSocketProvider>
      </AuthProvider>
    );

    // Click fetch button
    screen.getByTestId('fetch-button').click();

    // Should show loading state
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    // Wait for requests to load
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('requests-count')).toHaveTextContent('1');
    expect(screen.getByTestId('error-status')).toHaveTextContent('No Error');
  });

  it('handles createRequest successfully', async () => {
    const newRequest = {
      _id: '2',
      description: 'Test request',
      location: 'Test location',
      contact: 'Test contact',
      category: 'plumbing',
      priority: 'low',
      status: 'New',
      clientId: 'client1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const mockCreateResponse = {
      data: newRequest,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {
        url: 'http://localhost:5000/api/requests',
        method: 'POST',
        headers: {},
        transformRequest: undefined,
        transformResponse: undefined,
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockCreateResponse);
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <ServiceRequestProvider>
            <TestComponent />
          </ServiceRequestProvider>
        </WebSocketProvider>
      </AuthProvider>
    );

    // Click create button
    screen.getByTestId('create-button').click();

    // Should show loading state
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    // Wait for request to be created
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('requests-count')).toHaveTextContent('1');
    expect(screen.getByTestId('error-status')).toHaveTextContent('No Error');
  });

  it('handles errors during requests', async () => {
    const errorMessage = 'Network error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <ServiceRequestProvider>
            <TestComponent />
          </ServiceRequestProvider>
        </WebSocketProvider>
      </AuthProvider>
    );

    // Click fetch button
    screen.getByTestId('fetch-button').click();

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('error-status')).toHaveTextContent(errorMessage);
    });

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
  });

  it('handles WebSocket events', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockAxiosResponse);
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <ServiceRequestProvider>
            <TestComponent />
          </ServiceRequestProvider>
        </WebSocketProvider>
      </AuthProvider>
    );

    // Get the mock socket
    const mockSocket = require('socket.io-client').io();

    // Simulate requestCreated event
    act(() => {
      const newRequest = {
        _id: '3',
        description: 'New request',
        location: 'New location',
        contact: 'New contact',
        category: 'plumbing',
        priority: 'low',
        status: 'New',
        clientId: 'client1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const requestCreatedHandler = mockSocket.on.mock.calls.find(
        (call: [string, Function]) => call[0] === 'requestCreated'
      )[1];
      requestCreatedHandler(newRequest);
    });

    expect(screen.getByTestId('requests-count')).toHaveTextContent('1');
  });
}); 