
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: string;
  isUser: boolean;
}

interface ApplianceData {
  id: string;
  house_id: number;
  appliance_name: string;
  current_power_kw: number;
  total_energy_kwh_day: number;
  peak_energy_kwh: number;
  longest_on_duration_hrs: number;
  efficiency_percentage: number;
  potential_savings_year: number;
  status: string;
  timestamp: string;
}

interface ChatbotProps {
  applianceData?: ApplianceData[];
  selectedHouse?: string;
  selectedAppliance?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  applianceData = [], 
  selectedHouse = '1', 
  selectedAppliance = 'all' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (isOpen && user && user.id === currentUserId) {
      loadChatHistory();
    }
  }, [isOpen, user, currentUserId]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
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

  const generateDashboardContext = () => {
    if (!applianceData.length) return '';
    
    const totalPower = applianceData.reduce((sum, item) => sum + (item.current_power_kw || 0), 0);
    const avgEfficiency = applianceData.reduce((sum, item) => sum + (item.efficiency_percentage || 0), 0) / applianceData.length;
    const activeDevices = applianceData.filter(item => item.status === 'active').length;
    const totalSavings = applianceData.reduce((sum, item) => sum + (item.potential_savings_year || 0), 0);

    return `Current dashboard context for House ${selectedHouse}:
- Total Power Consumption: ${totalPower.toFixed(2)} kW
- Average Efficiency: ${avgEfficiency.toFixed(0)}%
- Active Devices: ${activeDevices}
- Total Potential Annual Savings: $${totalSavings}
- Appliances data: ${JSON.stringify(applianceData.map(item => ({
  name: item.appliance_name,
  power: item.current_power_kw,
  efficiency: item.efficiency_percentage,
  status: item.status,
  dailyEnergy: item.total_energy_kwh_day,
  potentialSavings: item.potential_savings_year
})))}`;
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
      const dashboardContext = generateDashboardContext();
      
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 bg-slate-800 border-slate-700 shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          Energy Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-3">
        <ScrollArea className="flex-1 mb-3 h-[280px]">
          <div className="space-y-3 pr-4">
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm text-center py-4">
                Ask me anything about energy efficiency and your NILM dashboard!
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] p-2 rounded-lg text-sm ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {msg.message}
                </div>
                
                {msg.isUser && (
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-slate-700 text-slate-200 p-2 rounded-lg text-sm">
                  Thinking...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about energy efficiency..."
            className="bg-slate-700 border-slate-600 text-white text-sm"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
