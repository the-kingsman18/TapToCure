// src/Chatbot.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  overflow: hidden;
  z-index: 1000;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

type Message = {
  text: string;
  isBot: boolean;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your chatbot. How can I help you?", isBot: true },
  ]);

  const handleSend = (message: string) => {
    const userMessage: Message = { text: message, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Bot response logic
    let botResponse = "I'm here to help!";
    if (message.toLowerCase().includes("hello")) {
      botResponse = "Hi there! How can I assist you today?";
    } else if (message.toLowerCase().includes("help")) {
      botResponse = "Sure, I'm here to help! What do you need assistance with?";
    } else if (message.toLowerCase().includes("time")) {
      botResponse = `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (message.toLowerCase().includes("name")) {
      botResponse = "I'm your friendly chatbot assistant!";
    }else if (message.toLowerCase().includes("symptoms of")) {
      const disease = message.split("symptoms of")[1].trim();
      botResponse = `The symptoms of ${disease} include fever, cough, and difficulty breathing. For more specific symptoms, please consult a healthcare provider.`;
    }

    // Question 2: What is a medical condition
    else if (message.toLowerCase().includes("what is")) {
      const condition = message.split("what is")[1].trim();
      botResponse = `A common description of ${condition} is a medical condition characterized by... [insert detailed description here]. Please consult a healthcare provider for accurate diagnosis.`;
    }

    // Question 3: Prevention of a condition
    else if (message.toLowerCase().includes("how to prevent")) {
      const conditionToPrevent = message.split("how to prevent")[1].trim();
      botResponse = `To prevent ${conditionToPrevent}, ensure proper hygiene, follow a healthy diet, exercise regularly, and avoid known risk factors.`;
    }

    // Question 4: General health & wellness
    else if (message.toLowerCase().includes("how can I stay healthy")) {
      botResponse = `To stay healthy, eat a balanced diet, exercise regularly, sleep well, manage stress, and visit a healthcare provider for routine checkups.`;
    }

    // Question 5: Prescription information
    else if (message.toLowerCase().includes("how should I take")) {
      const medication = message.split("how should I take")[1].trim();
      botResponse = `Please follow the dosage instructions on the medication label, or consult your doctor or pharmacist for more specific guidance on how to take ${medication}.`;
    }

    // Question 6: Symptoms of a heart attack
    else if (message.toLowerCase().includes("symptoms of a heart attack")) {
      botResponse = `Common symptoms of a heart attack include chest pain, shortness of breath, nausea, lightheadedness, or discomfort in the upper body. If you suspect a heart attack, seek immediate medical help.`;
    }

    // Question 7: Medication side effects
    else if (message.toLowerCase().includes("side effects of")) {
      const medication = message.split("side effects of")[1].trim();
      botResponse = `The side effects of ${medication} can include dizziness, headache, nausea, or stomach upset. For a complete list, check the medication's information leaflet or consult your doctor.`;
    }

    // Question 8: General health tips
    else if (message.toLowerCase().includes("how can I improve my health")) {
      botResponse = `To improve your health, consider eating more fruits and vegetables, exercising regularly, getting enough sleep, managing stress, and staying hydrated.`;
    }

    // Question 9: When should I get a health check-up
    else if (message.toLowerCase().includes("when should I get a health check-up")) {
      botResponse = `It is recommended to have an annual check-up with your primary care doctor to monitor your health and catch any potential issues early. If you have any specific concerns, consult your doctor.`;
    }

    // Question 10: Is smoking bad for my health?
    else if (message.toLowerCase().includes("is smoking bad for my health")) {
      botResponse = `Yes, smoking is harmful to your health. It increases the risk of lung cancer, heart disease, stroke, and many other serious health conditions. It's best to quit smoking to improve your overall health.`;
    }


    // Add bot response after a short delay
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, isBot: true },
      ]);
    }, 1000);
  };

  return (
    <ChatContainer>
      <MessagesWrapper>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isBot={msg.isBot} />
        ))}
      </MessagesWrapper>
      <ChatInput onSend={handleSend}/>
    </ChatContainer>
  );
};

export default Chatbot;
