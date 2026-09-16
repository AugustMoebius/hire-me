import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicationStatus, listMessages } from "../../../lib/api";
import { nurseryTheme } from "../../../lib/nurseryTheme";
import { NurseryBanner } from "../../../components/NurseryBanner";
import { MessageThread } from "./MessageThread";

export default async function ApplicationStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplicationStatus(id);

  if (!application) {
    notFound();
  }

  const theme = nurseryTheme(application.nurseryId);
  const messages = await listMessages(application.nurseryId, application.applicantEmail);

  return (
    <main style={{ minHeight: "100vh", background: theme.bg }}>
      <NurseryBanner nurseryId={application.nurseryId} nurseryName={application.nurseryName} />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div
          style={{
            textTransform: "uppercase",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            opacity: 0.6,
            margin: "1.75rem 0 0.4rem",
          }}
        >
          Your application to
        </div>
        <h1 style={{ fontSize: "2.1rem", marginBottom: "0.35rem", lineHeight: 1.15 }}>
          {application.nurseryName}
        </h1>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "2rem", opacity: 0.85 }}>
          {application.jobPostingTitle}
        </h2>

        <section
          style={{
            background: "white",
            borderRadius: 12,
            padding: "1.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontWeight: 600 }}>Thanks for your application.</p>

          <p style={{ margin: "0 0 1rem" }}>
            {application.status === "closed"
              ? "This application is now closed."
              : "It's being reviewed — you'll hear back soon."}
          </p>

          <p style={{ margin: 0, opacity: 0.75 }}>
            You&apos;d normally get an email with a link back to this page (not wired up in this
            prototype). For now, just bookmark this page so you can check back later.
          </p>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 12,
            padding: "1.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ margin: "0 0 0.35rem", fontWeight: 600 }}>Messages</p>
          <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", opacity: 0.65 }}>
            This is the entire conversation with {application.nurseryName} — it&apos;s shared
            across any other applications you have there too.
          </p>
          <MessageThread
            nurseryId={application.nurseryId}
            applicantEmail={application.applicantEmail}
            initialMessages={messages}
            accent={theme.accent}
          />
        </section>

        <Link
          href={`/nurseries/${application.nurseryId}`}
          style={{
            display: "inline-block",
            background: theme.accent,
            color: "white",
            borderRadius: 8,
            padding: "0.7rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          See other openings at {application.nurseryName} →
        </Link>
      </div>
    </main>
  );
}
