
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, X, Send } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onLoadHistory: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  loading,
  messagesEndRef,
  onClose,
  onSendMessage,
  onKeyPress,
  onLoadHistory
}) => {
  useEffect(() => {
    onLoadHistory();
  }, [onLoadHistory]);

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
          onClick={onClose}
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
            onKeyPress={onKeyPress}
            placeholder="Ask about energy efficiency..."
            className="bg-slate-700 border-slate-600 text-white text-sm"
            disabled={loading}
          />
          <Button
            onClick={onSendMessage}
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

export default ChatWindow;
