import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobPosting, listApplicationsForPosting } from "../../../../../../../lib/api";
import { getNursery } from "../../../../../../../lib/nurseries";
import { ApplicationStatusControl } from "./ApplicationStatusControl";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ nurseryId: string; id: string; applicationId: string }>;
}) {
  const { nurseryId, id, applicationId } = await params;
  const nursery = getNursery(nurseryId);
  const posting = await getJobPosting(id);

  if (!nursery || !posting || posting.nurseryId !== nurseryId) {
    notFound();
  }

  const applications = await listApplicationsForPosting(id);
  const application = applications.find((a) => a.id === applicationId);

  if (!application) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link href={`/nurseries/${nurseryId}/positions/${id}`} style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        ← {posting.title}
      </Link>

      <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0 0.25rem" }}>
        {application.applicant.name}
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "1.75rem" }}>
        Applying for {posting.title} at {nursery.name}
      </p>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.5rem" }}>Contact</h3>
        <p style={{ margin: 0 }}>{application.applicant.email}</p>
        <p style={{ margin: 0 }}>{application.applicant.phone}</p>
      </section>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.5rem" }}>CV</h3>
        <p style={{ marginTop: 0, marginBottom: "1.25rem", whiteSpace: "pre-wrap" }}>
          {application.cv}
        </p>

        <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Resume</h3>
        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{application.resume}</p>
      </section>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: "1.5rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.75rem" }}>Status</h3>
        <ApplicationStatusControl
          applicationId={application.id}
          initialStatus={application.status}
          applicantName={application.applicant.name}
          applicantEmail={application.applicant.email}
          applicantPhone={application.applicant.phone}
          nurseryName={nursery.name}
          postingId={posting.id}
          postingTitle={posting.title}
          postingStatus={posting.status}
        />
      </section>
    </main>
  );
}
