/// <reference types="@cloudflare/workers-types" />

export interface Env {
  SOCKET: DurableObjectNamespace;
}

interface User {
  nick: string;
  channel: string;
}

// WebSocket Session Durable Object for maintaining IRC connections
export class WebSocketSession {
  state: DurableObjectState;
  webSocket: WebSocket | null = null;
  clients: Map<WebSocket, User> = new Map();
  ircSocket: WebSocket | null = null;
  
  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    
    // Handle preflight requests for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    
    if (url.pathname === "/api/chat/connect") {
      // Log the request for debugging
      console.log("Received WebSocket request from:", request.headers.get("Origin"));
      
      // Handle WebSocket connection
      let pair = new WebSocketPair();
      let client = pair[0];
      let server = pair[1];
      
      // Accept the WebSocket connection
      server.accept();
      
      // Send initial connected message
      server.send(JSON.stringify({
        type: 'system',
        message: 'WebSocket connection established'
      }));
      
      // Handle WebSocket messages
      server.addEventListener('message', async (event: MessageEvent) => {
        try {
          console.log("Received message:", event.data);
          const data = JSON.parse(event.data as string);
          
          switch (data.type) {
            case 'connect':
              await this.connectToIRCChannel(data.server, data.nick, data.channel, server);
              break;
            case 'message':
              this.broadcastMessage(server, data.text);
              break;
            case 'disconnect':
              this.disconnectFromIRC(server);
              break;
            default:
              server.send(JSON.stringify({
                type: 'error',
                message: 'Unknown command'
              }));
          }
        } catch (error) {
          console.error('Error processing message:', error);
          server.send(JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      });
      
      // Handle WebSocket close
      server.addEventListener('close', () => {
        console.log("WebSocket connection closed");
        this.disconnectFromIRC(server);
      });
      
      // Create a response with the client WebSocket
      let response = new Response(null, {
        status: 101,
        // @ts-ignore - Cloudflare Workers specific property
        webSocket: client
      });
      
      // Add CORS headers for WebSocket
      response.headers.set("Access-Control-Allow-Origin", "*");
      
      return response;
    }
    
    // Default response for other paths
    return new Response('Not found', { 
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }
  
  async connectToIRCChannel(server: string, nick: string, channel: string, clientWs: WebSocket) {
    console.log(`User ${nick} connecting to channel ${channel}`);
    
    // Store the user information with this client
    this.clients.set(clientWs, { nick, channel });
    
    // Tell the client it's connected
    clientWs.send(JSON.stringify({
      type: 'connected',
      server,
      nick,
      channel
    }));
    
    // Send a welcome message just to this user
    clientWs.send(JSON.stringify({
      type: 'message',
      from: 'CafeBot',
      text: `Welcome to ${channel}! You are now connected.`,
      timestamp: new Date().toISOString()
    }));
    
    // Broadcast to all users in the same channel that a new user has joined
    this.broadcastSystemMessage(
      `${nick} has joined ${channel}`,
      channel
    );
    
    // Update user list for all clients in this channel
    this.broadcastUserList(channel);
  }
  
  broadcastMessage(sender: WebSocket, text: string) {
    const user = this.clients.get(sender);
    if (!user) return;
    
    const { nick, channel } = user;
    
    // Get all clients in the same channel
    const timestamp = new Date().toISOString();
    
    // Broadcast the message to all clients in the same channel
    Array.from(this.clients.entries()).forEach(([client, clientUser]) => {
      if (clientUser.channel === channel) {
        // Don't send the message back to the sender
        if (client === sender) {
          // The client already adds their own message locally
          return;
        }
        client.send(JSON.stringify({
          type: 'message',
          from: nick,
          text,
          timestamp
        }));
      }
    });
  }
  
  broadcastSystemMessage(message: string, channel: string) {
    // Send a system message to all clients in a specific channel
    Array.from(this.clients.entries()).forEach(([client, user]) => {
      if (user.channel === channel) {
        client.send(JSON.stringify({
          type: 'message',
          from: 'System',
          text: message,
          timestamp: new Date().toISOString()
        }));
      }
    });
  }
  
  broadcastUserList(channel: string) {
    // Get all users in this channel
    const users = Array.from(this.clients.values())
      .filter(user => user.channel === channel)
      .map(user => user.nick);
    
    // Send the user list to all clients in this channel
    Array.from(this.clients.entries()).forEach(([client, user]) => {
      if (user.channel === channel) {
        client.send(JSON.stringify({
          type: 'userList',
          users
        }));
      }
    });
  }
  
  disconnectFromIRC(clientWs: WebSocket) {
    const user = this.clients.get(clientWs);
    if (!user) return;
    
    const { nick, channel } = user;
    
    // Remove the client
    this.clients.delete(clientWs);
    
    // Notify other users that this user has left
    this.broadcastSystemMessage(
      `${nick} has left ${channel}`, 
      channel
    );
    
    // Update the user list for all remaining clients in this channel
    this.broadcastUserList(channel);
    
    // Send disconnected message to this client
    try {
      clientWs.send(JSON.stringify({
        type: 'disconnected'
      }));
    } catch (e) {
      // Client might already be closed, ignore errors
    }
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // For non-WebSocket requests, add CORS headers
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/chat')) {
      // Get or create a Durable Object ID
      const id = env.SOCKET.idFromName('default');
      // Get the Durable Object stub for that ID
      const stub = env.SOCKET.get(id);
      // Forward the request to the Durable Object
      return stub.fetch(request);
    }
    
    // Default response with CORS headers
    return new Response('Hello from Worker!', {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }
}; 