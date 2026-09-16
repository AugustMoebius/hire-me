"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.7rem",
  borderRadius: 8,
  border: "1px solid #d5d5d5",
  fontSize: "0.9rem",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "0.3rem",
};

export function CreateEmployeeModal({
  name,
  email,
  phone,
  nurseryName,
  roleTitle,
  onClose,
  onCreated,
}: {
  name: string;
  email: string;
  phone: string;
  nurseryName: string;
  roleTitle: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [creating, setCreating] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    // Mock only — there's no real staff/employee API in this prototype.
    // Famly already holds a staff record per person; in the real product
    // this is the narrow integration point that would create it.
    setTimeout(() => {
      onCreated();
    }, 500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "1.75rem",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginTop: 0, marginBottom: "0.3rem" }}>
          Create employee
        </h2>
        <p style={{ fontSize: "0.85rem", opacity: 0.65, marginBottom: "1.25rem" }}>
          Mock only — this prototype has no real staff record API. Fields are pre-filled from
          the application.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} defaultValue={name} name="name" />
          </div>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} defaultValue={email} name="email" type="email" />
          </div>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} defaultValue={phone} name="phone" />
          </div>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Nursery (if part of a group)</label>
            <input style={inputStyle} defaultValue={nurseryName} disabled />
          </div>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} defaultValue={roleTitle} disabled />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Start date</label>
            <input style={inputStyle} name="startDate" type="date" />
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "white",
                color: "#1f1d1a",
                border: "1px solid #d5d5d5",
                borderRadius: 8,
                padding: "0.6rem 1.2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              style={{
                background: "#591AB2",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "0.6rem 1.2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: creating ? "default" : "pointer",
                opacity: creating ? 0.7 : 1,
              }}
            >
              {creating ? "Creating..." : "Create employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
