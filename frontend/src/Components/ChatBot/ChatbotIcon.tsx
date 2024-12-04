// src/ChatbotIcon.tsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const IconButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

type ChatbotIconProps = {
  onClick: () => void;
};

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <FontAwesomeIcon icon={faCommentDots} />
  </IconButton>
);

export default ChatbotIcon;
