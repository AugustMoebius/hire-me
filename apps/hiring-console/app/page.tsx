import Link from "next/link";
import { NURSERIES } from "../lib/nurseries";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div
        style={{
          background: "#fff4e0",
          border: "1px solid #f0c986",
          borderRadius: 10,
          padding: "0.9rem 1.1rem",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        <strong>For demo purposes only.</strong> Select the nursery you would like to manage
      </div>

      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Hiring console</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Choose a nursery to manage.</p>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
        {NURSERIES.map((nursery) => (
          <li key={nursery.id}>
            <Link
              href={`/nurseries/${nursery.id}`}
              style={{
                display: "block",
                background: "white",
                border: "1px solid #e2e2e2",
                borderRadius: 12,
                padding: "1.1rem 1.25rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {nursery.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
