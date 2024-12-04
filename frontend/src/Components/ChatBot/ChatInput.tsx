// src/ChatInput.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  border-radius: 20px;  /* Fixing the comma and using semicolon *
  
  color: white;  /* Added text color to make it more readable */
  border: none;  /* Remove the default border */
  cursor: pointer;  /* Make the cursor a pointer when hovering */
  
  &:hover {
    background-color: darkblue;  /* Added a hover effect */
    color : white;
  }
`;
type ChatInputProps = {
  onSend: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <InputWrapper>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <Button onClick={handleSend}>Send</Button>
    </InputWrapper>
  );
};

export default ChatInput;
