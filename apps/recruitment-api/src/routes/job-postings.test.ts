import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { app } from "../app";
import { prisma } from "../db";

// Runs against a throwaway SQLite file (see the `test` script), so it never
// touches the seeded dev database.
let server: Server;
let baseUrl: string;

before(() => {
  server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  server.close();
  await prisma.$disconnect();
});

test("POST /job-postings creates a position and persists it", async () => {
  const res = await fetch(`${baseUrl}/job-postings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nurseryId: "nursery-1",
      nurseryName: "Willow Tree Nursery",
      title: "Room Leader — Babies",
      requiredQualifications: "Level 3, First Aid",
      workplaceDescription: "A 45-place nursery on the edge of the common.",
      roleDescription: "Lead our baby room.",
      status: "open",
    }),
  });

  assert.equal(res.status, 201);

  const posting = await res.json();
  assert.ok(posting.id);
  assert.equal(posting.title, "Room Leader — Babies");
  assert.equal(posting.nurseryId, "nursery-1");
  // A new position has to come back open, or it would never reach the
  // public careers page — that filters on status === "open".
  assert.equal(posting.status, "open");

  // Really written, not just echoed back.
  const stored = await prisma.jobPosting.findUnique({ where: { id: posting.id } });
  assert.equal(stored?.title, "Room Leader — Babies");
  assert.equal(stored?.requiredQualifications, "Level 3, First Aid");
});
