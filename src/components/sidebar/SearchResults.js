import ConversationItem from "./ConversationItem";
import UserItem from "./UserItem";

export default function SearchResults({ query }) {
  const { data, isLoading } = useSearch(query);

  if (isLoading) {
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