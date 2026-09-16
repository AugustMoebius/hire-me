"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateApplicationStatus,
  updateJobPostingStatus,
} from "../../../../../../../lib/api";
import { CreateEmployeeModal } from "../../../../../../../components/CreateEmployeeModal";
import { Toast } from "../../../../../../../components/Toast";

const STATUSES = ["received", "reviewing", "hired", "rejected", "gone_quiet"];

export function ApplicationStatusControl({
  applicationId,
  initialStatus,
  applicantName,
  applicantEmail,
  applicantPhone,
  nurseryName,
  postingId,
  postingTitle,
  postingStatus,
}: {
  applicationId: string;
  initialStatus: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  nurseryName: string;
  postingId: string;
  postingTitle: string;
  postingStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [employeeCreated, setEmployeeCreated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const [positionClosed, setPositionClosed] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    const previous = status;
    setStatus(newStatus);
    setError(null);

    const result = await updateApplicationStatus(applicationId, newStatus);

    if (!result.ok) {
      setStatus(previous);
      setError(result.error);
      return;
    }

    router.refresh();

    if (newStatus === "hired" && !employeeCreated) {
      setShowModal(true);
    }
  }

  async function handleClosePosition() {
    await updateJobPostingStatus(postingId, "filled");
    setPositionClosed(true);
    setShowClosePrompt(false);
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <select
          value={status}
          onChange={handleChange}
          style={{
            padding: "0.5rem 0.6rem",
            borderRadius: 6,
            border: "1px solid #d5d5d5",
            fontFamily: "inherit",
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {status === "hired" &&
          (employeeCreated ? (
            <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>Employee created ✓</span>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "white",
                border: "1px solid #591AB2",
                color: "#591AB2",
                borderRadius: 6,
                padding: "0.5rem 0.8rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Create employee
            </button>
          ))}
      </div>

      {error && (
        <p style={{ color: "#c23b5a", marginTop: "0.75rem", marginBottom: 0 }}>{error}</p>
      )}

      {showModal && (
        <CreateEmployeeModal
          name={applicantName}
          email={applicantEmail}
          phone={applicantPhone}
          nurseryName={nurseryName}
          roleTitle={postingTitle}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setEmployeeCreated(true);
            setShowModal(false);
            setShowToast(true);
            if (postingStatus === "open") {
              setShowClosePrompt(true);
            }
          }}
        />
      )}

      {showClosePrompt && (
        <div
          style={{
            border: "1px solid #e2e2e2",
            background: "#faf8fd",
            borderRadius: 10,
            padding: "1rem 1.1rem",
            marginTop: "1rem",
          }}
        >
          <p style={{ margin: "0 0 0.25rem", fontWeight: 600, fontSize: "0.95rem" }}>
            Close {postingTitle}?
          </p>
          <p style={{ margin: "0 0 0.9rem", fontSize: "0.85rem", opacity: 0.7 }}>
            The position is filled, so it will come off the public careers page. Any other
            applicants stay here so you can still reply to them.
          </p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={handleClosePosition}
              style={{
                background: "#591AB2",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 0.9rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close position
            </button>
            <button
              onClick={() => setShowClosePrompt(false)}
              style={{
                background: "white",
                color: "#1f1d1a",
                border: "1px solid #d5d5d5",
                borderRadius: 6,
                padding: "0.5rem 0.9rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Keep it open
            </button>
          </div>
        </div>
      )}

      {positionClosed && (
        <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.85rem", opacity: 0.6 }}>
          {postingTitle} is filled and no longer public ✓
        </p>
      )}

      {showToast && (
        <Toast message="Employee created (mock)" onDismiss={() => setShowToast(false)} />
      )}
    </div>
  );
}
