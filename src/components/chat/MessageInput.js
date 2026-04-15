import { Input } from "../ui/input";

export default function MessageInput() {
  return (
    <div className="px-4 py-3 border-t flex items-center gap-3">
      <Input placeholder="Type a message..." className="flex-1" />

      <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        ➤
      </button>
    </div>
  );
}