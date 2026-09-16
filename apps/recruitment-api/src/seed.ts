import { prisma } from "./db";

const DAY_MS = 24 * 60 * 60 * 1000;
const start = Date.now();

// Timestamps are staggered so the console reads like a real inbox: the newest
// applications at the top are the ones nobody has replied to yet, and the ones
// that have been through the whole process are the oldest.
const daysAgo = (days: number) => new Date(start - days * DAY_MS);

// Runs on every `predev`, but only writes once — leaves nursery-1 empty on
// purpose (a fresh/no-applicants nursery is itself a real state to review)
// and gives a reviewer something to click through on the other two without
// having to fill the app in by hand first.
async function seed() {
  const existing = await prisma.jobPosting.count();
  if (existing > 0) return;

  const brambleBank = {
    id: "nursery-2",
    name: "Bramble Bank Nursery",
  };
  const sunflowerFields = {
    id: "nursery-3",
    name: "Sunflower Fields Nursery",
  };

  const babyRoom = await prisma.jobPosting.create({
    data: {
      nurseryId: brambleBank.id,
      nurseryName: brambleBank.name,
      title: "Baby Room Practitioner",
      requiredQualifications: "Level 2",
      workplaceDescription: "A cosy 20-place nursery near the park.",
      roleDescription: "Join our baby room team, mornings and afternoons.",
      status: "open",
      createdAt: daysAgo(30),
    },
  });

  const roomLeader = await prisma.jobPosting.create({
    data: {
      nurseryId: brambleBank.id,
      nurseryName: brambleBank.name,
      title: "Room Leader — Toddlers",
      requiredQualifications: "Level 3, First Aid",
      workplaceDescription: "A cosy 20-place nursery near the park.",
      roleDescription: "Lead our toddler room and mentor two junior practitioners.",
      status: "open",
      createdAt: daysAgo(21),
    },
  });

  const nurseryCook = await prisma.jobPosting.create({
    data: {
      nurseryId: sunflowerFields.id,
      nurseryName: sunflowerFields.name,
      title: "Nursery Cook",
      requiredQualifications: "Food Hygiene Level 2",
      workplaceDescription: "A sunny 30-place nursery with its own allotment garden.",
      roleDescription: "Cook fresh meals daily for children and staff.",
      status: "open",
      createdAt: daysAgo(14),
    },
  });

  const preschoolAssistant = await prisma.jobPosting.create({
    data: {
      nurseryId: sunflowerFields.id,
      nurseryName: sunflowerFields.name,
      title: "Pre-School Assistant",
      requiredQualifications: "Level 2",
      workplaceDescription: "A sunny 30-place nursery with its own allotment garden.",
      roleDescription: "Support our pre-school room with a focus on outdoor learning.",
      status: "open",
      createdAt: daysAgo(20),
    },
  });

  const applicants = [
    { email: "priya.nair@example.com", name: "Priya Nair", phone: "07700 900001" },
    { email: "tom.fischer@example.com", name: "Tom Fischer", phone: "07700 900002" },
    { email: "elena.vasquez@example.com", name: "Elena Vasquez", phone: "07700 900003" },
    { email: "jordan.lee@example.com", name: "Jordan Lee", phone: "07700 900004" },
    { email: "maya.whitfield@example.com", name: "Maya Whitfield", phone: "07700 900005" },
    { email: "sam.okafor@example.com", name: "Sam Okafor", phone: "07700 900006" },
    { email: "ruth.adeyemi@example.com", name: "Ruth Adeyemi", phone: "07700 900007" },
  ];

  for (const applicant of applicants) {
    await prisma.applicant.create({ data: applicant });
  }

  // Bramble Bank — a spread of statuses, two with a message thread going.

  // Oldest, and the only one taken all the way through to hired.
  await prisma.jobApplication.create({
    data: {
      jobPostingId: babyRoom.id,
      applicantEmail: "elena.vasquez@example.com",
      cv: "Newly Level 2 qualified, six months as a nursery assistant on a work placement.",
      resume: "elena-vasquez-cv.pdf",
      status: "hired",
      createdAt: daysAgo(24),
    },
  });
  await prisma.message.createMany({
    data: [
      {
        nurseryId: brambleBank.id,
        applicantEmail: "elena.vasquez@example.com",
        sender: "manager",
        content: "We'd love to offer you the role! Can you start the 1st of next month?",
        createdAt: daysAgo(20),
      },
      {
        nurseryId: brambleBank.id,
        applicantEmail: "elena.vasquez@example.com",
        sender: "applicant",
        content: "That's wonderful news, yes that works for me. Thank you!",
        createdAt: daysAgo(19),
      },
    ],
  });

  await prisma.jobApplication.create({
    data: {
      jobPostingId: babyRoom.id,
      applicantEmail: "priya.nair@example.com",
      cv: "3 years at a 40-place nursery in Bristol, baby room throughout. Level 2 qualified, working towards Level 3.",
      resume: "priya-nair-cv.pdf",
      status: "reviewing",
      createdAt: daysAgo(18),
    },
  });
  await prisma.message.createMany({
    data: [
      {
        nurseryId: brambleBank.id,
        applicantEmail: "priya.nair@example.com",
        sender: "manager",
        content: "Thanks for applying, Priya! Are you free for a quick call this week?",
        createdAt: daysAgo(17),
      },
      {
        nurseryId: brambleBank.id,
        applicantEmail: "priya.nair@example.com",
        sender: "applicant",
        content: "Yes, I'm free Wednesday or Thursday afternoon.",
        createdAt: daysAgo(16),
      },
    ],
  });

  await prisma.jobApplication.create({
    data: {
      jobPostingId: roomLeader.id,
      applicantEmail: "jordan.lee@example.com",
      cv: "1 year as a nursery practitioner, no room leader experience yet.",
      resume: "jordan-lee-cv.pdf",
      status: "rejected",
      createdAt: daysAgo(16),
    },
  });
  await prisma.message.create({
    data: {
      nurseryId: brambleBank.id,
      applicantEmail: "jordan.lee@example.com",
      sender: "manager",
      content:
        "Thanks for your interest, Jordan — we've decided to go with a candidate with more room leader experience this time. We'll keep your details for future openings.",
      createdAt: daysAgo(11),
    },
  });

  // Newest at Bramble Bank, still "received" and never replied to — this is the
  // row the manager should be looking at first.
  await prisma.jobApplication.create({
    data: {
      jobPostingId: roomLeader.id,
      applicantEmail: "tom.fischer@example.com",
      cv: "5 years childcare experience, 2 as a deputy room leader. Level 3, paediatric first aid certified.",
      resume: "tom-fischer-cv.pdf",
      status: "received",
      createdAt: daysAgo(1),
    },
  });

  // Sunflower Fields — kept a little lighter than Bramble Bank.

  await prisma.jobApplication.create({
    data: {
      jobPostingId: preschoolAssistant.id,
      applicantEmail: "ruth.adeyemi@example.com",
      cv: "First childcare role, currently completing a Level 2 apprenticeship.",
      resume: "ruth-adeyemi-cv.pdf",
      status: "gone_quiet",
      createdAt: daysAgo(12),
    },
  });
  await prisma.message.create({
    data: {
      nurseryId: sunflowerFields.id,
      applicantEmail: "ruth.adeyemi@example.com",
      sender: "manager",
      content: "Hi Ruth, are you still interested in the role? We'd love to hear back from you.",
      createdAt: daysAgo(7),
    },
  });

  await prisma.jobApplication.create({
    data: {
      jobPostingId: preschoolAssistant.id,
      applicantEmail: "sam.okafor@example.com",
      cv: "2 years as a pre-school assistant, strong interest in outdoor/forest-school learning. Level 2 qualified.",
      resume: "sam-okafor-cv.pdf",
      status: "reviewing",
      createdAt: daysAgo(6),
    },
  });
  await prisma.message.create({
    data: {
      nurseryId: sunflowerFields.id,
      applicantEmail: "sam.okafor@example.com",
      sender: "manager",
      content: "Your forest-school experience really stood out — could you share more about that in an interview?",
      createdAt: daysAgo(5),
    },
  });

  // Newest at Sunflower Fields, also still waiting on a first reply.
  await prisma.jobApplication.create({
    data: {
      jobPostingId: nurseryCook.id,
      applicantEmail: "maya.whitfield@example.com",
      cv: "8 years as a catering assistant, 2 in a school kitchen. Food Hygiene Level 2.",
      resume: "maya-whitfield-cv.pdf",
      status: "received",
      createdAt: daysAgo(2),
    },
  });

  console.log("Seeded Bramble Bank Nursery and Sunflower Fields Nursery (Willow Tree Nursery left empty).");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
