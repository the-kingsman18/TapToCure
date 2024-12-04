import Banner from "../Banner/Banner"
import Header from "../Header/Header"
import Speciality from "../Speciality/speciality"
import TopDoctors from "../TopDoctors/TopDoctors"
import Chatbot from "../../ChatBot/ChatBot"
import {useState} from 'react';
import ChatbotIcon from "../../ChatBot/ChatbotIcon"


const Home = () => {

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div>
    

        <Header></Header>
        <Speciality></Speciality>
        {isChatOpen && <Chatbot />}
        <ChatbotIcon onClick={toggleChat} />
        <TopDoctors></TopDoctors>
        <Banner />
        

    </div>
  )
}

export default Home;
