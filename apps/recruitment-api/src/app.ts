import express from "express";
import { jobPostingsRouter } from "./routes/job-postings";
import { jobApplicationsRouter } from "./routes/job-applications";
import { messagesRouter } from "./routes/messages";

export const app = express();

app.use(express.json());

// Prototype: the portal and console are separate origins during dev, and
// there's no real auth yet, so allow any origin rather than hardcoding ports.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/job-postings", jobPostingsRouter);
app.use("/job-applications", jobApplicationsRouter);
app.use("/messages", messagesRouter);
