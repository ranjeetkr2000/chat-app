import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.isSelf ? "justify-end" : "justify-start"} my-1`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] ${
          message.isSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function MessageArea({
  messages,
  fetchOlderMessages,
  hasMore
}) {
  return (
    <div
      id="scrollableDiv"
      className="flex-1 overflow-auto flex flex-col-reverse p-5"
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchOlderMessages}
        hasMore={hasMore}
        inverse={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
        className="flex flex-col"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </InfiniteScroll>
    </div>
  );
}