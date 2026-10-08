export interface ChecklistItem {
  id: string;
  number: string;
  title: string;
  category: string;
  categoryRange: string;
  summary: string;
  keyRule?: string;
  questions?: string[];
  subtasks: { id: string; text: string; done: boolean; critical?: boolean }[];
  tableData?: { [key: string]: string }[];
  tableColumns?: { key: string; label: string }[];
  codeSnippet?: string;
}

export interface MentalModelItem {
  concern: string;
  rememberThis: string;
  category: string;
}

export const KEY_QUESTIONS_OVERVIEW = [
  { area: 'Architecture', question: 'How do components communicate and scale?' },
  { area: 'Frontend', question: 'Is it responsive, accessible and resilient?' },
  { area: 'Backend', question: 'Are APIs validated, secure and maintainable?' },
  { area: 'Data', question: 'Is the database designed for real queries and growth?' },
  { area: 'Security', question: 'Who can access what, and how are secrets protected?' },
  { area: 'Reliability', question: 'What happens when a service fails?' },
  { area: 'Operations', question: 'How do you deploy, monitor and roll back?' },
];

export const PRODUCTION_SECTIONS: ChecklistItem[] = [
  // 01-03 Architecture, Frontend & Backend
  {
    id: 'sec-01',
    number: '01',
    title: 'System Architecture',
    category: 'Architecture',
    categoryRange: '01–03 Architecture, Frontend & Backend',
    summary: 'Start with requirements before generating a large codebase. Map the major components and their responsibilities.',
    keyRule: 'Typical flow: User → CDN / Load Balancer → Frontend → API → Authentication → Business Logic → Database / Cache / Storage → External Services.',
    questions: [
      'What are the critical user flows?',
      'Which data is persistent vs transient?',
      'Which operations are computationally or network expensive?',
      'Which components need independent scaling?',
      'What happens when the database or third-party API fails?'
    ],
    subtasks: [
      { id: '01-1', text: 'Define end-to-end component diagram with clear boundaries', done: false, critical: true },
      { id: '01-2', text: 'Document data persistence paths and storage guarantees', done: false, critical: true },
      { id: '01-3', text: 'Identify decoupled services suitable for async execution', done: false },
      { id: '01-4', text: 'Plan degradation behavior for upstream & downstream failures', done: false, critical: true },
    ]
  },
  {
    id: 'sec-02',
    number: '02',
    title: 'Frontend beyond UI',
    category: 'Frontend',
    categoryRange: '01–03 Architecture, Frontend & Backend',
    summary: 'Review responsive behavior, semantic HTML, keyboard navigation, focus states, contrast, loading states, empty states, error states, validation and bundle performance.',
    keyRule: 'Client-side validation improves user experience. It must not be treated as the security boundary; the server must validate untrusted input.',
    subtasks: [
      { id: '02-1', text: 'Test layout on mobile, tablet, laptop, and ultra-wide viewports', done: false, critical: true },
      { id: '02-2', text: 'Implement accessible semantic HTML elements (nav, main, section, header)', done: false },
      { id: '02-3', text: 'Ensure full keyboard navigation & visible high-contrast focus rings', done: false },
      { id: '02-4', text: 'Design explicit Loading, Empty, and Error states for every view', done: false, critical: true },
      { id: '02-5', text: 'Audit JavaScript bundle size, dynamic imports & tree-shaking', done: false },
    ]
  },
  {
    id: 'sec-03',
    number: '03',
    title: 'Backend & API Design',
    category: 'Backend',
    categoryRange: '01–03 Architecture, Frontend & Backend',
    summary: 'Prefer clear layers such as Route → Controller → Service → Data Access → Database. Review validation, authentication, authorization, status codes, pagination, filtering, timeouts and external-service failures.',
    keyRule: 'A generated API is only a starting point. Define contracts: request shape, response shape, error format, authorization rules and expected failure behavior.',
    subtasks: [
      { id: '03-1', text: 'Separate code into Route → Controller → Service → Data Access layers', done: false, critical: true },
      { id: '03-2', text: 'Strict schema validation on all inputs (e.g. Zod / Joi / Pydantic)', done: false, critical: true },
      { id: '03-3', text: 'Standardize HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)', done: false },
      { id: '03-4', text: 'Implement cursor or offset pagination and query filtering', done: false },
      { id: '03-5', text: 'Configure explicit request timeouts on all network calls', done: false, critical: true },
    ]
  },

  // 04-06 Data, Authentication & Security
  {
    id: 'sec-04',
    number: '04',
    title: 'Database Design',
    category: 'Database',
    categoryRange: '04–06 Data, Authentication & Security',
    summary: 'Structure persistent data models, relations, query execution paths, and safe deployment mechanics.',
    keyRule: 'A production database is optimized for real-world read/write query patterns, strict constraints, and transactional consistency.',
    tableColumns: [
      { key: 'review', label: 'Review Dimension' },
      { key: 'question', label: 'Engineering Questions' }
    ],
    tableData: [
      { review: 'Schema', question: 'What entities and relationships exist?' },
      { review: 'Indexes', question: 'Which real queries need fast lookup?' },
      { review: 'Constraints', question: 'Which values must be unique or required?' },
      { review: 'Transactions', question: 'Which changes must succeed together?' },
      { review: 'Migrations', question: 'How are schema changes deployed safely?' },
      { review: 'Backups', question: 'How will data be restored in a disaster?' }
    ],
    subtasks: [
      { id: '04-1', text: 'Define foreign key relationships & database constraints', done: false, critical: true },
      { id: '04-2', text: 'Add compound indexes on frequent filter/sort query columns', done: false, critical: true },
      { id: '04-3', text: 'Wrap multi-step writes in ACID database transactions', done: false },
      { id: '04-4', text: 'Version-controlled, automated reversible migration scripts', done: false, critical: true },
      { id: '04-5', text: 'Automate daily backups with tested recovery verification', done: false, critical: true }
    ]
  },
  {
    id: 'sec-05',
    number: '05',
    title: 'Authentication & Authorization',
    category: 'Security',
    categoryRange: '04–06 Data, Authentication & Security',
    summary: 'Review credential handling, password hashing, token/session lifetime, secure cookies where applicable, logout/recovery flows, role checks and brute-force protection.',
    keyRule: 'Authentication = "Who are you?" | Authorization = "What are you allowed to do?"\nHiding an admin button in the frontend is not authorization. The backend must enforce permissions on every protected operation.',
    subtasks: [
      { id: '05-1', text: 'Store passwords with modern hashing (Argon2id or bcrypt with high work factor)', done: false, critical: true },
      { id: '05-2', text: 'Use HttpOnly, Secure, SameSite=Lax/Strict session cookies or short-lived JWTs', done: false, critical: true },
      { id: '05-3', text: 'Implement backend RBAC/ABAC role checks on every single mutation endpoint', done: false, critical: true },
      { id: '05-4', text: 'Build secure password reset & multi-device logout flows', done: false },
      { id: '05-5', text: 'Protect login and recovery routes against credential stuffing & brute-force', done: false, critical: true }
    ]
  },
  {
    id: 'sec-06',
    number: '06',
    title: 'Security Hardening',
    category: 'Security',
    categoryRange: '04–06 Data, Authentication & Security',
    summary: 'Use HTTPS. Validate untrusted input. Protect secrets. Apply least privilege. Review dependencies. Configure CORS intentionally. Secure sensitive endpoints. Avoid exposing credentials or sensitive data in logs.',
    keyRule: 'Never put production secrets directly into source code or commit them to Git. Use an appropriate secret/configuration mechanism.',
    subtasks: [
      { id: '06-1', text: 'Enforce HTTPS everywhere with HSTS headers', done: false, critical: true },
      { id: '06-2', text: 'Restrict CORS origins to exact authorized domain names (no wildcard *)', done: false, critical: true },
      { id: '06-3', text: 'Audit dependencies with npm audit / Snyk / Dependabot', done: false },
      { id: '06-4', text: 'Sanitize logs to never print API keys, tokens, or PII passwords', done: false, critical: true },
      { id: '06-5', text: 'Inject secrets exclusively via environment variables / secret managers', done: false, critical: true }
    ]
  },

  // 07-09 Performance: Cache, CDN & Rate Limiting
  {
    id: 'sec-07',
    number: '07',
    title: 'Caching Strategy',
    category: 'Performance',
    categoryRange: '07–09 Performance: Cache, CDN & Rate Limiting',
    summary: 'Caching avoids repeatedly performing expensive work. A request may read a valid value from cache instead of querying the database every time.',
    keyRule: 'Caching improves latency and can reduce database load, but stale data and invalidation must be handled deliberately.',
    questions: [
      'What is the unique cache key format?',
      'How long is the value valid (TTL)?',
      'How is the cache invalidated when data changes?',
      'What happens on a cache miss (stampede protection)?',
      'What happens if the cache cluster is down?'
    ],
    subtasks: [
      { id: '07-1', text: 'Establish Redis or in-memory cache for high-frequency DB queries', done: false },
      { id: '07-2', text: 'Define granular cache key prefixes and explicit TTL timers', done: false, critical: true },
      { id: '07-3', text: 'Implement event-driven cache invalidation upon entity mutation', done: false, critical: true },
      { id: '07-4', text: 'Ensure graceful degradation if cache service is unreachable', done: false }
    ]
  },
  {
    id: 'sec-08',
    number: '08',
    title: 'CDN Edge Delivery',
    category: 'Performance',
    categoryRange: '07–09 Performance: Cache, CDN & Rate Limiting',
    summary: 'A CDN can deliver suitable static assets from edge locations closer to users. Think about Cache-Control, asset versioning, image optimization, compression and invalidation.',
    keyRule: 'A CDN improves content delivery; it does not replace backend scaling, database design or application-level caching.',
    subtasks: [
      { id: '08-1', text: 'Serve static assets (JS, CSS, images) via global CDN (Cloudflare/CloudFront)', done: false, critical: true },
      { id: '08-2', text: 'Configure immutable Cache-Control headers with content-hash file names', done: false },
      { id: '08-3', text: 'Enable modern compression (Brotli / Gzip) and AVIF/WebP image formats', done: false },
      { id: '08-4', text: 'Automate CDN cache purge in the deployment pipeline', done: false }
    ]
  },
  {
    id: 'sec-09',
    number: '09',
    title: 'Rate Limiting & Throttling',
    category: 'Performance',
    categoryRange: '07–09 Performance: Cache, CDN & Rate Limiting',
    summary: 'Rate limiting controls how frequently a client can call an API. Limits can be per IP, user, API key or endpoint.',
    keyRule: 'Example: login endpoint → a small number of attempts per time window. Public API → quota per client. Return HTTP 429 when the configured limit is exceeded.',
    subtasks: [
      { id: '09-1', text: 'Apply strict rate limiting on auth routes (e.g. 5 attempts / 15 mins / IP)', done: false, critical: true },
      { id: '09-2', text: 'Implement token bucket or sliding window algorithm for public API endpoints', done: false },
      { id: '09-3', text: 'Return standard Retry-After header with HTTP 429 status code', done: false, critical: true },
      { id: '09-4', text: 'Differentiate anonymous vs authenticated user rate tiers', done: false }
    ]
  },

  // 10-12 Storage, Testing & Error Handling
  {
    id: 'sec-10',
    number: '10',
    title: 'File & Object Storage',
    category: 'Storage',
    categoryRange: '10–12 Storage, Testing & Error Handling',
    summary: 'Images, videos and documents are often better stored in object storage, while the database stores metadata and references.',
    keyRule: 'Review file-size limits, allowed types, access control, private/public objects, signed URLs, scanning requirements and lifecycle policies.',
    subtasks: [
      { id: '10-1', text: 'Offload files to cloud object storage (S3, GCS, Cloudflare R2)', done: false, critical: true },
      { id: '10-2', text: 'Generate short-lived pre-signed URLs for direct client uploads & downloads', done: false, critical: true },
      { id: '10-3', text: 'Validate file MIME types and enforce max upload size limits on the server', done: false, critical: true },
      { id: '10-4', text: 'Configure S3 bucket lifecycle rules for temporary & archived artifacts', done: false }
    ]
  },
  {
    id: 'sec-11',
    number: '11',
    title: 'Testing Strategy Matrix',
    category: 'Testing',
    categoryRange: '10–12 Storage, Testing & Error Handling',
    summary: 'Build high release confidence through multi-tier automated test suites.',
    keyRule: 'Testing creates release velocity by turning assumptions into verifiable guarantees.',
    tableColumns: [
      { key: 'test', label: 'Test Tier' },
      { key: 'purpose', label: 'Engineering Purpose' }
    ],
    tableData: [
      { test: 'Unit', purpose: 'Small pieces of logic in isolation.' },
      { test: 'Integration', purpose: 'Components working together.' },
      { test: 'API', purpose: 'Validation, auth, responses and failures.' },
      { test: 'End-to-end', purpose: 'Critical real user journeys.' },
      { test: 'Load / performance', purpose: 'Behavior under expected traffic.' }
    ],
    subtasks: [
      { id: '11-1', text: 'Unit tests for core calculation and pure business rules', done: false },
      { id: '11-2', text: 'API integration tests verifying response shapes & status codes', done: false, critical: true },
      { id: '11-3', text: 'Automated E2E smoke test for critical checkout/login flow (Playwright/Cypress)', done: false, critical: true },
      { id: '11-4', text: 'Load test endpoints with expected concurrent traffic volume (k6/Artillery)', done: false }
    ]
  },
  {
    id: 'sec-12',
    number: '12',
    title: 'Defensive Error Handling',
    category: 'Reliability',
    categoryRange: '10–12 Storage, Testing & Error Handling',
    summary: 'Every important operation should have a defined failure path. Avoid exposing internal stack traces or sensitive implementation details to users.',
    keyRule: 'Think through the complete chain: validation error → authentication failure → permission failure → missing resource → dependency timeout → database failure → unexpected exception.',
    subtasks: [
      { id: '12-1', text: 'Never leak database errors or internal stack traces in production API responses', done: false, critical: true },
      { id: '12-2', text: 'Use consistent JSON error payloads: { error: { code, message, details } }', done: false, critical: true },
      { id: '12-3', text: 'Add global error boundary in frontend with helpful recovery prompts', done: false },
      { id: '12-4', text: 'Catch timeout exceptions when calling third-party dependencies', done: false, critical: true }
    ]
  },

  // 13-15 Logging, Monitoring, Jobs & Cloud
  {
    id: 'sec-13',
    number: '13',
    title: 'Logging, Monitoring & Observability',
    category: 'Observability',
    categoryRange: '13–15 Logging, Monitoring, Jobs & Cloud',
    summary: 'Maintain real-time situational awareness over infrastructure, application errors, and user traffic.',
    keyRule: 'Useful signals include request rate, latency, error rate, CPU/memory, database health, queue depth, external-service failures and availability.',
    tableColumns: [
      { key: 'tool', label: 'Tool / Practice' },
      { key: 'question', label: 'Question Answered' }
    ],
    tableData: [
      { tool: 'Logging', question: 'What happened?' },
      { tool: 'Monitoring', question: 'Is the system healthy?' },
      { tool: 'Error tracking', question: 'Where and why did something fail?' },
      { tool: 'Alerts', question: 'When should someone investigate?' }
    ],
    subtasks: [
      { id: '13-1', text: 'Structured JSON logging with request correlation IDs', done: false, critical: true },
      { id: '13-2', text: 'Error tracking integration (Sentry / Datadog / OpenTelemetry)', done: false, critical: true },
      { id: '13-3', text: 'System health check endpoint (/health, /ready, /live)', done: false, critical: true },
      { id: '13-4', text: 'Automated PagerDuty / Slack alerts for 5xx spikes & high latency', done: false }
    ]
  },
  {
    id: 'sec-14',
    number: '14',
    title: 'Notifications & Background Jobs',
    category: 'Backend',
    categoryRange: '13–15 Logging, Monitoring, Jobs & Cloud',
    summary: 'Decouple heavy tasks from HTTP request/response lifecycles to protect API responsiveness.',
    keyRule: 'Example: Order created → save order → enqueue email job → worker sends email. The API does not need to keep the user waiting for the email provider.\nDesign for retries, duplicate jobs, idempotency and failed-job handling when required.',
    subtasks: [
      { id: '14-1', text: 'Implement message queue (BullMQ, Redis, Celery, SQS, RabbitMQ)', done: false, critical: true },
      { id: '14-2', text: 'Enforce idempotency keys on payment, order, and notification tasks', done: false, critical: true },
      { id: '14-3', text: 'Configure exponential backoff retries with dead-letter queue (DLQ)', done: false },
      { id: '14-4', text: 'Monitor worker concurrency, queue latency and failed task metrics', done: false }
    ]
  },
  {
    id: 'sec-15',
    number: '15',
    title: 'Cloud & Environment Isolation',
    category: 'Operations',
    categoryRange: '13–15 Logging, Monitoring, Jobs & Cloud',
    summary: 'Separate development, staging and production. Plan compute, database, storage, networking, DNS, TLS, secrets, backups and scaling.',
    keyRule: 'Production should not depend on a developer laptop. Configuration and secrets must be managed through the deployment environment.',
    subtasks: [
      { id: '15-1', text: 'Strict separation of Development, Staging, and Production environments', done: false, critical: true },
      { id: '15-2', text: 'Infrastructure as Code (Terraform, Pulumi, Docker Compose)', done: false },
      { id: '15-3', text: 'Zero developer laptop dependencies for build, seed, or release', done: false, critical: true },
      { id: '15-4', text: 'Automated horizontal autoscaling based on CPU/memory usage thresholds', done: false }
    ]
  },

  // 16-18 CI/CD, Git & Production Readiness
  {
    id: 'sec-16',
    number: '16',
    title: 'CI/CD Automation Pipelines',
    category: 'DevOps',
    categoryRange: '16–18 CI/CD, Git & Production Readiness',
    summary: 'Automate build verification, testing, and deployment to prevent human operational error.',
    keyRule: 'Git push → lint → tests → build → security checks → staging → approval/automated promotion → production.\nA repeatable pipeline reduces manual deployment mistakes. Include rollback or redeployment procedures.',
    subtasks: [
      { id: '16-1', text: 'Automated GitHub Actions / GitLab CI pipeline on every push', done: false, critical: true },
      { id: '16-2', text: 'Block pull request merges if linting, typecheck, or tests fail', done: false, critical: true },
      { id: '16-3', text: 'Ephemeral staging preview environments for pull request review', done: false },
      { id: '16-4', text: 'One-click automated instant rollback mechanism for production bad releases', done: false, critical: true }
    ]
  },
  {
    id: 'sec-17',
    number: '17',
    title: 'Git & Version Control Discipline',
    category: 'DevOps',
    categoryRange: '16–18 CI/CD, Git & Production Readiness',
    summary: 'Maintain code hygiene, audit trails, and review discipline across the engineering organization.',
    keyRule: 'Use meaningful commits, pull requests, code review and protected production branches. Keep environment-specific configuration outside source code where appropriate.',
    subtasks: [
      { id: '17-1', text: 'Enable protected main/production branches (require PR approval & passing CI)', done: false, critical: true },
      { id: '17-2', text: 'Conventional commit messages (feat:, fix:, chore:, refactor:)', done: false },
      { id: '17-3', text: 'Keep environment secrets out of git history with git-secrets / gitleaks', done: false, critical: true },
      { id: '17-4', text: 'Tag production releases with semantic versioning (v1.0.0)', done: false }
    ]
  },
  {
    id: 'sec-18',
    number: '18',
    title: 'Master Production Readiness Checklist',
    category: 'Readiness Audit',
    categoryRange: '16–18 CI/CD, Git & Production Readiness',
    summary: 'The final pre-launch engineering sign-off matrix across 8 core dimensions.',
    keyRule: 'Before turning on production traffic, every engineering category must meet its explicit "Ready When..." condition.',
    tableColumns: [
      { key: 'category', label: 'Engineering Dimension' },
      { key: 'readyWhen', label: 'Ready When…' }
    ],
    tableData: [
      { category: 'Architecture', readyWhen: 'Major components and failure points are documented.' },
      { category: 'Security', readyWhen: 'Secrets, auth, authorization, HTTPS and input validation are reviewed.' },
      { category: 'Data', readyWhen: 'Indexes, constraints, migrations and backups are planned.' },
      { category: 'Performance', readyWhen: 'Caching/CDN/rate limits are considered where needed.' },
      { category: 'Quality', readyWhen: 'Critical flows have appropriate automated tests.' },
      { category: 'Operations', readyWhen: 'Logs, errors, metrics and alerts are available.' },
      { category: 'Delivery', readyWhen: 'CI/CD, deployment and rollback procedures work.' },
      { category: 'Recovery', readyWhen: 'Backup restoration and failure procedures are understood.' }
    ],
    subtasks: [
      { id: '18-1', text: 'Architecture documented with failure points mapped', done: false, critical: true },
      { id: '18-2', text: 'Security review completed (auth, authz, HTTPS, secrets)', done: false, critical: true },
      { id: '18-3', text: 'Data migration & backup recovery test validated', done: false, critical: true },
      { id: '18-4', text: 'Performance controls active (caching, CDN, rate limits)', done: false, critical: true },
      { id: '18-5', text: 'Quality gates passing (critical automated tests green)', done: false, critical: true },
      { id: '18-6', text: 'Operations observability live (logs, errors, alerts active)', done: false, critical: true },
      { id: '18-7', text: 'Delivery pipeline tested (automated rollback works)', done: false, critical: true },
      { id: '18-8', text: 'Disaster recovery procedures understood by engineering team', done: false, critical: true }
    ]
  },

  // 19 How to Prompt AI Like an Engineer
  {
    id: 'sec-19',
    number: '19',
    title: 'How to Prompt AI Like an Engineer',
    category: 'AI Workflow',
    categoryRange: '19 How to Prompt AI Like an Engineer',
    summary: 'Transform vague requests into structured, production-grade engineering blueprints that produce reliable software.',
    keyRule: 'Weak prompt: "Build me a production website."\n\nBetter prompt: "Design a production architecture for this application. Start with assumptions and missing requirements. Then define the system architecture, data model, API contracts, authentication, authorization, security controls, caching, rate limiting, storage, testing, observability, deployment and rollback. Implement in small reviewed steps."',
    subtasks: [
      { id: '19-1', text: 'Define product requirements and user flows first', done: false, critical: true },
      { id: '19-2', text: 'Ask AI to identify missing requirements and architectural risks', done: false, critical: true },
      { id: '19-3', text: 'Design system architecture before generating any code', done: false, critical: true },
      { id: '19-4', text: 'Explicitly specify data models and typed API contracts', done: false, critical: true },
      { id: '19-5', text: 'Prompt and review one single layer at a time', done: false },
      { id: '19-6', text: 'Command AI to generate unit/integration tests alongside code', done: false },
      { id: '19-7', text: 'Execute automated linting, typechecks, and security audits', done: false, critical: true },
      { id: '19-8', text: 'Critically review generated dependencies and code cleanliness', done: false },
      { id: '19-9', text: 'Deploy to realistic staging sandbox for end-to-end testing', done: false },
      { id: '19-10', text: 'Monitor production logs and maintain a guaranteed rollback path', done: false, critical: true }
    ]
  },

  // 20 Final Mental Model + Interview Summary
  {
    id: 'sec-20',
    number: '20',
    title: 'Final Mental Model & Interview Preparation',
    category: 'Mental Models',
    categoryRange: '20 Final Mental Model + Interview Summary',
    summary: 'The 12 core engineering concerns every senior developer and technical lead must memorize and articulate.',
    keyRule: 'THE BIG TAKEAWAY:\nAI can generate the code. You still need engineering to make the product production-ready.\n\nINTERVIEW-READY ANSWER:\n"AI-assisted development can dramatically speed up implementation, but production readiness requires architecture, security, reliable data handling, testing, deployment, observability and operational planning. The engineer is responsible for validating all of those pieces."',
    subtasks: [
      { id: '20-1', text: 'Memorize the 12 core concerns and their single-sentence rules', done: false },
      { id: '20-2', text: 'Internalize the difference between code generation and engineering validation', done: false, critical: true },
      { id: '20-3', text: 'Practice articulating the Interview-Ready production readiness answer', done: false }
    ]
  }
];

