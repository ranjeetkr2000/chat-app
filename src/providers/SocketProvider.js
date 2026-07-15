"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import socket from "@/lib/socket";

export default function SocketProvider({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      socket.disconnect();

      return;
    }

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return children;
}
