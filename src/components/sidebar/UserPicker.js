export default function UserPicker({ onSelectUser }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 text-sm font-medium text-muted-foreground">
        Start new conversation
      </div>

      {/* Later: replace with API */}
      {/* {dummyUsers.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="px-4 py-3 hover:bg-muted cursor-pointer"
        >
          {user.name}
        </div>
      ))}*/}
    </div>
  );
}