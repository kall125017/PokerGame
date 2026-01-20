// Chat Service for Real-time Messaging
// This service handles WebSocket connections for real-time chat
// For production, replace the mock implementation with actual WebSocket server URL

class ChatService {
  constructor() {
    this.ws = null;
    this.subscribers = [];
    this.connectionCallbacks = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.messageQueue = [];
  }

  // WebSocket server URL - Update this to your actual WebSocket server
  // For now, using a mock implementation that simulates real-time messaging
  getWebSocketURL() {
    // In production, replace with your WebSocket server URL
    // Example: return 'ws://localhost:3001' or 'wss://your-server.com'
    return null; // null means use mock mode
  }

  connect() {
    const wsURL = this.getWebSocketURL();
    
    if (!wsURL) {
      // Mock mode - simulate WebSocket connection
      console.log('Chat Service: Running in mock mode (no WebSocket server)');
      setTimeout(() => {
        this.isConnected = true;
        this.notifyConnectionChange(true);
        // Simulate some initial messages
        this.simulateInitialMessages();
      }, 500);
      return;
    }

    try {
      this.ws = new WebSocket(wsURL);

      this.ws.onopen = () => {
        console.log('Chat Service: WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
        // Send queued messages
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.notifySubscribers(message);
        } catch (error) {
          console.error('Chat Service: Error parsing message', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Chat Service: WebSocket error', error);
      };

      this.ws.onclose = () => {
        console.log('Chat Service: WebSocket disconnected');
        this.isConnected = false;
        this.notifyConnectionChange(false);
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Chat Service: Connection error', error);
      this.isConnected = false;
      this.notifyConnectionChange(false);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Chat Service: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('Chat Service: Max reconnection attempts reached');
    }
  }

  sendMessage(messageData) {
    const message = {
      ...messageData,
      id: Date.now() + Math.random(),
      timestamp: messageData.timestamp || new Date()
    };

    if (!this.isConnected) {
      // Queue message if not connected
      this.messageQueue.push(message);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      // Also broadcast locally for immediate feedback
      this.notifySubscribers(message);
    } else {
      // Mock mode - broadcast locally
      this.notifySubscribers(message);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  unsubscribe() {
    this.subscribers = [];
  }

  onConnectionChange(callback) {
    this.connectionCallbacks.push(callback);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  notifySubscribers(message) {
    this.subscribers.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Chat Service: Error in subscriber callback', error);
      }
    });
  }

  notifyConnectionChange(isConnected) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error('Chat Service: Error in connection callback', error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.notifyConnectionChange(false);
  }

  // Mock mode: Simulate initial messages
  simulateInitialMessages() {
    const mockMessages = [
      {
        playerName: 'System',
        message: 'Welcome to the poker table chat!',
        timestamp: new Date(Date.now() - 60000)
      }
    ];

    mockMessages.forEach((msg, index) => {
      setTimeout(() => {
        this.notifySubscribers({
          ...msg,
          id: Date.now() + index
        });
      }, index * 500);
    });
  }
}

// Export singleton instance
export const chatService = new ChatService();

