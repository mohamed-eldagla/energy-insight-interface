
import { useState, useEffect, useRef } from 'react';
import { ChatMessage, ApplianceData } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateDashboardContext } from '@/utils/chatUtils';

export const useChatbot = (
  applianceData: ApplianceData[] = [], 
  selectedHouse: string = '1'
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat history when user changes
  useEffect(() => {
    if (user?.id !== currentUserId) {
      setMessages([]);
      setCurrentUserId(user?.id || null);
    }
  }, [user?.id, currentUserId]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedMessages: ChatMessage[] = [];
      data?.forEach(msg => {
        formattedMessages.push({
          id: msg.id + '_user',
          message: msg.message,
          timestamp: msg.timestamp,
          isUser: true
        });
        if (msg.response) {
          formattedMessages.push({
            id: msg.id + '_bot',
            message: msg.response,
            timestamp: msg.timestamp,
            isUser: false
          });
        }
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading || !user) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message to UI immediately
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      message: userMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    }]);

    try {
      const dashboardContext = generateDashboardContext(applianceData, selectedHouse);
      
      // Call the Gemini chat function with dashboard context
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: userMessage,
          dashboardContext: dashboardContext
        }
      });

      if (error) throw error;

      const botResponse = data.response;

      // Save to database
      const { error: dbError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          response: botResponse
        });

      if (dbError) throw dbError;

      // Add bot response to UI
      setMessages(prev => [...prev, {
        id: userMsgId + '_bot',
        message: botResponse,
        timestamp: new Date().toISOString(),
        isUser: false
      }]);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    loading,
    messagesEndRef,
    loadChatHistory,
    sendMessage,
    handleKeyPress
  };
};
