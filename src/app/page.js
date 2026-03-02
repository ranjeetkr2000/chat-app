"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name) {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-orange-400",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function Home() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-full max-w-sm border-r flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  ME
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <span className="font-semibold text-base">💬 ChatApp</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b">
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-muted/40 h-9 text-sm"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              No conversations found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/40 ${
                  selectedChat?.id === chat.id ? "bg-muted/60" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback
                      className={`${getAvatarColor(chat.name)} text-white font-semibold text-sm`}
                    >
                      {getInitials(chat.name)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">
                      {chat.name}
                    </span>
                    <span
                      className={`text-xs shrink-0 ml-2 ${
                        chat.unread > 0
                          ? "text-green-600 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage}
                    </span>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 h-5 w-5 shrink-0 rounded-full p-0 flex items-center justify-center text-[10px] bg-green-500 hover:bg-green-500">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main Panel ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b bg-muted/30">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback
                    className={`${getAvatarColor(selectedChat.name)} text-white font-semibold text-sm`}
                  >
                    {getInitials(selectedChat.name)}
                  </AvatarFallback>
                </Avatar>
                {selectedChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedChat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-muted/10 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm font-medium">
                  Start chatting with {selectedChat.name}
                </p>
                <p className="text-xs mt-1">Messages will appear here</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 border-t bg-background flex items-center gap-3">
              <Input
                placeholder="Type a message..."
                className="flex-1 bg-muted/40"
              />
              <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
                <svg
                  className="w-5 h-5 text-primary-foreground rotate-45"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 gap-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <span className="text-5xl">💬</span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Welcome to ChatApp</h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                Select a conversation from the sidebar to start chatting, or
                start a new one.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 bg-muted/40 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              End-to-end encrypted
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
