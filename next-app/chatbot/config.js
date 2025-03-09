import { createChatBotMessage } from 'react-chatbot-kit';
import ChatHeader from './chatHeader';
import { Avatar } from '@heroui/react';
import UserAvatar from '../components/avatar/userAvatar';

const config = {
  initialMessages: [createChatBotMessage(`안녕하세요 무엇을 도와드릴까요?`)],
  botName: 'DLink Bot',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#900020',
    },
    chatButton: {
      backgroundColor: '#900020',
    },
  },
  customComponents: {
    header: (props) => <ChatHeader {...props} />,
    botAvatar: (props) => <Avatar className='mr-3' name="Bot" src='/favicon.ico' {...props} />,
    userAvatar: (props) => <UserAvatar className='ml-3' {...props} />,
  },
};

export default config;