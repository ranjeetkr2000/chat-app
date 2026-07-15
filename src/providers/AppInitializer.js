"use client";

import api from "@/lib/axios";
import { clearUser, setUser } from "@/redux/slices/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get("/users/me");

        dispatch(setUser(res.data.data.user));
      } catch {
        dispatch(clearUser());
      }
    }

    init();
  }, [dispatch]);

  return children;
}
