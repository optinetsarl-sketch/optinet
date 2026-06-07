import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMessages } from "../services/authService";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(() => {
    getMessages()
      .then((response) => {
        const count = response.data.filter((m) => m.statut === "non_lu").length;
        setUnreadCount(count);
      })
      .catch(() => {
        // silently fail – user may not be logged in yet
      });
  }, []);

  // Poll every 30 seconds so the badge stays fresh
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <MessageContext.Provider value={{ unreadCount, setUnreadCount, refreshUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
