import { useEffect, useEffectEvent, useState } from "react";
import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";
import MessageArea from "./MessageArea";
import MessageInput from "./MessageInput";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ChatArea({ selectedChat }) {
  const [messages, setMessages] = useState([]);

  async function getMessagesLatest(conversationId = selectedChat?.id) {
    if (!conversationId) return;

    const res = await api.get(`messages?conversationId=${conversationId}`);
    setMessages(res.data.data);
  }

  async function fetchOlderMessages() {
    if (!messages.length) return [];

    const firstMessageId = messages[0].id;

    const params = new URLSearchParams();;

    params.searchParams.append("conversationId", selectedChat.id);
    params.searchParams.append("beforeMessageId", firstMessageId);

    const res = await api.get(`messages/before?${params.toString()}`);
    const older = res.data.data;

    if (older.length) {
      setMessages((prev) => [...older, ...prev]);
    }

    return older;
  }

  async function fetchNewMessages() {
    if (!messages.length) return [];

    const lastMessageId = messages[messages.length - 1].id;

    const params = new URLSearchParams();;

    params.searchParams.append("conversationId", selectedChat.id);
    params.searchParams.append("afterMessageId", lastMessageId);

    const res = await api.get(`messages/after?${params.toString()}`);

    const newer = res.data.data;

    if (newer.length) {
      setMessages((prev) => [...prev, ...newer]);
    }

    return newer;
  }

  const getMessagesLatestEvent = useEffectEvent(getMessagesLatest);

  useEffect(() => {
    getMessagesLatestEvent(selectedChat?.id);
  }, [selectedChat]);

  const onSend = async ({ text, onSuccess }) => {
    try {
      const res = await api.post("messages", {
        text,
        conversationId: selectedChat?.id,
      });
      getMessagesLatest(selectedChat?.id);
      onSuccess();
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  if (!selectedChat) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={selectedChat} />

      <MessageArea
        messages={messages}
        fetchOlderMessages={fetchOlderMessages}
        fetchNewMessages={fetchNewMessages}
      />

      <MessageInput onSend={onSend}/>
    </div>
  );
}
