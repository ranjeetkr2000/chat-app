import { Input } from "../ui/input";

export default function ConversationsSearchBar({
  search,
  onSearchChange,
}) {
  return (
    <div className="px-3 py-2 border-b flex items-center gap-2">
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-muted/40 h-9 text-sm flex-1"
      />
    </div>
  );
}