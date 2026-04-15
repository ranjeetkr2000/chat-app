import ConversationItem from "./ConversationItem";

export default function ConversationList({
  chats,
  selectedChat,
  setSelectedChat,
}) {
  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No conversations found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <ConversationItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => setSelectedChat(chat)}
        />
      ))}
    </div>
  );
}