"use client";

import { useEffect, useState } from "react";
import ChatArea from "@/components/chat/ChatArea";
import Sidebar from "@/components/sidebar/Sidebar";
import dayjs from "dayjs";
import api from "@/lib/axios";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.get("conversations");
        console.log({data})
        const conv = data?.data;
        const chats = conv?.data?.map((chat) => {
          const name = chat.isGroup ? chat.groupName : chat.otherUser?.name;
          const avatar = chat.isGroup
            ? chat.groupAvatar
            : chat.otherUser?.avatar;
          return {
            id: chat.id,
            name,
            avatar,
            lastMessage: chat.latestMessage?.content,
            time: dayjs(chat.latestMessage?.createdAt).format("DD MMM YYYY"),
            unread: 1,
            online: true,
          };
        });
        setConversations(chats ?? []);
      } catch (error) {
        console.log({ error });
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        chats={conversations}
        search={search}
        setSearch={setSearch}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatArea selectedChat={selectedChat} />
    </div>
  );
}
