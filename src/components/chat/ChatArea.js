import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";
import MessageArea from "./MessageArea";
import MessageInput from "./MessageInput";

export default function ChatArea({ selectedChat }) {
  if (!selectedChat) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={selectedChat} />
      <MessageArea chat={selectedChat} />
      <MessageInput />
    </div>
  );
}