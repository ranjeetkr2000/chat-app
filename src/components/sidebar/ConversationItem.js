import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

function getAvatarColor(name) {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-orange-400",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function ConversationItem({ chat, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/40 ${
        isSelected ? "bg-muted/60" : ""
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback
            className={`${getAvatarColor(chat.name)} text-white font-semibold text-sm`}
          >
            {getInitials(chat.name)}
          </AvatarFallback>
        </Avatar>

        {chat.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <span className="font-medium text-sm truncate">{chat.name}</span>
          {chat.id && (
            <span className="text-xs text-muted-foreground">{chat.time}</span>
          )}
        </div>

        {chat.id ? (
          <div className="flex justify-between mt-0.5">
            <span className="text-xs text-muted-foreground truncate">
              {chat.lastMessage}
            </span>

            {chat.unread > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-green-500">
                {chat.unread}
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex justify-between mt-0.5">
            <span className="text-xs text-muted-foreground truncate">
              Start chat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
