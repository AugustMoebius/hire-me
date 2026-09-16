# Famly technical interview
This repo contains my solution to the technical challenge. I spent approximately 3 hours on development, and some extra time writing this document.


## High level system architecture
The recruiting platform is organized into 3 components: an admin platform for managers, a public facing web app for job seekers and a recruitment API to handle the logic. For this prototype that repo is organized as a mono-repo and the code for each respective app can be found in the *apps* directory. The technology choices have been driven by the ability to do rapid prototyping and are not necessarily the best choices for a production deployment. Overview of components:

### Hiring console(*apps/hiring-console*)
This component should be imagined to live inside the management side of Famly, in this prototype it's an isolated web app. This component is what nursery managers would use to manage job postings and applicants.

**Tech:** React(Next.js), Typescript

### Public facing careers site(*apps/careers*)
This is a new component in the Famly ecosystem that is deliberately isolated from the core Famly app(s). This is hosted by Famly, but probably under a different domain. This is the place a candidate can go to and see and apply for open positions at a nursery.

**Tech:** React(Next.js), Typescript

### The recruitment API(*apps/recruitment-api*)
The recruitment (REST) API is the backend powering everything related to recruitment, again isolated from other Famly systems. This component defines the models needed to manage the full recruitment process. The two aforementioned web apps consume this API.

**Tech:** Express.js, Typescript, Prisma, SQLite


### Notes on architecture
The most important takeaway is that recruitment data and business logic is isolated from the core Famly ecosystem. I did this for several reasons:
* **Domain clarity**: Recruitment is very different from the core business and has no impact on the day to day operations. Development on the recruitment platform carries different risks and might benefit from a different development lifecycle.
* **Security**: As parts of the recruiting portal are open to the public, mistakes here could be an attack vector. Isolation limits the potential damage.
* **Unintended impact on core platform**: Isolation prevents bugs and other issues in the recruitment platform from negatively impacting the Famly ecosystem.


## The model
The recruitment API owns four models: `JobPosting`, `Applicant`, `JobApplication` and `Message`.

### What the job seeker touches, and what they are in the system
A candidate touches four components and never creates an account: a nursery's overview page, a job posting, the application form, and afterwards a status page carrying the conversation with the nursery.

In the system that candidate is an **`Applicant`**, keyed by email address, and each submission is a **`JobApplication`** joining that applicant to a **`JobPosting`**. Keying identity on email rather than per submission is deliberate: a person applying for three positions in the same nursery is still the same person.

### What the manager opens, and the lifecycle model
A manager opens the hiring console for their nursery, where every posting and every applicant is listed in one place and either can be opened from there. Two lifecycles carry the work:

* **`JobPosting.status`**: `open → filled | cancelled`. Only `open` postings are listed on the public careers site, so closing a position takes the advert down immediately while the posting and its applicants stay in the console as a record.
* **`JobApplication.status`**: `received → reviewing → hired | rejected | gone_quiet`. Status can be changed by manager.

Hiring is where the two meet: marking an application `hired` is what prompts the manager to create the employee in Famly, and to close the position that person filled.

### Messages and visibility
`Message` is scoped to a nursery and an applicant rather than to a single application, so one thread covers everything those two have ever discussed.

The applicant facing endpoint projects the five application statuses down to `in_review` or `closed`, so `hired`, `rejected` and `gone_quiet` never leave the console.


## Notable design decisions
**Styling of the public recruitment related pages**: The place where candidates go to apply is styled with focus on the specific nursery and not on Famly. This is done because the candidates most likely won't know or trust Famly, but probably know the nursery they are about to apply to. 

**Job applications are organized around the specific candidate, not the position**: To make communication easy, an admin talks to a candidate in one place even if that person has applied to several positions. 

**Important pages have specific links**: Links for specific job postings or all job postings associated with a nursery can easily be shared and will lead directly to the desired page. 

