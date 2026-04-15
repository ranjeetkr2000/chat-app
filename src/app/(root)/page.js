"use client";

import { useState } from "react";
import ChatArea from "@/components/chat/ChatArea";
import Sidebar from "@/components/sidebar/Sidebar";

const dummyChats = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "",
    lastMessage: "Hey! Are you coming to the meeting?",
    time: "10:32 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "",
    lastMessage: "I'll send you the files later.",
    time: "9:15 AM",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Team Alpha 🚀",
    avatar: "",
    lastMessage: "John: Deployment is done!",
    time: "Yesterday",
    unread: 5,
    online: false,
    isGroup: true,
  },
  {
    id: 4,
    name: "Sara Williams",
    avatar: "",
    lastMessage: "Thanks for your help 😊",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "Dev Squad 💻",
    avatar: "",
    lastMessage: "Mike: PR is ready for review",
    time: "Monday",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: 6,
    name: "Chris Evans",
    avatar: "",
    lastMessage: "Let's catch up soon!",
    time: "Sunday",
    unread: 0,
    online: false,
  },
  {
    id: 7,
    name: "Natasha Lee",
    avatar: "",
    lastMessage: "Did you see the game last night?",
    time: "Saturday",
    unread: 1,
    online: true,
  },
];

export default function Home() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        chats={filteredChats}
        search={search}
        setSearch={setSearch}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatArea selectedChat={selectedChat} />
    </div>
  );
}
