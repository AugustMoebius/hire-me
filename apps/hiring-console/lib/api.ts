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

export type Applicant = {
  email: string;
  name: string;
  phone: string;
};

export type JobApplication = {
  id: string;
  jobPostingId: string;
  applicantEmail: string;
  cv: string;
  resume: string;
  status: string;
  createdAt: string;
  applicant: Applicant;
};

export async function listJobPostings(): Promise<JobPosting[]> {
  const res = await fetch(`${API_URL}/job-postings`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getJobPosting(id: string): Promise<JobPosting | null> {
  const res = await fetch(`${API_URL}/job-postings/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function listApplicationsForPosting(id: string): Promise<JobApplication[]> {
  const res = await fetch(`${API_URL}/job-postings/${id}/applications`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export type JobApplicationWithPosting = JobApplication & {
  jobPostingTitle: string;
};

// The API only exposes applications per-posting (the data model ties a
// JobApplication to one JobPosting). This composes that into a per-nursery
// view — an applicant can apply to several postings at the same nursery —
// without needing any new endpoint or schema change.
export async function listApplicationsForNursery(
  nurseryId: string
): Promise<JobApplicationWithPosting[]> {
  const postings = (await listJobPostings()).filter((p) => p.nurseryId === nurseryId);

  const perPosting = await Promise.all(
    postings.map(async (posting) => {
      const applications = await listApplicationsForPosting(posting.id);
      return applications.map((application) => ({
        ...application,
        jobPostingTitle: posting.title,
      }));
    })
  );

  return perPosting.flat();
}

export async function createJobPosting(data: {
  nurseryId: string;
  nurseryName: string;
  title: string;
  requiredQualifications: string;
  workplaceDescription: string;
  roleDescription: string;
}): Promise<{ ok: true; posting: JobPosting } | { ok: false; error: string }> {
  const res = await fetch(`${API_URL}/job-postings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, status: "open" }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.error ?? "Something went wrong creating the position." };
  }

  return { ok: true, posting: await res.json() };
}

export async function updateJobPostingStatus(id: string, status: string) {
  await fetch(`${API_URL}/job-postings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${API_URL}/job-applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.error ?? "Something went wrong updating the status." };
  }

  return { ok: true };
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
    body: JSON.stringify({ nurseryId, applicantEmail, sender: "manager", content }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.error ?? "Something went wrong sending the message." };
  }

  return { ok: true };
}
