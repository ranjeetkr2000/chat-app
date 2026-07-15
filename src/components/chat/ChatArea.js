import { useEffect, useEffectEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import api from "@/lib/axios";
import { prependMessages, setMessages } from "@/redux/slices/message";

import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";
import MessageArea from "./MessageArea";
import MessageInput from "./MessageInput";

export default function ChatArea({ selectedChat }) {
  const dispatch = useDispatch();

  const messages = useSelector(
    (state) => state.message.byConversation[selectedChat?.id],
  ) ?? [];

  async function getMessagesLatest(conversationId = selectedChat?.id) {
    if (!conversationId) return;

    const res = await api.get(`messages?conversationId=${conversationId}`);

    dispatch(
      setMessages({
        conversationId,
        messages: res.data.data,
      }),
    );
  }

  async function fetchOlderMessages() {
    if (!messages.length) return [];

    const firstMessageId = messages[0].id;

    const params = new URLSearchParams();

    params.append("conversationId", selectedChat.id);

    params.append("beforeMessageId", firstMessageId);

    const res = await api.get(`messages/before?${params.toString()}`);

    const older = res.data.data;

    if (older.length) {
      dispatch(
        prependMessages({
          conversationId: selectedChat.id,
          messages: older,
        }),
      );
    }

    return older;
  }

  const getMessagesLatestEvent = useEffectEvent(getMessagesLatest);

  useEffect(() => {
    if (!selectedChat) return;

    // Already cached
    if (messages.length) return;

    getMessagesLatestEvent(selectedChat.id);
  }, [selectedChat, messages.length]);

  const onSend = async ({ text, onSuccess }) => {
    try {
      await api.post("messages", {
        text,
        conversationId: selectedChat?.id,
      });

      onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!selectedChat) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={selectedChat} />

      <MessageArea
        messages={messages}
        fetchOlderMessages={fetchOlderMessages}
        hasMore={true}
      />

      <MessageInput onSend={onSend} />
    </div>
  );
}
