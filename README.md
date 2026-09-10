# SaySure

## Voice Delivery & Pronunciation QA

> **SaySure is an evidence-driven voice-quality engineering layer that sits between application content and Text-to-Speech (TTS). It identifies speech-risk tokens in written text, investigates alternative spoken representations, synthesizes both original and controlled candidates concurrently through Rime TTS, and provides auditable evidence that the resulting speech is clear, correct, and appropriate for the listener.**

Built for the **Rime Hackathon** targeting the hard voice challenge: **Pronunciation + Controlled Delivery**.

---

## Submission Links

| | |
|---|---|
| **Live Demo** | _Coming soon_ |
| **Source Code** | [github.com/aditya-codes-git/DataForge_NullPointer](https://github.com/aditya-codes-git/DataForge_NullPointer) |
| **Demo Video** | [Watch on Google Drive](https://drive.google.com/file/d/1eQqmskO-FfaVXbiE5vMLRtUZ3jP4H-FO/view?usp=sharing) |

---

## 1. The Core Idea: DETECTION ≠ CORRECTION

A fundamental insight behind SaySure is:

> **A detected speech risk is a reason to investigate. It is NOT an order to blindly rewrite.**

```
                         WRITTEN TEXT
                              │
                              ▼
                     SPEECH-RISK DETECTOR
                     (12 Risk Categories)
                              │
                              ▼
                      CONTEXT ANALYZER
                   (Groq / Catalog Rules)
                              │
                              ▼
                     CANDIDATE GENERATOR
                 (0–3 Ranked TTS Hypotheses)
                              │
                              ▼
                     10-POINT VALIDATOR
                (Entity & Character Integrity)
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
           RAW TEXT                   CONTROLLED TEXT
               │                             │
               └──────────────┬──────────────┘
                              │ Concurrent Fair Audition
                              ▼
                          RIME TTS
              (mistv3 / astra / official endpoint)
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
           RAW AUDIO                  CONTROLLED AUDIO
               │                             │
               └──────────────┬──────────────┘
                              │
                              ▼
                       DECISION ENGINE
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
    KEEP_RAW           USE_CONTROLLED         NEEDS_REVIEW
 (Native Rime wins)    (Controlled wins)     (Do NOT guess)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                  LISTENER VERIFICATION QA
                              │
                              ▼
                       EVIDENCE MEMORY
                  (Reproducible Provenance)
```

1. **Detect**: Scan text for patterns that frequently trip up neural speech models (identifiers, currencies, acronyms, technical terms, dates, versions).
2. **Investigate**: Check domain knowledge and evaluate whether native speech synthesis already produces high-fidelity output.
3. **Generate Hypotheses**: If a risk warrants intervention, generate up to 3 candidate phonetic or expanded spoken representations.
4. **Validate**: Run a 10-point integrity checklist ensuring no hallucination, no arbitrary truncation, and strict preservation of digits and symbols.
5. **Dual Audition**: Synthesize **RAW** and **CONTROLLED** candidate text concurrently through Rime TTS using identical voice, model, and sampling parameters.
6. **Decide Honestly**:
   - **`KEEP_RAW`**: Retain original text if native Rime synthesis already handles it cleanly (e.g., `Kubernetes`).
   - **`USE_CONTROLLED`**: Adopt candidate if acoustic evidence proves superiority (e.g., `HTTP 429 → HTTP four two nine`).
   - **`NEEDS_REVIEW`**: Flag for human confirmation when confidence is low or brand name is unknown (e.g., `XyloQ`). **Never guess.**
7. **Record Provenance**: Save every test into evidence memory with full model, voice, latency, and verification metadata.

---

## 2. Why Voice Is Essential

SaySure is **voice-native**. Rime TTS is not a decorative audio preview or a gimmick attached to a chatbot; **Rime-generated speech is the primary evaluation instrument and the product itself**.

Written text cannot evaluate speech. A string that looks elegant to an LLM or database can sound completely garbled when spoken by a neural voice. Only by synthesizing actual audio through Rime and comparing the acoustic waveforms can an application verify whether its content is ready for human ears.

Removing Rime from SaySure eliminates its reason for existence: without acoustic synthesis, speech quality cannot be verified.

---

## 3. The Problem: Written Text Is for Eyes, TTS Is for Ears

Standard text-to-speech systems consume written characters directly. But written prose is optimized for silent visual reading:

- **Alphanumeric Identifiers** (`A12B9X7`, `INV-2048-X`): Neural TTS attempts to blend mixed characters into slurred pseudowords (*"ay-twelve-bee..."*) instead of articulating each character distinctly.
- **Currencies & Large Numbers** (`₹1,25,000`, `₹2,75,500`): Western speech models do not natively group Indian lakh notation, resulting in skipped currency symbols or nonsensical digit recitations.
- **Protocol Status Codes** (`HTTP 429`): Spoken as a large cardinal count (*"four hundred twenty-nine"*) rather than standard individual status digits (*"four two nine"*).
- **Technical Vocabulary & Versions** (`PostgreSQL v16`, `gRPC`, `IPv6`): Technical terms have unwritten phonetic conventions. Naive systems spell SQL letter-by-letter or slur attached version numbers into malformed strings like *"postgresv 16"*.
- **Calendar Dates & Times** (`17/09/2026`, `14:30 IST`): Slashes and colons are often recited mechanically (*"seventeen slash zero nine slash..."*).
- **Ambiguous & Novel Terms** (`MIA`, `XyloQ`): Ambiguous acronyms or novel proper nouns risk confident phonetic hallucinations.

*Note: SaySure does not claim universal pronunciation correctness for all world languages or rare dialects; it provides an explicit, auditable engineering process to test and control delivery on specific application content.*

---

## 4. Core Hard Voice Problem: Pronunciation + Controlled Delivery

SaySure attacks the **Pronunciation + Controlled Delivery** challenge using 10 representative stress cases evaluated directly against Rime TTS:

| Case | Written Input | Problem in Standard TTS | SaySure Action | Decision Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **`A12B9X7`** | `Your code is A12B9X7.` | Slurred as pseudoword; lost digits | Isolates characters: `"A one two B nine X seven"` | `USE_CONTROLLED` |
| **`HTTP 429`** | `Rate limit: HTTP 429.` | Read as *"four hundred twenty-nine"* | Spells status digits: `"HTTP four two nine"` | `USE_CONTROLLED` |
| **`₹1,25,000`** | `Invoice total is ₹1,25,000.` | Mangles Indian lakh comma grouping | Localized expansion: `"one lakh twenty-five thousand rupees"` | `USE_CONTROLLED` |
| **`Kubernetes`** | `Deployed on Kubernetes.` | Unnecessary phonetic mangling | Retains raw: Rime native synthesis already excels | **`KEEP_RAW`** |
| **`PostgreSQL`** | `Database is PostgreSQL.` | Spells letters or misplaces stress | Evaluates hypotheses (`"Postgres cue ell"`, `"Postgres Q L"`) | `USE_CONTROLLED` |
| **`PostgreSQL v16`** | `Upgraded to PostgreSQL v16.` | Concatenation error (*"postgresv 16"*) | Preserves version: `"Postgres cue ell version sixteen"` | `USE_CONTROLLED` |
| **`12/B, 3rd Floor, BKC`** | `Office at 12/B, 3rd Floor, BKC.` | Rushed address delivery | Targeted pacing: `"three r d"` + pauses | `USE_CONTROLLED` |
| **`MIA`** | `Passenger reported MIA.` | Ambiguity between name and acronym | Contextual check; retains original without guessing | **`KEEP_RAW`** |
| **`XyloQ`** | `Refund for XyloQ.` | Model hallucinates unknown brand | Refuses to guess; surfaces uncertainty | **`NEEDS_REVIEW`** |
| **Multi-Entity** | `PostgreSQL v16 ... HTTP 429 ... ₹2,75,500` | Cascading offset collisions | Reverse-offset substitution; passes 10-point check | `USE_CONTROLLED` |

---

## 5. The PostgreSQL Case Study

`PostgreSQL v16` serves as a primary demonstration that candidates are **hypotheses**, not permanent truths:

- **Original**: `PostgreSQL v16`
- **Candidate Hypotheses Tested**:
  1. `Postgres cue ell version sixteen` *(Natural spoken words)*
  2. `Postgres Q L version sixteen` *(Initialism spelled)*
  3. `PostgreSQL version sixteen` *(Baseline entity preserved)*

SaySure does **not** assert that any candidate is universally superior in the abstract. Instead, both the original and candidate hypotheses are synthesized through the configured Rime voice (`astra`). The resulting audio streams are auditioned side-by-side. If native synthesis is already clear, RAW wins. If controlled delivery reduces syllable ambiguity, Controlled wins.

---

## 6. Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│               FRONTEND: Vite 5 + React 18              │
│               Port 3000 (Vite Dev / Preview)           │
├────────────────────────────────────────────────────────┤
│ • React Router DOM 6 (Client-side routing)             │
│ • Tailwind CSS 3.4 & Framer Motion 11.18               │
│ • Supabase Auth JS 2.49 (Client sessions & Google Auth)│
│ • Landing Page & Audition Laboratory                   │
│ • Authenticated SaaS Dashboard (/dashboard/*)          │
└───────────────────────────┬────────────────────────────┘
                            │ /api Proxy
                            ▼
┌────────────────────────────────────────────────────────┐
│               BACKEND: Express 4.21 API                │
│               Port 3001 (Node.js / tsx)                │
├────────────────────────────────────────────────────────┤
│ • POST /api/analyze    → 12 Risk Rules + Context       │
│ • POST /api/compare    → Concurrent Rime Dual Audition │
│ • POST /api/synthesize → Cached Direct Speech API      │
│ • POST /api/verify     → Human Verification Provenance │
│ • GET  /api/config     → Rime & Groq Public Status     │
└─────────────┬───────────────────────────┬──────────────┘
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   Rime TTS Production     │ │   Groq Cloud (Server)    │
│   Endpoint: users.rime.ai │ │   Model: llama-3.3-70b   │
│   Model: mistv3           │ │   Purpose: Semantic      │
│   Voice: astra            │ │   disambiguation         │
└───────────────────────────┘ └──────────────────────────┘
```

### Technology Versions (from `package.json`)
- **Frontend**: React `18.3.1`, React DOM `18.3.1`, React Router DOM `6.28.0`, Vite `5.4.11`, Tailwind CSS `3.4.14`, Framer Motion `11.18.2`, Lucide React `0.453.0`.
- **Backend**: Express `4.21.2`, Cors `2.8.5`, Dotenv `16.4.7`, TSX `4.19.2`.
- **Authentication**: `@supabase/supabase-js` `2.49.1`.
- **Testing**: Vitest `2.1.2`, TypeScript `5.6.3`.
- **Speech Provider**: Rime TTS REST API.
- **Context Reasoning**: Groq SDK (`llama-3.3-70b-versatile`).

---

## 7. Directory Structure

```text
DataForge_NullPointer/
├── server/
│   └── index.ts                  # Express API server (port 3001)
├── src/
│   ├── components/
│   │   ├── auth/                 # AuthProvider, ProtectedRoute, GoogleButton
│   │   ├── dashboard/            # Collapsible Sidebar, DashboardLayout, UserMenu
│   │   ├── landing/              # Hero, SpeechSpecimen, ScenesStory, InteractiveSentence
│   │   ├── AudioComparison.tsx   # Side-by-side RAW vs CONTROLLED player
│   │   ├── TextInput.tsx         # Primary analysis input with presets
│   │   └── VerificationPanel.tsx # Double-blind human verification card
│   ├── lib/
│   │   ├── risk-rules/           # 13 deterministic & contextual risk scanners
│   │   ├── candidate-generator.ts# 0–3 ranked hypothesis generator
│   │   ├── context-analyzer.ts   # Context evaluation (Groq + catalog bypass)
│   │   ├── decision-engine.ts    # Strict decision hierarchy (KEEP_RAW, USE_CONTROLLED, etc.)
│   │   ├── deterministic-transform.ts # Rule-based speech expansions
│   │   ├── evidence-memory.ts    # Provenance store & verified voice memory
│   │   ├── pronunciation-knowledge.ts # 3-way pronunciation representation catalog
│   │   ├── rime.ts               # Official Rime REST API client
│   │   ├── risk-detector.ts      # Multi-category speech risk orchestrator
│   │   ├── schemas.ts            # Core TypeScript types and API interfaces
│   │   ├── tts-runner.ts         # Concurrent fair audition runner & SHA-256 cache
│   │   └── validators.ts         # 10-point candidate preservation validator
│   ├── pages/
│   │   ├── dashboard/            # Overview, Analyze, History, Projects, Docs, Settings, Account
│   │   ├── Landing.tsx           # Public marketing & technical specimen page
│   │   ├── Login.tsx             # Supabase email & Google login
│   │   ├── Signup.tsx            # Supabase user registration
│   │   ├── ForgotPassword.tsx    # Password recovery
│   │   ├── ResetPassword.tsx     # Password update
│   │   └── AuthCallback.tsx      # OAuth redirect handler
│   ├── App.tsx                   # React Router route tree
│   └── main.tsx                  # Vite client entry point
├── fixtures/
│   └── test-cases.json           # 20 curated acceptance test fixtures
├── tests/
│   ├── api-routes.test.ts        # Express endpoint integration tests
│   ├── candidate-generator.test.ts # Hypothesis ranking tests
│   ├── decision-engine.test.ts   # Decision state tests
│   ├── golden-cases.test.ts      # 10 core golden problem test cases
│   ├── latency-optimization.test.ts # Synthesis caching & timing tests
│   ├── pronunciation-knowledge.test.ts # 3-way catalog tests
│   ├── risk-detector.test.ts     # Risk rule tests
│   └── validators.test.ts        # 10-point preservation validator tests
├── public/
│   └── audio/                    # Verified high-fidelity MP3 acoustic assets
├── index.html                    # Single-page HTML shell
├── vite.config.ts                # Vite configuration with /api proxy to Express
├── tsconfig.json                 # TypeScript compiler configuration
├── package.json                  # Dependencies and execution scripts
├── RIME_EVIDENCE.md              # Technical audition evidence & acceptance criteria
├── ARCHITECTURE.md               # Detailed system architecture document
├── DEMO.md                       # 4–5 minute video presentation script
├── LIMITATIONS.md                # Transparent engineering disclosure
└── SAYSURE_SUBMISSION_READINESS.md # Final pre-submission audit report
```

---

## 8. Local Setup & Reproduction

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### 1. Clone & Install
```bash
git clone https://github.com/aditya-codes-git/DataForge_NullPointer.git
cd DataForge_NullPointer
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Populate `.env.local` with your configuration:
```env
# Client-Safe Supabase (Vite frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Server-Only Rime TTS Configuration
RIME_API_KEY=your_rime_api_key_here
RIME_MODEL=mistv3
RIME_VOICE=astra
RIME_LANGUAGE=en
RIME_AUDIO_FORMAT=audio/mpeg
RIME_ENDPOINT=https://users.rime.ai/v1/rime-tts

# Server-Only Groq LLM Configuration (Context Disambiguation)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Server Port
PORT=3001
```

> [!NOTE]
> If `RIME_API_KEY` is omitted, SaySure runs in offline inspection mode: speech-risk detection, candidate generation, 10-point validation, and the decision engine operate normally, and the UI displays clear guidance for enabling live audio synthesis.

### 3. Run Development Server
```bash
npm run dev
```
Starts both the Express API server (port 3001) and the Vite client (port 3000) concurrently:
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:3001](http://localhost:3001)

### 4. Build for Production
```bash
npm run build
```
Executes `tsc -b && vite build`. Compiles clean production assets into `dist/`.

### 5. Run Automated Tests
```bash
npm test
```
Executes `vitest run`. Runs all 78 unit, golden, version, and integration tests.

---

## 9. Rime Integration Technical Specification

| Parameter | Shipped Configuration | Role & Verification |
| :--- | :--- | :--- |
| **TTS Provider** | Rime TTS | Primary speech synthesis engine |
| **TTS Model** | `mistv3` | Fast, predictable pronunciation model |
| **Speaker / Voice** | `astra` | Tested female voice from live catalog |
| **Language** | `en` | English |
| **Audio Format** | `audio/mpeg` | MP3 browser playback & download |
| **Endpoint** | `https://users.rime.ai/v1/rime-tts` | Official Rime REST API |
| **Transport** | HTTP/1.1 POST JSON | Server-side `fetch` with Bearer auth |

- **Concurrent Fair Audition**: [`src/lib/tts-runner.ts`](file:///d:/DataForge/DataForge_NullPointer/src/lib/tts-runner.ts) synthesizes RAW and candidate text concurrently via `Promise.all` under identical headers and parameters.
- **SHA-256 Audio Cache**: Repeat requests for identical text and voice configurations return from an in-memory cache at **`0ms`**, preventing redundant network requests.
- **Playback & Download**: Audio is returned to the client as Base64 Data URIs (`data:audio/mpeg;base64,...`), enabling immediate playback and direct MP3 file downloads.

---

## 10. Security & Credential Isolation

1. **Strict Server-Side Isolation**: `RIME_API_KEY` and `GROQ_API_KEY` are read strictly inside Node.js (`server/index.ts`). They are never prefixed with `VITE_` and are completely absent from the client-side JavaScript bundle.
2. **Public Client Separation**: Only public Supabase anon credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are exposed to the browser.
3. **Secret Pattern Scanner**: Input text is scanned for sensitive credentials (GitHub tokens, Stripe secret keys, AWS keys, JWTs, private keys) via [`src/lib/risk-detector.ts`](file:///d:/DataForge/DataForge_NullPointer/src/lib/risk-detector.ts) before synthesis. If detected, SaySure flags a security warning to prevent accidental secret leakage to third-party APIs.
4. **Git Protection**: `.env.local` is ignored in `.gitignore`; zero secrets are committed to version control.

---

## 11. Authentication & SaaS Workspace

Powered by **Supabase Auth**:
- **Email & Password**: Signup, sign in, password recovery (`/forgot-password`), and password reset (`/reset-password`).
- **Google OAuth**: One-click Google authentication routed through `/auth/callback`.
- **Session Persistence**: Session stored in `localStorage` under `saysure_auth_session_v1`; survives page refreshes.
- **Protected Routing**: [`ProtectedRoute.tsx`](file:///d:/DataForge/DataForge_NullPointer/src/components/auth/ProtectedRoute.tsx) guards all `/dashboard/*` routes. Unauthenticated visitors are automatically redirected to `/login?callbackUrl=...`.
- **Workspace Navigation**: Collapsible Linear-style sidebar with routes:
  - `/dashboard`: Overview with time-sensitive greeting and recent activity feed.
  - `/dashboard/analyze`: Primary speech analysis laboratory.
  - `/dashboard/history`: Searchable history table with filter by decision.
  - `/dashboard/projects`: Active QA pipelines and voice rules.
  - `/dashboard/docs`: In-app technical documentation.
  - `/dashboard/settings`: Workspace domain and locale preferences.
  - `/dashboard/account`: Profile, avatar, password change, and logout.

---

## 12. API Reference

The Express backend exposes the following REST endpoints:

### `POST /api/analyze`
Scans text for speech risks and generates speech-ready candidates.
- **Body**: `{ text: string, domain?: string, locale?: string }`
- **Response**: `{ text, controlledText, risks, investigation, candidates, reviewRequired, safetyWarning }`

### `POST /api/compare`
Runs concurrent fair dual synthesis through Rime TTS for RAW and candidate text.
- **Body**: `{ text: string, domain?: string, locale?: string }`
- **Response**: `{ originalText, controlledText, rawAudio, controlledAudio, decision, evidenceId, timing }`

### `POST /api/synthesize`
Synthesizes speech directly with Rime utilizing the SHA-256 cache.
- **Body**: `{ text: string }`
- **Response**: `{ available: boolean, dataUri: string, mimeType: string, latencyMs: number }`

### `POST /api/verify`
Records double-blind human listener evaluation into evidence memory.
- **Body**: `{ comparisonId: string, preference: 'RAW' | 'CONTROLLED' | 'SAME' | 'NOT_SURE', notes?: string }`
- **Response**: `{ success: boolean, comparisonId, preference, message }`

### `GET /api/config`
Returns public server configuration and provider connection statuses.
- **Response**: `{ rime: { provider, model, voice, language, format, status }, groq: { provider, model, status } }`

---

## 13. Testing & Verification

Run the test suite:
```bash
npx vitest run
```

```text
Test Files  10 passed (10)
     Tests  78 passed (78)
  Duration  2.30s

✓ tests/auth-middleware.test.ts (4 tests)
✓ tests/pronunciation-knowledge.test.ts (6 tests)
✓ tests/decision-engine.test.ts (6 tests)
✓ tests/candidate-generator.test.ts (5 tests)
✓ tests/risk-detector.test.ts (12 tests)
✓ tests/validators.test.ts (10 tests)
✓ tests/latency-optimization.test.ts (5 tests)
✓ tests/golden-cases.test.ts (10 tests)
✓ tests/version-handling.test.ts (14 tests)
✓ tests/api-routes.test.ts (6 tests)
```

Verify zero type errors:
```bash
npx tsc --noEmit
# Exit code: 0
```

Verify production build:
```bash
npm run build
# Exit code: 0 (Built in 4.52s)
```

---

## 14. Documentation Suite

For detailed technical breakdowns, see the companion documents:
- [**`RIME_EVIDENCE.md`**](file:///d:/DataForge/DataForge_NullPointer/RIME_EVIDENCE.md): Exact Rime audition evidence, 20 test fixtures, and audio artifacts.
- [**`ARCHITECTURE.md`**](file:///d:/DataForge/DataForge_NullPointer/ARCHITECTURE.md): Complete architectural diagrams, data flows, and module responsibilities.
- [**`DEMO.md`**](file:///d:/DataForge/DataForge_NullPointer/DEMO.md): Step-by-step 4–5 minute video presentation script with timestamps.
- [**`LIMITATIONS.md`**](file:///d:/DataForge/DataForge_NullPointer/LIMITATIONS.md): Transparent disclosure of model boundaries, network factors, and future scope.
- [**`SAYSURE_SUBMISSION_READINESS.md`**](file:///d:/DataForge/DataForge_NullPointer/SAYSURE_SUBMISSION_READINESS.md): Full readiness audit against the North-Star specification.
