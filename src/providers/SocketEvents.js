"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import socket from "@/lib/socket";

import { addMessage } from "@/redux/slices/message";

export default function SocketEvents({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const onNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [dispatch]);

  return children;
}
