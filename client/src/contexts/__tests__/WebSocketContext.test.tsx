import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from '../WebSocketContext';
import { AuthProvider } from '../AuthContext';
import { Socket } from 'socket.io-client';

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

// Test component that uses the WebSocket context
const TestComponent = () => {
  const { connected, socket } = useWebSocket();
  return (
    <div>
      <div data-testid="connection-status">
        {connected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="socket-status">
        {socket ? 'Socket exists' : 'No socket'}
      </div>
    </div>
  );
};

describe('WebSocketContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('provides socket and connection status when user is authenticated', () => {
    // Mock localStorage to simulate authenticated user
    localStorage.setItem('token', 'fake-token');
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <TestComponent />
        </WebSocketProvider>
      </AuthProvider>
    );

    // Initially disconnected
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
    expect(screen.getByTestId('socket-status')).toHaveTextContent('Socket exists');
  });

  it('handles socket connection events', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <AuthProvider>
        <WebSocketProvider>
          <TestComponent />
        </WebSocketProvider>
      </AuthProvider>
    );

    // Get the mock socket
    const mockSocket = require('socket.io-client').io();

    // Simulate connect event
    act(() => {
      const connectHandler = mockSocket.on.mock.calls.find((call: [string, Function]) => call[0] === 'connect')[1];
      connectHandler();
    });

    expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');

    // Simulate disconnect event
    act(() => {
      const disconnectHandler = mockSocket.on.mock.calls.find((call: [string, Function]) => call[0] === 'disconnect')[1];
      disconnectHandler();
    });

    expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
  });

  it('cleans up socket on unmount', () => {
    localStorage.setItem('token', 'fake-token');
    
    const { unmount } = render(
      <AuthProvider>
        <WebSocketProvider>
          <TestComponent />
        </WebSocketProvider>
      </AuthProvider>
    );

    const mockSocket = require('socket.io-client').io();
    
    unmount();
    
    expect(mockSocket.close).toHaveBeenCalled();
  });
}); 