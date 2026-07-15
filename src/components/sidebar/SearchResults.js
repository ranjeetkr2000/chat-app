import ConversationItem from "./ConversationItem";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "react-use";

export default function SearchResults({
  query,
  selectedChat,
  setSelectedChat,
}) {
  const [data, setData] = useState({
    conversations: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `search/searchConversations?query=${query}`,
      );
      const { groups, chats, users } = res.data.data;
      const conversations = [...groups, ...chats];
      const groupsFormatted = groups.map((grp) => ({
        id: grp.id,
        name: grp.groupName,
        avatar: grp.groupAvatar,
        
      }));
      setData({
        conversations,
        users,
      });
    } catch (err) {
      toast.error(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const [isReady, cancel] = useDebounce(fetchResults, 500, [query]);

  //cleanup to remove the 
  useEffect(() => {
    return () => {
      if (selectedChat?.tempChatId) {
        setSelectedChat(null);
      }
    }
  }, [selectedChat, setSelectedChat]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Searching...</div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Conversations */}
      {data.conversations.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-muted-foreground">
            Conversations
          </p>
          {data.conversations.map((chat) => (
            <ConversationItem
              key={chat.id}
              chat={chat}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          ))}
        </>
      )}

      {/* Users */}
      {data.users.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-muted-foreground">Users</p>
          {data.users.map((user) => (
            <ConversationItem
              key={user.id}
              chat={user}
              isSelected={selectedChat?.userId === user.id}
              onClick={() => setSelectedChat({
                ...user,
                id: null,
                userId: user.id,
              })}
            />
          ))}
        </>
      )}
    </div>
  );
}
