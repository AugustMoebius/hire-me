"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateJobPostingStatus } from "../../../../../lib/api";

const STATUSES = ["open", "filled", "cancelled"];

export function PositionStatusControl({
  postingId,
  initialStatus,
}: {
  postingId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateJobPostingStatus(postingId, newStatus);
    router.refresh();
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      <span style={{ opacity: 0.6 }}>Status:</span>
      <select
        value={status}
        onChange={handleChange}
        style={{
          padding: "0.35rem 0.5rem",
          borderRadius: 6,
          border: "1px solid #d5d5d5",
          fontFamily: "inherit",
          fontSize: "0.9rem",
        }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {status !== "open" && (
        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
          Not shown on the public careers page
        </span>
      )}
    </div>
  );
}
