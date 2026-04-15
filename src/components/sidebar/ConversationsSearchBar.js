import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ConversationsSearchBar({
  search,
  setSearch,
  onNewChat,
}) {
  return (
    <div className="px-3 py-2 border-b flex items-center gap-2">
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-muted/40 h-9 text-sm flex-1"
      />

      <Button size="icon" onClick={onNewChat} className="h-9 w-9">
        +
      </Button>
    </div>
  );
}
