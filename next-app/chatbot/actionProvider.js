import axios from "axios";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const handleChat = (message) => {
    const loadingMessage = createChatBotMessage("");
    const loadingMessageId = loadingMessage.id;

    loadingMessage.requestFunc = () => {
      return axios.post("/api/v1/chatbot/chat", {
        user_input: message,
      });
    };

    loadingMessage.onResponse = (data) => {
      console.log(data)
      let response;
      try {
        response = JSON.parse(data.response);
      } catch (error) {
        response = { type: "chat", message: "JSON 형식의 응답을 받지 못했습니다.", data: null };
      }

      setState((prev) => {
        const updatedMessages = prev.messages.map((msg) => {
          if (msg.id === loadingMessageId) {
            return {
              ...msg,
              widget: response.type === "recommendation" ? "recommendationWidget" : null,
              loading: false,
              message: response.message,
            };
          }
          return msg;
        });

        return { ...prev, messages: updatedMessages };
      });

      return response.message || "응답이 없습니다.";
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, loadingMessage],
    }));
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          actions: {
            handleChat
          },
        })
      )}
    </>
  );
};

export default ActionProvider;
