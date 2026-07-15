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

  const onSearchChange = (value) => {
    setSearch(value);
    setMode(value ? "search" : "default");
  };

  return (
    <div className="w-full max-w-sm border-r flex flex-col">
      <SidebarHeader />
      <ConversationsSearchBar
        search={search}
        onSearchChange={onSearchChange}
        mode={mode}
      />

      {/* We can merge these components into one- SearchResults and ConversationList */}
      {mode === "search" && (
        <SearchResults
          query={search}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}

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
