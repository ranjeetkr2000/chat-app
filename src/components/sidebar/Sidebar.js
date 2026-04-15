import { useState } from "react";
import ConversationList from "./ConversationList";
import ConversationsSearchBar from "./ConversationsSearchBar";
import SearchResults from "./SearchResults";
import SidebarHeader from "./SidebarHeader";
import UserPicker from "./UserPicker";

export default function Sidebar({
  chats,
  search,
  setSearch,
  selectedChat,
  setSelectedChat,
}) {
  const [mode, setMode] = useState("default");

  return (
    <div className="w-full max-w-sm border-r flex flex-col">
      <SidebarHeader />
      <ConversationsSearchBar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setMode(value ? "search" : "default");
        }}
        onNewChat={() => setMode("new")}
      />

      {/* 🔥 Core Logic */}
      {mode === "new" && (
        <UserPicker
          onBack={() => setMode("default")}
          onSelectUser={(user) => {
            // later: createConversation(user)
          }}
        />
      )}

      {mode === "search" && <SearchResults query={search} />}

      {mode === "default" && (
        <ConversationList
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}
    </div>
  );
}
