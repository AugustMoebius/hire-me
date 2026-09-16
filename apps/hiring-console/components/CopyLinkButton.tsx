"use client";

import { useState } from "react";

export function CopyLinkButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: "white",
        border: "1px solid #591AB2",
        color: "#591AB2",
        borderRadius: 8,
        padding: "0.6rem 1.1rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
