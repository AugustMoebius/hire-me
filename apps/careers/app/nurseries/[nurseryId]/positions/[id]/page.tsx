import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobPosting } from "../../../../../lib/api";
import { nurseryTheme } from "../../../../../lib/nurseryTheme";
import { NurseryBanner } from "../../../../../components/NurseryBanner";
import { ApplyForm } from "./ApplyForm";

export default async function PositionPage({
  params,
}: {
  params: Promise<{ nurseryId: string; id: string }>;
}) {
  const { nurseryId, id } = await params;
  const posting = await getJobPosting(id);

  if (!posting || posting.nurseryId !== nurseryId) {
    notFound();
  }

  const theme = nurseryTheme(posting.nurseryId);

  return (
    <main style={{ minHeight: "100vh", background: theme.bg }}>
      <NurseryBanner nurseryId={posting.nurseryId} nurseryName={posting.nurseryName} />

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
          You&apos;re applying to
        </div>
        <h1 style={{ fontSize: "2.1rem", marginBottom: "0.35rem", lineHeight: 1.15 }}>
          {posting.nurseryName}
        </h1>

        <Link
          href={`/nurseries/${posting.nurseryId}`}
          style={{
            display: "inline-block",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: theme.accent,
            marginBottom: "1rem",
          }}
        >
          See other openings at {posting.nurseryName} →
        </Link>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "2rem", opacity: 0.85 }}>
          {posting.title}
        </h2>

        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
          About {posting.nurseryName}
        </h3>
        <p style={{ lineHeight: 1.6, marginBottom: "1.75rem", whiteSpace: "pre-wrap" }}>
          {posting.workplaceDescription}
        </p>

        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>The role</h3>
        <p style={{ lineHeight: 1.6, marginBottom: "1.75rem", whiteSpace: "pre-wrap" }}>
          {posting.roleDescription}
        </p>

        {posting.requiredQualifications && (
          <>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
              Required qualifications
            </h3>
            <p style={{ lineHeight: 1.6, marginBottom: "2.5rem" }}>
              {posting.requiredQualifications}
            </p>
          </>
        )}

        <section
          style={{
            background: "white",
            borderRadius: 12,
            padding: "1.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: "1.15rem", marginTop: 0, marginBottom: "1.25rem" }}>
            Apply for this role
          </h3>
          <ApplyForm jobPostingId={posting.id} accent={theme.accent} />
        </section>
      </div>
    </main>
  );
}
