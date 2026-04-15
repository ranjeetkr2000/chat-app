import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function ChatHeader({ chat }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b bg-muted/30">
      <Avatar className="w-10 h-10">
        <AvatarFallback>
          {getInitials(chat.name)}
        </AvatarFallback>
      </Avatar>

      <div>
        <p className="font-semibold text-sm">{chat.name}</p>
        <p className="text-xs text-muted-foreground">
          {chat.online ? "Online" : "Last seen recently"}
        </p>
      </div>
    </div>
  );
}