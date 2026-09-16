"use client";

import { useEffect } from "react";

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1f1d1a",
        color: "white",
        borderRadius: 8,
        padding: "0.75rem 1.25rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 100,
      }}
    >
      {message}
    </div>
  );
}
