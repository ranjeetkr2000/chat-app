import { useState } from "react";
import { Input } from "../ui/input";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSuccess = () => {
    setText("");
  }

  const onSubmit = (e) => {
    e.preventDefault();
    onSend({ text, onSuccess })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 py-3 border-t flex items-center gap-3">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={text}
          onChange={onChange}
        />

        <button
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary"
          type="submit"
        >
          ➤
        </button>
      </div>
    </form>
  );
}
