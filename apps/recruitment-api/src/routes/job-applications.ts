import { Router } from "express";
import { prisma } from "../db";

export const jobApplicationsRouter = Router();

const APPLICATION_STATUSES = ["received", "reviewing", "hired", "rejected", "gone_quiet"];
const CLOSED_STATUSES = ["hired", "rejected", "gone_quiet"];

// Submit an application. Upserts the applicant by email so the same person
// applying to a different nursery is recognised as the same applicant.
jobApplicationsRouter.post("/", async (req, res) => {
  const { jobPostingId, name, email, phone, cv, resume } = req.body;

  if (!jobPostingId || !name || !email || !phone || !cv || !resume) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const applicant = await prisma.applicant.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
  });

  const application = await prisma.jobApplication.create({
    data: {
      jobPostingId,
      applicantEmail: applicant.email,
      cv,
      resume,
      status: "received",
    },
  });

  res.status(201).json(application);
});

// Applicant-facing status check. The id itself is the credential (see earlier
// discussion) — only a reduced, safe shape is returned, never the internal status.
jobApplicationsRouter.get("/:id", async (req, res) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: req.params.id },
    include: { jobPosting: true },
  });

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json({
    id: application.id,
    jobPostingTitle: application.jobPosting.title,
    nurseryId: application.jobPosting.nurseryId,
    nurseryName: application.jobPosting.nurseryName,
    applicantEmail: application.applicantEmail,
    status: CLOSED_STATUSES.includes(application.status) ? "closed" : "in_review",
  });
});

// Admin: move an application through its internal status lifecycle.
jobApplicationsRouter.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!APPLICATION_STATUSES.includes(status)) {
    res.status(400).json({
      error: `status must be one of: ${APPLICATION_STATUSES.join(", ")}`,
    });
    return;
  }

  const application = await prisma.jobApplication.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json(application);
});
