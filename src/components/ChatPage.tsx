import React, { useState, useRef, useEffect } from 'react';
import { useIRC } from '../contexts/IRCContext';
import { Message } from '../services/ircService';

const ChatPage: React.FC = () => {
  const { 
    isConnected, 
    messages, 
    connectToServer, 
    disconnectFromServer, 
    sendMessage, 
    currentChannel,
    connectionError,
    userList
  } = useIRC();

  const [server, setServer] = useState('irc.freenode.org');
  const [nick, setNick] = useState(`user${Math.floor(Math.random() * 10000)}`);
  const [channel, setChannel] = useState('#cafe');
  const [messageText, setMessageText] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle connection errors from the context
  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
      setConnecting(false);
    }
  }, [connectionError]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!server || !nick || !channel) return;
    
    setError(null);
    setConnecting(true);
    
    try {
      await connectToServer(server, nick, channel);
    } catch (error) {
      console.error('Failed to connect:', error);
      setError(error instanceof Error ? error.message : 'Connection failed. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromServer();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    sendMessage(messageText);
    setMessageText('');
  };

  // Format timestamp to display only minutes:seconds
  const formatTimestamp = (timestamp: string | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-white">IRC Chat</h1>
      
      {!isConnected ? (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg mb-6 text-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-green-500">Connect to IRC</h2>
          
          <p className="text-gray-400 mb-4">
            This is a simulated IRC chat using a Cloudflare Worker. Enter your details below to connect.
          </p>
          
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Server</label>
              <input
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nickname</label>
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                placeholder="Your nickname"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Channel</label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm p-2 bg-red-900 rounded border border-red-700">
                Error: {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={connecting}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500"
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          </form>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Note: This is a demo IRC chat that uses WebSockets to connect multiple users in real time.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 p-2 rounded-t-lg flex justify-between items-center text-green-400 text-sm">
            <div>
              <span>[{server}]</span>
              <span> {currentChannel} </span>
              <span className="text-gray-500">({userList.length} users)</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="bg-red-900 text-white px-3 py-1 rounded-md hover:bg-red-800 text-xs"
            >
              Disconnect
            </button>
          </div>
          
          <div className="flex bg-black border border-gray-700 rounded-b-lg">
            {/* Chat area */}
            <div className="flex-1 h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto font-mono text-sm">
                {messages.length === 0 ? (
                  <div className="text-gray-600 text-center p-4">
                    --- No messages yet ---
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {messages.map((msg, i) => {
                      const isCurrentUser = msg.from === 'You';
                      const displayName = isCurrentUser ? nick : msg.from;
                      
                      return (
                        <div key={i} className="flex">
                          <span className="text-gray-500">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                          <span className={`ml-2 ${isCurrentUser ? 'text-gray-400' : 'text-white'}`}>
                            {displayName}: {msg.text}
                          </span>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-800">
                <div className="flex">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`[${currentChannel}]`}
                    className="flex-1 px-2 py-1 bg-black border border-gray-700 text-white focus:outline-none focus:border-green-700"
                  />
                  <button
                    type="submit"
                    className="bg-green-900 text-white px-4 border border-green-800 hover:bg-green-800"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
            
            {/* Users list */}
            <div className="w-48 border-l border-gray-700 bg-gray-900 overflow-y-auto">
              <div className="p-2 border-b border-gray-800 text-green-500 font-bold text-sm">
                Users in {currentChannel}
              </div>
              <div className="p-2">
                <ul className="text-sm">
                  {userList.map((user, i) => (
                    <li key={i} className={`${user === nick ? 'text-gray-400' : 'text-white'}`}>
                      {user === nick ? '* ' : '  '}{user}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 