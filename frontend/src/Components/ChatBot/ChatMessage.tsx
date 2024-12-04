// src/ChatMessage.tsx
import React from 'react';
import styled from 'styled-components';

type ChatMessageProps = {
  message: string;
  isBot?: boolean;
};

const Message = styled.div<{ isBot: boolean }>`
  background-color: ${({ isBot }) => (isBot ? '#f1f1f1' : '#daf7dc')};
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  align-self: ${({ isBot }) => (isBot ? 'flex-start' : 'flex-end')};
  max-width: 70%;
`;

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot = false }) => (
  <Message isBot={isBot}>{message}</Message>
);

export default ChatMessage;
