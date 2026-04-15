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

  const onActionClick = () => {
    if (mode === "default") setMode("new");
    else if (mode === "new") setMode("default");
  }

  const onSearchChange = (e) => {
    
  }

  return (
    <div className="w-full max-w-sm border-r flex flex-col">
      <SidebarHeader />
      <ConversationsSearchBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setMode(value ? "search" : "default");
        }}
        onActionClick={onActionClick}
        mode={mode}
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
