export default function UserItem({ user }) {
  const handleClick = async () => {
    // call createConversation API
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer"
    >
      <span>{user.name}</span>
      <button className="text-xs text-primary">Chat</button>
    </div>
  );
}