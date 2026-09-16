export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type JobPosting = {
  id: string;
  nurseryId: string;
  nurseryName: string;
  title: string;
  requiredQualifications: string;
  workplaceDescription: string;
  roleDescription: string;
  status: string;
  createdAt: string;
};

export async function getJobPosting(id: string): Promise<JobPosting | null> {
  const res = await fetch(`${API_URL}/job-postings/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function listJobPostings(): Promise<JobPosting[]> {
  const res = await fetch(`${API_URL}/job-postings`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export type ApplicationStatus = {
  id: string;
  jobPostingTitle: string;
  nurseryId: string;
  nurseryName: string;
  applicantEmail: string;
  status: "in_review" | "closed";
};

export async function getApplicationStatus(id: string): Promise<ApplicationStatus | null> {
  const res = await fetch(`${API_URL}/job-applications/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export type Message = {
  id: string;
  nurseryId: string;
  applicantEmail: string;
  sender: "manager" | "applicant";
  content: string;
  createdAt: string;
};

export async function listMessages(nurseryId: string, applicantEmail: string): Promise<Message[]> {
  const params = new URLSearchParams({ nurseryId, applicantEmail });
  const res = await fetch(`${API_URL}/messages?${params}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function sendMessage(
  nurseryId: string,
  applicantEmail: string,
  content: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nurseryId, applicantEmail, sender: "applicant", content }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.error ?? "Something went wrong sending your message." };
  }

  return { ok: true };
}
