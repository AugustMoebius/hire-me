"use client";

import { useState } from "react";
import { sendMessage, type Message } from "../../../lib/api";

const bubbleStyle = (mine: boolean, accent: string): React.CSSProperties => ({
  alignSelf: mine ? "flex-end" : "flex-start",
  background: mine ? accent : "#f2f2f2",
  color: mine ? "white" : "black",
  borderRadius: 12,
  padding: "0.6rem 0.85rem",
  maxWidth: "80%",
  whiteSpace: "pre-wrap",
});

export function MessageThread({
  nurseryId,
  applicantEmail,
  initialMessages,
  accent,
}: {
  nurseryId: string;
  applicantEmail: string;
  initialMessages: Message[];
  accent: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.trim()) return;

    setError(null);
    setSending(true);

    const result = await sendMessage(nurseryId, applicantEmail, draft.trim());

    if (!result.ok) {
      setError(result.error);
      setSending(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `pending-${prev.length}`,
        nurseryId,
        applicantEmail,
        sender: "applicant",
        content: draft.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    setSending(false);
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
        {messages.length === 0 && (
          <p style={{ opacity: 0.6, margin: 0 }}>No messages yet.</p>
        )}
        {messages.map((message) => (
          <div key={message.id} style={bubbleStyle(message.sender === "applicant", accent)}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the nursery…"
          style={{
            flex: 1,
            padding: "0.6rem 0.75rem",
            borderRadius: 8,
            border: "1px solid #d5d5d5",
            fontSize: "0.95rem",
            fontFamily: "inherit",
          }}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          style={{
            background: accent,
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.25rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          Send
        </button>
      </form>

      {error && <p style={{ color: "#c23b5a", marginTop: "0.75rem" }}>{error}</p>}
    </div>
  );
}
