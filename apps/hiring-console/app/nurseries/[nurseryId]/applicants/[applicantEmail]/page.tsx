import Link from "next/link";
import { notFound } from "next/navigation";
import { listApplicationsForNursery, listMessages } from "../../../../../lib/api";
import { getNursery } from "../../../../../lib/nurseries";
import { MessageThread } from "./MessageThread";

const cellStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ nurseryId: string; applicantEmail: string }>;
}) {
  const { nurseryId, applicantEmail: encodedEmail } = await params;
  const applicantEmail = decodeURIComponent(encodedEmail);
  const nursery = getNursery(nurseryId);

  if (!nursery) {
    notFound();
  }

  const applications = (await listApplicationsForNursery(nurseryId)).filter(
    (a) => a.applicantEmail === applicantEmail
  );

  if (applications.length === 0) {
    notFound();
  }

  const { name, phone } = applications[0].applicant;
  const messages = await listMessages(nurseryId, applicantEmail);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link href={`/nurseries/${nurseryId}`} style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        ← {nursery.name}
      </Link>

      <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0 0.25rem" }}>{name}</h1>
      <p style={{ opacity: 0.6, marginBottom: "1.75rem" }}>
        {applicantEmail} · {phone}
      </p>

      <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
        Applications ({applications.length})
      </h2>

      <table style={{ background: "white", border: "1px solid #eee", borderRadius: 12 }}>
        <thead>
          <tr>
            <th style={cellStyle}>Job</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td style={cellStyle}>{application.jobPostingTitle}</td>
              <td style={cellStyle}>{application.status}</td>
              <td style={cellStyle}>
                <Link
                  href={`/nurseries/${nurseryId}/positions/${application.jobPostingId}/applications/${application.id}`}
                  style={{ color: "#591AB2", fontWeight: 600 }}
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: "1.15rem", margin: "2rem 0 1rem" }}>Messages</h2>

      <div
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: "1.5rem",
        }}
      >
        <MessageThread nurseryId={nurseryId} applicantEmail={applicantEmail} initialMessages={messages} />
      </div>
    </main>
  );
}
