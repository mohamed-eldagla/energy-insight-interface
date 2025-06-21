
import React, { useState } from 'react';
import { ChatbotProps } from '@/types/chat';
import { useChatbot } from '@/hooks/useChatbot';
import ChatbotButton from './ChatbotButton';
import ChatWindow from './ChatWindow';

const Chatbot: React.FC<ChatbotProps> = ({ 
  applianceData = [], 
  selectedHouse = '1', 
  selectedAppliance = 'all' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    loading,
    messagesEndRef,
    loadChatHistory,
    sendMessage,
    handleKeyPress
  } = useChatbot(applianceData, selectedHouse, temperature);

  if (!isOpen) {
    return <ChatbotButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <ChatWindow
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      loading={loading}
      messagesEndRef={messagesEndRef}
      onClose={() => setIsOpen(false)}
      onSendMessage={sendMessage}
      onKeyPress={handleKeyPress}
      onLoadHistory={loadChatHistory}
      temperature={temperature}
      setTemperature={setTemperature}
    />
  );
};

export default Chatbot;