**You cannot see ALL job postings**: Famly is not a full-on recruitment platform(yet), so candidates must be sent to a specific posting or specific nursery overview. It's not possible to see ALL open positions in the Famly recruitment platform. (Maybe for the future)


**Application sent success page protected by obscurity**: The page a candidate sees upon submission is in this prototype also the place for communication. This page needs to be public but we don't want to trouble candidates with logins. In the current implementation reaching this page requires knowing the UUID which is practically impossible to guess. An extra layer of security could be email verification.

**A candidate does not exist in the Famly system before hired**: A candidate has no reason to be part of Famly before that person is hired and we don't need the same level of detail on a candidate as we do on an actual employee(GDPR compliance). To make the process of adding a new employee easy, a manager can create the employee in Famly right away upon hiring. In this prototype the known data is autofilled and the manager is asked to fill in things that were not registered in the recruitment process. 


## Future work
During development I took a handful of notes about improvements that I didn't have time for or that didn't make sense for a prototype.

**Faster and easier screening of candidates**: I do provide base level tools for admin to get an overview of applications, but it could be improved to make it easier to find the best candidates. An idea could be to allow multiple choice options for critical qualification or potentially use AI to scan the application. It's also not obvious to a manager if they have already looked at an application in the current prototype.

**Closing of application upon hiring**: Currently open applications are stranded when a position is filled by another person; these should be closed and an automatic rejection message should be sent.

**Notifications and automatic messaging**: Currently there are no notifications to managers nor candidates. During different steps in the process some messages could be automated to save precious time for managers.

**Groups**: Groups of nurseries are only implemented on a surface level in the prototype and are not properly modelled. 


**Endpoint auth**: There is currently no endpoint authentication and all admin related endpoints should be properly protected. Managers should only be allowed to see data related to the nursery they are a part of. 

**Validation and error handling**: The prototype is written with the expectation to demo the 'golden path(s)', data fields are mostly not validated and errors are not handled gracefully. 

**Automated testing**: As this is a prototype the automated testing is extremely light and should be vastly improved in a real implementation.

**Proper messaging**: The messaging implementation is hacked on for the prototype. In the real world it should likely be an email integration as this is what most candidates would expect and trust.



## Development process of this prototype
This solution has been developed using Claude Code extensively in a controlled fashion. I started by analysing the task and created some core requirements, which were refined with help from Claude. I laid out the architecture I wanted and had Claude wire up the required boilerplate code. I then progressed to generating the data model and routes in the API, being extreme specific in my requests. For the frontend related code i provided the requirements, created a plan  and reviwed the code that was generated along the way, jumping in frequently with fixes and improvement suggestion. Along the way I had Claude perform validate solutions using scripting and browser testing.


## Running the solution locally
No configuration is needed — there is no `.env` to create and no database to set up by hand. Every setting has a working local default. You need Node 20.9 or newer, then from the repository root:

```bash
npm install
npm run dev
```

`npm install` installs all three workspaces. `npm run dev` creates and seeds the SQLite database on first run, then starts all three components together:

| Component | URL |
| --- | --- |
| Hiring console (manager) | http://localhost:3002 |
| Careers site (public) | http://localhost:3001 |
| Recruitment API | http://localhost:4000 |

**Start at the hiring console on http://localhost:3002.** It lists the three nurseries that have different amounts of prepopulated data. From the console you can get "public" links to already created job postings or create new ones.

### Seed data
Two nurseries are seeded so there is something to click through immediately. Bramble Bank and Sunflower Fields both have open positions and applicants spread across the whole lifecycle, with application dates staggered over the past few weeks — the newest applications are the ones nobody has replied to yet. Willow Tree Nursery is deliberately left empty, since a nursery that has not posted anything yet is its own state worth reviewing.

The seed only writes when the database is empty. To get back to a clean state, delete `apps/recruitment-api/dev.db` and run `npm run dev` again.

### Tests
```bash
npm test -w recruitment-api
```
Runs against a throwaway database, so it never touches your seeded data.


