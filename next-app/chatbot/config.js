import { createChatBotMessage } from 'react-chatbot-kit';
import ChatHeader from './chatHeader';
import { Avatar } from '@heroui/react';
import UserAvatar from '../components/avatar/userAvatar';
import HighballRecommendationWidget from './widgets/HighballRecommendationWidget';
import YangjuRecommendationWidget from './widgets/YangjuRecommendationWidget';
import WineRecommendationWidget from './widgets/WineRecommendationWidget';
import PriceRecommendationWidget from './widgets/PriceRecommendationWidget';
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
  widgets: [
    {
      widgetName: 'highballRecommendationWidget',
      widgetFunc: (props) => <HighballRecommendationWidget {...props} />,
    },
    {
      widgetName: 'yangjuRecommendationWidget',
      widgetFunc: (props) => <YangjuRecommendationWidget {...props} />,
    },
    {
      widgetName: 'wineRecommendationWidget',
      widgetFunc: (props) => <WineRecommendationWidget {...props} />,
    },
    {
      widgetName: 'priceRecommendationWidget',
      widgetFunc: (props) => <PriceRecommendationWidget {...props} />,
    },
  ],
  customComponents: {
    header: (props) => <ChatHeader {...props} />,
    botAvatar: (props) => <Avatar className='mr-3 min-w-[40px]' name="Bot" src='/favicon.ico' {...props} />,
    userAvatar: (props) => <UserAvatar className='ml-3' {...props} />,
  },
};

export default config;