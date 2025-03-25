import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ircService, Message } from '../services/ircService';

interface IRCContextType {
  isConnected: boolean;
  messages: Message[];
  connectToServer: (server: string, nick: string, channel: string) => Promise<void>;
  disconnectFromServer: () => void;
  sendMessage: (text: string) => void;
  currentChannel: string;
  connectionError: string | null;
  userList: string[];
}

const IRCContext = createContext<IRCContextType | undefined>(undefined);

interface IRCProviderProps {
  children: ReactNode;
}

export const IRCProvider: React.FC<IRCProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [userList, setUserList] = useState<string[]>([]);

  useEffect(() => {
    // Set up event listeners
    const onMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    const onConnected = () => {
      setIsConnected(true);
      setConnectionError(null);
      setCurrentChannel(ircService.getCurrentChannel());
      // Initialize messages
      setMessages(ircService.getMessages());
      // Initialize user list
      setUserList(ircService.getUserList());
    };

    const onDisconnected = () => {
      setIsConnected(false);
      setCurrentChannel('');
      setUserList([]);
    };

    const onError = (error: Error) => {
      setConnectionError(error.message);
    };

    const onUserList = (users: string[]) => {
      setUserList(users);
    };

    // Add listeners
    ircService.addListener('message', onMessage);
    ircService.addListener('connected', onConnected);
    ircService.addListener('disconnected', onDisconnected);
    ircService.addListener('error', onError);
    ircService.addListener('userList', onUserList);

    // Clean up listeners on unmount
    return () => {
      ircService.removeListener('message', onMessage);
      ircService.removeListener('connected', onConnected);
      ircService.removeListener('disconnected', onDisconnected);
      ircService.removeListener('error', onError);
      ircService.removeListener('userList', onUserList);
    };
  }, []);

  const connectToServer = useCallback(async (server: string, nick: string, channel: string) => {
    try {
      setConnectionError(null);
      await ircService.connect(server, nick, channel);
    } catch (error) {
      if (error instanceof Error) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Unknown connection error');
      }
      throw error;
    }
  }, []);

  const disconnectFromServer = useCallback(() => {
    ircService.disconnect();
  }, []);

  const sendMessage = useCallback((text: string) => {
    ircService.sendMessage(text);
  }, []);

  const value = {
    isConnected,
    messages,
    connectToServer,
    disconnectFromServer,
    sendMessage,
    currentChannel,
    connectionError,
    userList
  };

  return <IRCContext.Provider value={value}>{children}</IRCContext.Provider>;
};

export const useIRC = (): IRCContextType => {
  const context = useContext(IRCContext);
  if (context === undefined) {
    throw new Error('useIRC must be used within an IRCProvider');
  }
  return context;
}; 