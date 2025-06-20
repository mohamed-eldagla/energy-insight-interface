
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};

export default ChatbotButton;
