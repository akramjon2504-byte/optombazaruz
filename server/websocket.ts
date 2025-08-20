import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface ClientInfo {
  ws: WebSocket;
  userId?: string;
  sessionId?: string;
}

class WebSocketNotificationService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientInfo> = new Map();

  initialize(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/notifications'
    });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const clientId = this.generateClientId();
      
      // Extract session info from headers if available
      const sessionId = request.headers['x-session-id'] as string;
      
      this.clients.set(clientId, {
        ws,
        sessionId
      });

      console.log(`🔗 WebSocket client connected: ${clientId}`);

      ws.on('message', (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(clientId, data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`🔗 WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(clientId);
      });

      // Send connection confirmation
      this.sendToClient(clientId, {
        type: 'connection',
        status: 'connected',
        clientId
      });
    });

    console.log('📡 WebSocket notification service initialized');
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleClientMessage(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (data.type) {
      case 'register':
        // Register user ID with client
        if (data.userId) {
          client.userId = data.userId;
          console.log(`👤 User ${data.userId} registered for notifications`);
        }
        break;
      
      case 'subscribe':
        // Subscribe to specific notification types
        console.log(`📢 Client ${clientId} subscribed to: ${data.topics?.join(', ')}`);
        break;
    }
  }

  private sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending message to client:', error);
      }
    }
  }

  // Broadcast to all connected clients
  broadcastNotification(notification: {
    type: 'new_product' | 'new_blog_post' | 'promotion' | 'system';
    title: string;
    message: string;
    data?: any;
  }) {
    const message = JSON.stringify({
      ...notification,
      messageType: 'notification',
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(message);
          sentCount++;
        } catch (error) {
          console.error(`Error sending notification to client ${clientId}:`, error);
        }
      }
    });

    console.log(`📢 Broadcast notification sent to ${sentCount} clients: ${notification.title}`);
  }

  // Send notification to specific user
  sendToUser(userId: string, notification: any) {
    let sentCount = 0;
    this.clients.forEach((client, clientId) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify({
            type: 'notification',
            ...notification,
            timestamp: new Date().toISOString()
          }));
          sentCount++;
        } catch (error) {
          console.error(`Error sending notification to user ${userId}:`, error);
        }
      }
    });

    if (sentCount > 0) {
      console.log(`📱 Notification sent to user ${userId} (${sentCount} connections)`);
    }
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const wsNotificationService = new WebSocketNotificationService();