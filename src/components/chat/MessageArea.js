export default function MessageArea({ chat }) {
  return (
    <div className="flex-1 bg-muted/10 flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-sm font-medium">
          Start chatting with {chat.name}
        </p>
      </div>
    </div>
  );
}