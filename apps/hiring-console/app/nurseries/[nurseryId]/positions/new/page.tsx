import { notFound } from "next/navigation";
import Link from "next/link";
import { getNursery } from "../../../../../lib/nurseries";
import { NewPositionForm } from "./NewPositionForm";

export default async function NewPositionPage({
  params,
}: {
  params: Promise<{ nurseryId: string }>;
}) {
  const { nurseryId } = await params;
  const nursery = getNursery(nurseryId);

  if (!nursery) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link href={`/nurseries/${nurseryId}`} style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        ← {nursery.name}
      </Link>

      <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0 1.75rem" }}>New position</h1>

      <NewPositionForm nurseryId={nursery.id} nurseryName={nursery.name} />
    </main>
  );
}
