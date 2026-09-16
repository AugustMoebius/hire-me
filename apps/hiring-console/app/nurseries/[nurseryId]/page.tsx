import Link from "next/link";
import { notFound } from "next/navigation";
import { listJobPostings, listApplicationsForNursery } from "../../../lib/api";
import { getNursery } from "../../../lib/nurseries";
import { nurseryPublicUrl } from "../../../lib/careers";
import { CopyLinkButton } from "../../../components/CopyLinkButton";

const cellStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NurseryDashboard({
  params,
}: {
  params: Promise<{ nurseryId: string }>;
}) {
  const { nurseryId } = await params;
  const nursery = getNursery(nurseryId);

  if (!nursery) {
    notFound();
  }

  const allPostings = await listJobPostings();
  const postings = allPostings.filter((p) => p.nurseryId === nurseryId);
  const applications = await listApplicationsForNursery(nurseryId);

  const applicantsByEmail = new Map<
    string,
    { name: string; email: string; phone: string; jobTitles: string[]; appliedAt: string }
  >();
  for (const application of applications) {
    const existing = applicantsByEmail.get(application.applicantEmail);
    if (existing) {
      existing.jobTitles.push(application.jobPostingTitle);
      // One row per person, so the row carries their most recent application.
      if (application.createdAt > existing.appliedAt) {
        existing.appliedAt = application.createdAt;
      }
    } else {
      applicantsByEmail.set(application.applicantEmail, {
        name: application.applicant.name,
        email: application.applicant.email,
        phone: application.applicant.phone,
        jobTitles: [application.jobPostingTitle],
        appliedAt: application.createdAt,
      });
    }
  }
  const applicants = [...applicantsByEmail.values()].sort((a, b) =>
    b.appliedAt.localeCompare(a.appliedAt)
  );

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link href="/" style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        ← All nurseries
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.5rem 0 1.75rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>{nursery.name}</h1>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <CopyLinkButton url={nurseryPublicUrl(nurseryId)} label="Copy public link" />
          <Link
            href={`/nurseries/${nurseryId}/positions/new`}
            style={{
              background: "#591AB2",
              color: "white",
              borderRadius: 8,
              padding: "0.6rem 1.1rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New position
          </Link>
        </div>
      </div>

      <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Job postings</h2>

      {postings.length === 0 ? (
        <p style={{ marginBottom: "2.5rem" }}>No positions yet.</p>
      ) : (
        <table
          style={{
            background: "white",
            border: "1px solid #eee",
            borderRadius: 12,
            marginBottom: "2.5rem",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Title</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Applicants</th>
            </tr>
          </thead>
          <tbody>
            {postings.map((posting) => (
              <tr key={posting.id}>
                <td style={cellStyle}>
                  <Link href={`/nurseries/${nurseryId}/positions/${posting.id}`}>
                    {posting.title}
                  </Link>
                </td>
                <td style={cellStyle}>{posting.status}</td>
                <td style={cellStyle}>
                  {applications.filter((a) => a.jobPostingId === posting.id).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Applications</h2>

      {applicants.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table style={{ background: "white", border: "1px solid #eee", borderRadius: 12 }}>
          <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Contact</th>
              <th style={cellStyle}>Jobs applied for</th>
              <th style={cellStyle}>Applied</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.email}>
                <td style={cellStyle}>
                  <Link
                    href={`/nurseries/${nurseryId}/applicants/${encodeURIComponent(applicant.email)}`}
                    style={{ color: "#591AB2", fontWeight: 600 }}
                  >
                    {applicant.name}
                  </Link>
                </td>
                <td style={cellStyle}>
                  <div>{applicant.email}</div>
                  <div style={{ opacity: 0.6 }}>{applicant.phone}</div>
                </td>
                <td style={cellStyle}>{applicant.jobTitles.join(", ")}</td>
                <td style={cellStyle}>{formatDate(applicant.appliedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
