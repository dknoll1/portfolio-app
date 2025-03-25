import { EventEmitter } from 'events';

// Worker URL for direct connection in both environments
const WORKER_URL = 'wss://portfolio-app-irc.knollmdan.workers.dev/api/chat/connect';

interface Message {
  from: string;
  text: string;
  timestamp: Date;
}

class IRCService extends EventEmitter {
  private socket: WebSocket | null = null;
  private messages: Message[] = [];
  private connected: boolean = false;
  private currentChannel: string = '';
  private currentNick: string = '';
  private userList: string[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private connectionTimeout: number | null = null;

  connect(server: string, nick: string, channel: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Reset state
        this.messages = [];
        this.userList = [];
        
        this.currentNick = nick;
        this.currentChannel = channel;
        
        // Always use the direct worker URL for reliability
        console.log(`Connecting to WebSocket at: ${WORKER_URL}`);
        
        // Set a connection timeout
        this.connectionTimeout = window.setTimeout(() => {
          if (!this.connected) {
            const timeoutError = new Error('Connection timeout. The worker might be unresponsive.');
            console.error(timeoutError);
            reject(timeoutError);
            
            if (this.socket) {
              this.socket.close();
              this.socket = null;
            }
          }
        }, 10000); // 10 second timeout
        
        const socket = new WebSocket(WORKER_URL);
        this.socket = socket;
        
        socket.onopen = () => {
          console.log('WebSocket connection established');
          
          // Clear the connection timeout
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          // Send connection request to the WebSocket
          socket.send(JSON.stringify({
            type: 'connect',
            server,
            nick,
            channel
          }));
        };
        
        socket.onmessage = (event) => {
          console.log('Received message:', event.data);
          let data;
          
          try {
            data = JSON.parse(event.data);
          } catch (error) {
            console.error('Failed to parse message:', error);
            return;
          }
          
          switch (data.type) {
            case 'connected':
              this.connected = true;
              this.emit('connected');
              resolve();
              break;
              
            case 'message':
              const message: Message = {
                from: data.from,
                text: data.text,
                timestamp: new Date(data.timestamp)
              };
              this.messages.push(message);
              this.emit('message', message);
              break;
              
            case 'userList':
              this.userList = data.users || [];
              this.emit('userList', this.userList);
              break;
              
            case 'error':
              this.emit('error', new Error(data.message));
              reject(new Error(data.message));
              break;
              
            case 'disconnected':
              this.connected = false;
              this.userList = [];
              this.emit('disconnected');
              break;
              
            case 'system':
              console.log('System message:', data.message);
              break;
          }
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket Error:', error);
          
          // Clear the connection timeout
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          let errorMessage = 'WebSocket connection error. The worker might be unavailable.';
          
          // Check if this is a CORS error
          if (error instanceof Event && error.target instanceof WebSocket) {
            if (error.target.readyState === WebSocket.CLOSED) {
              errorMessage += ' This might be a CORS issue or the worker is not responding.';
            }
          }
          
          const wsError = new Error(errorMessage);
          this.emit('error', wsError);
          reject(wsError);
        };
        
        socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          
          // Clear the connection timeout
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          this.connected = false;
          this.userList = [];
          this.emit('disconnected');
          
          // Attempt to reconnect if it wasn't a manual disconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connect(server, nick, channel)
                .catch(error => {
                  console.error('Reconnection failed:', error);
                });
            }, 2000 * this.reconnectAttempts);
          }
        };
        
      } catch (error) {
        console.error('Connection error:', error);
        
        // Clear the connection timeout
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket && this.connected) {
      // Reset reconnect attempts as this is manual disconnect
      this.reconnectAttempts = this.maxReconnectAttempts;
      
      // Send disconnect command
      this.socket.send(JSON.stringify({
        type: 'disconnect'
      }));
      
      // Close the socket
      this.socket.close();
      this.socket = null;
      this.connected = false;
      this.userList = [];
      this.emit('disconnected');
    }
  }

  sendMessage(text: string): void {
    if (this.socket && this.connected && this.currentChannel) {
      // Send message command
      this.socket.send(JSON.stringify({
        type: 'message',
        text
      }));
      
      // Add own message to the list
      const message: Message = {
        from: 'You',
        text,
        timestamp: new Date()
      };
      
      this.messages.push(message);
      this.emit('message', message);
    }
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getUserList(): string[] {
    return [...this.userList];
  }

  isConnected(): boolean {
    return this.connected;
  }

  getCurrentChannel(): string {
    return this.currentChannel;
  }
}

// Singleton instance
export const ircService = new IRCService();
export type { Message }; 