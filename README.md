# SaySure — Voice Delivery & Pronunciation QA

> **A voice-quality developer tool that identifies speech risks in written text, creates controlled speech-ready variants, synthesizes both through Rime TTS, and enables side-by-side audio audition and verification.**

Built for the **Rime Hackathon** targeting the core voice challenge: **Pronunciation + Controlled Delivery**.

---

## 1. Executive Overview

### The Problem
Written text is designed for readers, not listeners. When text-to-speech engines synthesize raw written content:
- **Alphanumeric identifiers** (e.g. `A12B9X7`) get slurred together into pseudo-words.
- **Currencies and numbers** (e.g. Indian Rupee `₹1,25,000`) are vocalized awkwardly or misread due to non-Western comma groupings.
- **Protocol status codes** (e.g. `HTTP 429`) are read as single large integers rather than digit-by-digit.
- **Technical domain terms** (e.g. `Kubernetes`, `PostgreSQL`, `Neo4j`, `gRPC`) suffer from severe pronunciation drift.

### The Solution: SaySure
SaySure sits between written application data and Text-to-Speech synthesis:
```
Written Text
    ↓
2-Level Risk Detection Engine (Level A: Deterministic + Level B: Contextual)
    ↓
Controlled Speech-Ready Text Generation
    ↓
Strict Meaning Preservation Validation
    ↓
Rime TTS Dual Synthesis (RAW vs CONTROLLED)
    ↓
Side-by-Side Audio Audition Studio
    ↓
Human Listener Verification [ Better | Same | Worse ]
```

SaySure is **not** a chatbot with a play button, but a dedicated voice developer instrument designed to audition and verify spoken delivery.

---

## 2. Architecture & Tech Stack

```
                              BROWSER
                                 │
                                 ▼
                     Next.js Dashboard (Stitch UI)
                                 │
                                 ▼
                    Server-Side Route Handlers
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
      Risk & Groq Engine                    Rime TTS API
      - 12 Risk Categories                  - Model: mistv3
      - Level A: Deterministic              - Voice: astra
      - Level B: Contextual                 - Endpoint: https://users.rime.ai/v1/rime-tts
      - Validation Layer                    - Latency Measurement (ms)
                │                                 │
                └────────────────┬────────────────┘
                                 ▼
                           Audio Stream
                    (RAW vs CONTROLLED Audition)
```

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons. Designed using **Google Stitch**.
- **Backend API**: Next.js Route Handlers (`/api/compare`, `/api/analyze`, `/api/synthesize`, `/api/config`).
- **TTS Engine**: Rime TTS REST API (`https://users.rime.ai/v1/rime-tts`).
- **LLM Reasoning**: Groq (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`).
- **Test Framework**: Vitest with unit tests covering all risk rules and validation routines.

---

## 3. Supported Speech-Risk Categories

| Category | Level | Example | Failure Mode in Standard TTS |
|---|---|---|---|
| **Alphanumeric Identifiers** | A (Deterministic) | `A12B9X7`, `REF-9021` | Slurred as word; digits dropped or merged |
| **Currency** | A (Deterministic) | `₹1,25,000`, `$4,500.50` | Indian lakh comma notation misread; symbol skipped |
| **Acronyms & Status Codes** | A (Deterministic) | `HTTP 429`, `AWS`, `JSON` | Code read as "four hundred twenty-nine" |
| **Technical Vocabulary** | B (Contextual/Lexicon) | `Kubernetes`, `PostgreSQL` | Mispronounced as "ku-ber-neets", "post-gray-es-cue-el" |
| **Network Protocols** | B (Contextual/Lexicon) | `IPv6`, `IPv4` | Read as single word instead of "I-P-V-six" |
| **Addresses** | B (Contextual) | `Bandra-Kurla Complex` | Pacing cadence and hyphenation mangled |
| **Dates & Times** | A (Deterministic) | `03/15/2026`, `14:30 EST` | Format ambiguity (Day/Month US vs International) |
| **URLs** | A (Deterministic) | `https://users.rime.ai/docs` | Awkward slash and dot reading |
| **Emails** | A (Deterministic) | `support@example.com` | "@" and "." pronunciation gaps |
| **Abbreviations** | A (Deterministic) | `approx.`, `vs.`, `dept.` | Read as truncated syllables rather than words |
| **Proper Names** | B (Contextual) | `Dr. Mukherjee`, `Siobhan` | Non-intuitive phoneme mapping errors |
| **Ambiguous Tokens** | B (Contextual) | `XyloQ` | Unverified phonotactics -> Triggers `NEEDS_REVIEW` |

---

## 4. Setup & Environment Variables

### 1. Clone & Install
```bash
git clone https://github.com/aditya-codes-git/DataForge_NullPointer.git
cd DataForge_NullPointer
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env.local
```

Populate your `.env.local` with your server-side API keys:
```env
# Groq LLM (Server-Side Only)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Rime TTS (Server-Side Only)
RIME_API_KEY=your_rime_api_key_here
RIME_MODEL=mistv3
RIME_VOICE=astra
RIME_LANGUAGE=en
RIME_ENDPOINT=https://users.rime.ai/v1/rime-tts
RIME_AUDIO_FORMAT=audio/mpeg
```

> [!IMPORTANT]
> **Credential Security**: Never prefix API keys with `NEXT_PUBLIC_`. Secrets are consumed solely inside server-side route handlers. If keys are omitted, SaySure provides clear non-leaking setup guidance.

---

## 5. Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Running Test Suite
```bash
npm test
```

---

## 6. Acceptance Test Corpus

SaySure includes 5 built-in acceptance test presets directly in the dashboard toolbar (and 20 curated fixtures in `fixtures/test-cases.json`):

1. **Case 1 (Alphanumeric & Currency)**:
   - Input: `"Your verification code is A12B9X7 and your total is ₹1,25,000."`
   - Spoken Delivery: Spells `A one two B nine X seven` and speaks `one lakh twenty-five thousand rupees`.
2. **Case 2 (Acronym & Tech)**:
   - Input: `"HTTP 429 occurred while connecting to Kubernetes."`
   - Spoken Delivery: Spells `HTTP four two nine` and pronounces `koo-ber-net-eez`.
3. **Case 3 (Clean Speech)**:
   - Input: `"Hello, how are you today?"`
   - Spoken Delivery: System recognizes speech-safe content and leaves text unaltered.
4. **Case 4 (Ambiguous: XyloQ)**:
   - Input: `"The customer requested a refund for product XyloQ."`
   - Spoken Delivery: Unverified token triggers `NEEDS_REVIEW` and cautions reviewer against blind deployment.
5. **Case 5 (Multi-Protocol Tech)**:
   - Input: `"We migrated the dataset from PostgreSQL to Neo4j over IPv6."`
   - Spoken Delivery: Pronounces `Post-gres-Q-L`, `neo four J`, and `I P V six`.

---

## 7. Rime Evidence & Observations

Detailed observations, technical hypothesis validation, synthesis latencies, and limitations are documented in [RIME_EVIDENCE.md](file:///d:/DataForge/DataForge_NullPointer/RIME_EVIDENCE.md).

---

## 8. License

MIT License. Built for the Rime Hackathon.
