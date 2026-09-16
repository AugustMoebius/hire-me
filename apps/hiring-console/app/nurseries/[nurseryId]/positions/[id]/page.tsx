import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobPosting, listApplicationsForPosting } from "../../../../../lib/api";
import { getNursery } from "../../../../../lib/nurseries";
import { positionPublicUrl } from "../../../../../lib/careers";
import { PositionStatusControl } from "./PositionStatusControl";

const cellStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ nurseryId: string; id: string }>;
}) {
  const { nurseryId, id } = await params;
  const nursery = getNursery(nurseryId);
  const posting = await getJobPosting(id);

  if (!nursery || !posting || posting.nurseryId !== nurseryId) {
    notFound();
  }

  const applications = await listApplicationsForPosting(id);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link href={`/nurseries/${nurseryId}`} style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        ← {nursery.name}
      </Link>

      <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0 0.25rem" }}>{posting.title}</h1>
      <PositionStatusControl postingId={posting.id} initialStatus={posting.status} />
      <a
        href={positionPublicUrl(posting.nurseryId, posting.id)}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          fontSize: "0.85rem",
          color: "#591AB2",
          fontWeight: 600,
        }}
      >
        View public listing ↗
      </a>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.4rem" }}>
          About the workplace
        </h3>
        <p style={{ marginTop: 0, marginBottom: "1.25rem", whiteSpace: "pre-wrap" }}>
          {posting.workplaceDescription}
        </p>

        <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>The role</h3>
        <p
          style={{
            marginTop: 0,
            marginBottom: posting.requiredQualifications ? "1.25rem" : 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {posting.roleDescription}
        </p>

        {posting.requiredQualifications && (
          <>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Required qualifications</h3>
            <p style={{ margin: 0 }}>{posting.requiredQualifications}</p>
          </>
        )}
      </section>

      <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
        Applications ({applications.length})
      </h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table style={{ background: "white", border: "1px solid #eee", borderRadius: 12 }}>
          <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Contact</th>
              <th style={cellStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td style={cellStyle}>
                  <Link
                    href={`/nurseries/${nurseryId}/applicants/${encodeURIComponent(application.applicant.email)}`}
                    style={{ color: "#591AB2", fontWeight: 600 }}
                  >
                    {application.applicant.name}
                  </Link>
                </td>
                <td style={cellStyle}>
                  <div>{application.applicant.email}</div>
                  <div style={{ opacity: 0.6 }}>{application.applicant.phone}</div>
                </td>
                <td style={cellStyle}>{application.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
