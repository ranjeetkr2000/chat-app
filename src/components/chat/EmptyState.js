export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <span className="text-5xl">💬</span>
      <h2 className="text-xl font-semibold">Welcome to ChatApp</h2>
      <p className="text-sm text-muted-foreground">
        Select a conversation or start a new one
      </p>
    </div>
  );
}