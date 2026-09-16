import { Router } from "express";
import { prisma } from "../db";

export const messagesRouter = Router();

const SENDERS = ["manager", "applicant"];

// The conversation thread between a nursery and an applicant — shared across
// every application that applicant has at that nursery.
messagesRouter.get("/", async (req, res) => {
  const { nurseryId, applicantEmail } = req.query;

  if (typeof nurseryId !== "string" || typeof applicantEmail !== "string") {
    res.status(400).json({ error: "nurseryId and applicantEmail query params are required" });
    return;
  }

  const messages = await prisma.message.findMany({
    where: { nurseryId, applicantEmail },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
});

messagesRouter.post("/", async (req, res) => {
  const { nurseryId, applicantEmail, sender, content } = req.body;

  if (!nurseryId || !applicantEmail || !sender || !content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!SENDERS.includes(sender)) {
    res.status(400).json({ error: `sender must be one of: ${SENDERS.join(", ")}` });
    return;
  }

  const applicant = await prisma.applicant.findUnique({ where: { email: applicantEmail } });

  if (!applicant) {
    res.status(404).json({ error: "Applicant not found" });
    return;
  }

  const message = await prisma.message.create({
    data: { nurseryId, applicantEmail, sender, content },
  });

  res.status(201).json(message);
});
