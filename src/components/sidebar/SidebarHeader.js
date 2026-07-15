import { Avatar, AvatarFallback } from "../ui/avatar";

export default function SidebarHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              ME
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <span className="font-semibold text-base">💬 ChatApp</span>
      </div>
    </div>
  );
}