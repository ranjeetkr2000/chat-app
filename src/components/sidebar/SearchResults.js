import axios from "axios";
import ConversationItem from "./ConversationItem";
import UserItem from "./UserItem";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "react-use";

export default function SearchResults({ query }) {

  const [data, setData] = useState({
    conversations: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/search/searchConversations?query=${query}`);
      const { groups, chats, users } = res.data.data;
      const conversations = [...groups, ...chats];
      setData({
        conversations,
        users,
      });
    }
    catch (err) {
      toast.error(err.response?.data?.message ?? err.message);
    }
    finally {
      setLoading(false);
    }
  }

  const [isReady, cancel] = useDebounce(fetchResults, 500, [query]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Searching...
      </div>
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
            <ConversationItem key={chat.id} chat={chat} />
          ))}
        </>
      )}

      {/* Users */}
      {data.users.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-muted-foreground">
            Users
          </p>
          {data.users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </>
      )}
    </div>
  );
}