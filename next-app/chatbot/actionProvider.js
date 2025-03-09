import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage('안녕하세요, 어떻게 도와드릴까요?');
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleRecommend = () => {
    const botMessage = createChatBotMessage('하이볼 레시피를 추천해드려요!', {
      widget: 'recommendationWidget',
    });
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleRecommend
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;