"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../../../lib/api";

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

export function ApplyForm({ jobPostingId, accent }: { jobPostingId: string; accent: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${API_URL}/job-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPostingId,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          cv: form.get("cv"),
          resume: form.get("resume"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Something went wrong submitting your application.");
        setSubmitting(false);
        return;
      }

      const application = await res.json();
      router.push(`/applications/${application.id}`);
    } catch {
      setError("Something went wrong submitting your application.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="name">
          Name
        </label>
        <input style={inputStyle} id="name" name="name" required />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="email">
          Email
        </label>
        <input style={inputStyle} id="email" name="email" type="email" required />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle} htmlFor="phone">
          Phone
        </label>
        <input style={inputStyle} id="phone" name="phone" type="tel" required />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle} htmlFor="cv">
          CV
        </label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          id="cv"
          name="cv"
          rows={10}
          placeholder="Paste your CV text, or a link to it"
          required
        />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle} htmlFor="resume">
          Resume
        </label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          id="resume"
          name="resume"
          rows={10}
          placeholder="Paste your resume text, or a link to it"
          required
        />
      </div>

      {error && <p style={{ color: "#c23b5a", marginBottom: "1rem" }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: accent,
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
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
