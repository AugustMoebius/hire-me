import { Router } from "express";
import { prisma } from "../db";

export const jobPostingsRouter = Router();

jobPostingsRouter.get("/", async (_req, res) => {
  const jobPostings = await prisma.jobPosting.findMany();
  res.json(jobPostings);
});

jobPostingsRouter.get("/:id", async (req, res) => {
  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id: req.params.id },
  });

  if (!jobPosting) {
    res.status(404).json({ error: "Job posting not found" });
    return;
  }

  res.json(jobPosting);
});

// Admin: every applicant against this position.
jobPostingsRouter.get("/:id/applications", async (req, res) => {
  const applications = await prisma.jobApplication.findMany({
    where: { jobPostingId: req.params.id },
    include: { applicant: true },
  });

  res.json(applications);
});

// Admin: open -> filled when somebody is hired, or cancelled if the advert is
// pulled. Anything other than "open" drops off the public careers page.
jobPostingsRouter.patch("/:id/status", async (req, res) => {
  const jobPosting = await prisma.jobPosting.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  });

  res.json(jobPosting);
});

jobPostingsRouter.post("/", async (req, res) => {
  const {
    nurseryId,
    nurseryName,
    title,
    requiredQualifications,
    workplaceDescription,
    roleDescription,
    status,
  } = req.body;

  if (
    !nurseryId ||
    !nurseryName ||
    !title ||
    !workplaceDescription ||
    !roleDescription ||
    !status
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const qualifications = requiredQualifications ?? "";

  if (typeof qualifications !== "string") {
    res.status(400).json({ error: "requiredQualifications must be a string" });
    return;
  }

  const jobPosting = await prisma.jobPosting.create({
    data: {
      nurseryId,
      nurseryName,
      title,
      requiredQualifications: qualifications,
      workplaceDescription,
      roleDescription,
      status,
    },
  });

  res.status(201).json(jobPosting);
});
