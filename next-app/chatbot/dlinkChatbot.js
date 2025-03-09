"use client";

import { useState } from "react";
import Chatbot from "react-chatbot-kit";
import config from "./config";
import MessageParser from "./messageParser";
import ActionProvider from "./actionProvider";
import "react-chatbot-kit/build/main.css";
import ToggleButton from "../components/buttons/toggleButton";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import "./chatbot.css";

const DlinkChatbot = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="fixed bottom-3 right-3 flex flex-col items-end">
      <Modal
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="mb-16"
        classNames={{
          body: "p-0 flex justify-center items-center"
        }}
      >
        <ModalContent className="mx-4">
          <Chatbot
            placeholderText="술에 대해 궁금한 점을 입력해주세요!"
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </ModalContent>
      </Modal>
      <ToggleButton isOpen={isOpen} setIsOpen={onOpen} />
    </div>
  );
};

export default DlinkChatbot;
