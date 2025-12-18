
import { useEffect, useState, useCallback } from 'react';

type WebSocketEvent = {
  type: string;
  payload: any;
};

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Add token to URL for authentication
    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setReconnectAttempt(0);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      setIsConnected(false);
      
      // Attempt reconnection
      if (reconnectAttempt < maxReconnectAttempts) {
        setTimeout(() => {
          setReconnectAttempt(prev => prev + 1);
        }, reconnectDelay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent;
        console.log('WebSocket message received:', data);
        setLastMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url, reconnectAttempt]);

  // Function to send messages
  const sendMessage = useCallback((type: string, payload: any) => {
    if (socket && isConnected) {
      const message: WebSocketEvent = { type, payload };
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected, cannot send message');
    }
  }, [socket, isConnected]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    reconnectAttempt,
    maxReconnectAttempts
  };
}
