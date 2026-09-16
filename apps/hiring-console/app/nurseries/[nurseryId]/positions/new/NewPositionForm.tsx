"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobPosting } from "../../../../../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  borderRadius: 8,
  border: "1px solid #d5d5d5",
  fontSize: "0.95rem",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "0.35rem",
};

export function NewPositionForm({
  nurseryId,
  nurseryName,
}: {
  nurseryId: string;
  nurseryName: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const result = await createJobPosting({
      nurseryId,
      nurseryName,
      title: String(form.get("title") ?? ""),
      workplaceDescription: String(form.get("workplaceDescription") ?? ""),
      roleDescription: String(form.get("roleDescription") ?? ""),
      requiredQualifications: String(form.get("requiredQualifications") ?? ""),
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(`/nurseries/${nurseryId}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="title">
          Title
        </label>
        <input style={inputStyle} id="title" name="title" required />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="workplaceDescription">
          About the workplace
        </label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          id="workplaceDescription"
          name="workplaceDescription"
          rows={4}
          required
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="roleDescription">
          The role
        </label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          id="roleDescription"
          name="roleDescription"
          rows={4}
          required
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle} htmlFor="requiredQualifications">
          Required qualifications
        </label>
        <input
          style={inputStyle}
          id="requiredQualifications"
          name="requiredQualifications"
          placeholder="e.g. Level 3, First Aid"
        />
      </div>

      {error && <p style={{ color: "#c23b5a", marginBottom: "1rem" }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: "#591AB2",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "0.7rem 1.5rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: submitting ? "default" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Creating..." : "Create position"}
      </button>
    </form>
  );
}
