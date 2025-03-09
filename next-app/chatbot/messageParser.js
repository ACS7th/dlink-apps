// in MessageParser.js
import React from 'react';

const MessageParser = ({ children, actions }) => {
  const handleParse = (message) => {
    if (message.includes('hello')) {
      actions.handleHello();
    }

    if(message.includes('추천')) {
      actions.handleRecommend();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: handleParse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;