export const MENTAL_MODELS: MentalModelItem[] = [
  { concern: 'Frontend', rememberThis: 'What users see — UX, accessibility, performance.', category: 'Client' },
  { concern: 'Backend', rememberThis: 'What the application does — business logic and APIs.', category: 'Server' },
  { concern: 'Database', rememberThis: 'What the application remembers — data and consistency.', category: 'Data' },
  { concern: 'Authentication', rememberThis: 'Who the user is.', category: 'Identity' },
  { concern: 'Authorization', rememberThis: 'What the user is allowed to do.', category: 'Identity' },
  { concern: 'Security', rememberThis: 'How users, data and infrastructure are protected.', category: 'Defense' },
  { concern: 'Cache / CDN', rememberThis: 'How repeated delivery and computation can be optimized.', category: 'Speed' },
  { concern: 'Rate limiting', rememberThis: 'How API traffic is controlled.', category: 'Traffic' },
  { concern: 'Testing', rememberThis: 'How confidence is created before release.', category: 'Quality' },
  { concern: 'Logging / Monitoring', rememberThis: 'How you understand production behavior.', category: 'Visibility' },
  { concern: 'CI/CD', rememberThis: 'How code is safely delivered.', category: 'Operations' },
  { concern: 'Backups / Recovery', rememberThis: 'How you respond when something goes wrong.', category: 'Resilience' },
];

export const PRACTICAL_AI_WORKFLOW_STEPS = [
  { step: 1, action: 'Define product requirements and user flows.' },
  { step: 2, action: 'Ask AI to identify missing requirements and risks.' },
  { step: 3, action: 'Design architecture before generating everything.' },
  { step: 4, action: 'Define data models and API contracts.' },
  { step: 5, action: 'Implement one layer at a time.' },
  { step: 6, action: 'Generate tests alongside code.' },
  { step: 7, action: 'Run linting, tests and security checks.' },
  { step: 8, action: 'Review generated code and dependencies.' },
  { step: 9, action: 'Deploy to staging and test realistic flows.' },
  { step: 10, action: 'Monitor production and keep a rollback path.' },
];
