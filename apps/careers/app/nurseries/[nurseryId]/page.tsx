import Link from "next/link";
import { listJobPostings } from "../../../lib/api";
import { nurseryTheme } from "../../../lib/nurseryTheme";
import { NurseryBanner } from "../../../components/NurseryBanner";

export default async function NurseryPage({
  params,
}: {
  params: Promise<{ nurseryId: string }>;
}) {
  const { nurseryId } = await params;
  const allPostings = await listJobPostings();
  const nurseryPostings = allPostings.filter((p) => p.nurseryId === nurseryId);
  const openPostings = nurseryPostings.filter((p) => p.status === "open");

  const nurseryName = nurseryPostings[0]?.nurseryName ?? "This nursery";
  const theme = nurseryTheme(nurseryId);

  return (
    <main style={{ minHeight: "100vh", background: theme.bg }}>
      <NurseryBanner nurseryId={nurseryId} nurseryName={nurseryName} />

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
          Open positions at
        </div>
        <h1 style={{ fontSize: "2.1rem", marginBottom: "2rem", lineHeight: 1.15 }}>
          {nurseryName}
        </h1>

        {openPostings.length === 0 && <p>No open positions right now — check back soon.</p>}

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
          {openPostings.map((posting) => (
            <li key={posting.id}>
              <Link
                href={`/nurseries/${nurseryId}/positions/${posting.id}`}
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: 12,
                  padding: "1.1rem 1.25rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {posting.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
