# Rime Hackathon — Final Build Blueprint

> **Status:** Proposed MVP plan for the DataForge x Rime Hackathon  
> **Deadline context:** Build for submission tomorrow; optimize for a complete, polished, defensible prototype rather than feature breadth.  
> **Recommended direction:** **Pronunciation + Controlled Delivery**  
> **Working product name:** **SaySure — Voice Delivery & Pronunciation QA**

---

## 0. Executive decision

### What we are building

A **voice-first quality-control tool for spoken information**.

The user enters text that contains things voice systems commonly mishandle — names, product/technical terms, identifiers, numbers, addresses, acronyms, or awkward written prose — and SaySure produces a **speech-ready version** and lets the user immediately hear it through **Rime TTS**.

The core experience is:

```text
Written text
   ↓
Speech-risk detection / normalization
   ↓
Speech-ready version
   ↓
Rime TTS
   ↓
Audio the user can hear + inspect
   ↓
Before/after comparison + acceptance test
```

The product is **not** "a chatbot with a play button." The actual value is that the system helps make critical spoken information **more intelligible and controllable**, and the user verifies the result by hearing it.

### Why this direction

The Rime problem statement explicitly tells teams to:

- start with a **voice failure mode**
- choose a product where solving that failure matters
- define an **acceptance test**
- show a normal path and a deliberate stress/failure case
- measure user-visible behavior
- use Rime as the **primary spoken output**
- keep the product focused rather than building a broad assistant.

The PS specifically names **pronunciation and controlled delivery** as a target challenge and recommends testing names, numbers, codes, addresses, identifiers, and domain vocabulary with representative fixtures and before/after evidence.

**Source:** Rime Hackathon Challenge, pp. 1–4.

---

# 1. The actual problem statement — what the judges care about

## 1.1 Core judging rubric

| Criterion | Weight | What our submission should demonstrate |
|---|---:|---|
| Problem & necessity of voice | 25% | A concrete user has a real problem that is materially worse without speech |
| Hard voice engineering | 25% | A technically meaningful voice failure is detected/controlled under realistic conditions |
| Evidence & reproducibility | 20% | Repeatable fixtures/tests and user-visible measurements |
| Rime integration & voice experience | 20% | Rime is central, current, correctly configured, and primary |
| Demo clarity | 10% | Judges understand user → problem → solution → stress case → result |

**Important:** The largest scoring block is not "cool UI." It is the **problem + hard voice problem + evidence**.

**Source:** Rime Hackathon Challenge, p. 1.

---

# 2. Mandatory constraints from the PS

## 2.1 The product must be voice-native

The PS explicitly says that a product where speech is incidental is not enough.

The test is:

> If speech were removed, would the product become materially worse?

For SaySure, yes:

- the final artifact is spoken output;
- users need to **hear** the exact delivery;
- correctness is assessed by the audio;
- the central loop is listen → compare → correct → listen again.

The UI should therefore make audio the primary object, not a text dashboard with optional audio.

**Source:** Rime Hackathon Challenge, p. 1.

## 2.2 Rime must be the primary spoken output

Rime is not merely a welcome message, fallback, or optional playback.

Our judged path will use:

**Input → processing → Rime synthesis → playback**

The API key must remain server-side.

**Source:** Rime Hackathon Challenge, pp. 1 and 5.

## 2.3 The prototype needs a hard voice problem

The PS gives examples including:

- perceived response time
- interruption/recovery
- conversation continuity during tools
- pronunciation and controlled delivery
- multilingual/code-switched speech
- telephony/adverse audio
- expressive/persistent voice identity
- evaluation/observability

We choose:

# **Pronunciation + Controlled Delivery**

because it has a strong fit to the one-day constraint and maps directly to Rime's current controls.

**Source:** Rime Hackathon Challenge, pp. 2–4.

## 2.4 We need a deliberate stress/failure case

The demo must show:

1. normal case
2. difficult case
3. evidence/result
4. what happens when the system cannot guarantee the desired behavior

We should intentionally include difficult phrases such as:

```text
HTTP 429
IPv6
₹1,25,000
Kubernetes
PostgreSQL
Bandra-Kurla Complex
A12B9X7
customer surname / uncommon name
```

Only use examples we actually test and can defend.

---

# 3. The central technical claim

The PS wants a **falsifiable** voice claim that can be reproduced.

## Proposed claim

> **"Speech-specific normalization and controlled pronunciation can make difficult domain terms more consistently intelligible than sending their raw written form directly to TTS."**

This is deliberately narrower than claiming "we make TTS perfect."

### What would falsify it?

If, on our fixed test corpus:

- raw text is consistently as intelligible as the normalized version, or
- our optimized text introduces new errors, or
- custom pronunciation does not improve the difficult cases,

then the system has not demonstrated the claim.

That honesty is important because the judges explicitly say unsupported claims receive no credit.

---

# 4. Why this is a real problem

TTS starts with text, but written text is not a perfect specification of speech.

A written sequence can under-specify:

- pronunciation
- pauses
- number reading
- abbreviation reading
- emphasis
- rhythm
- phrasing
- conversational register.

Rime itself describes this as a **one-to-many problem in linguistics**: one text string can correspond to many acoustic realizations. Rime provides controls such as custom pronunciation and custom pauses for cases where the default realization is not sufficient.

Rime's 2026 guidance also explicitly distinguishes **writing for readers** from **writing for listeners**: text generated by language models can be grammatically good but still sound like written prose when spoken.

### Why this matters

A text error is visible.

A speech error is heard only after synthesis, and it can be more costly:

- wrong number
- wrong identifier
- wrong name
- wrong acronym expansion
- awkward or misleading delivery
- unprofessional-sounding customer interaction.

Rime's own 2026 production guidance highlights names, addresses, medical terms, product names, and acronyms as common pronunciation risk areas.

---

# 5. Why Rime is a particularly strong fit

## 5.1 Current Rime controls

Rime's current documentation exposes:

- `mistv3`
- custom pronunciation controls
- speech speed controls
- text normalization guidance
- coverage/OOV checking
- WebSocket streaming
- word-level timestamps on supported streaming paths.

Rime's current documentation says Mist v3 is optimized for fast, predictable speech and retains pronunciation control. Custom pronunciation is supported in Mist-family models.

### Proposed production/demo model

**Default:** `mistv3`

Reason:

- current model family
- fast cloud TTFB according to Rime documentation
- pronunciation-oriented behavior
- custom pronunciation support
- appropriate for a live browser demo.

**Important:** The PS requires checking the **current live catalog at submission time**. Do not hard-code a stale speaker list.

---

# 6. Best product framing

## Product

### SaySure

**Tagline:**

> **Make critical information sound right before your users hear it.**

## Target user

Primary:

> Developers and builders shipping voice agents, IVRs, support agents, or spoken interfaces containing domain-specific information.

Secondary:

> Teams responsible for QA of spoken scripts: contact center, support, onboarding, education, accessibility, or enterprise assistants.

## User situation

A developer has a sentence such as:

> "Your verification code is A12B9X7 and your order total is ₹1,25,000."

The text looks perfectly fine.

But what matters is:

> **What will the user actually hear?**

SaySure turns this into a speech-aware form and provides Rime audio for verification.

---

# 7. Product experience

## Main screen

### Left: "Write for speech"

Text editor with:

- input sentence
- detected risk terms
- optional domain selector

### Center: "Speech-safe transform"

Show:

- original text
- optimized/speech-ready text
- changed spans highlighted
- reason for each transformation.

### Right / bottom: "Hear it"

Two large audio cards:

**RAW**
- original text
- Play
- measured synthesis latency

**SPEECH-READY**
- transformed text
- Play
- measured synthesis latency

Then:

**Result**

```text
Pronunciation risks found: 4
Resolved: 3
Needs review: 1
```

A failed/uncertain case must stay visible.

---

# 8. What the system actually changes

We should use deterministic, explainable transformations.

## Layer A — Numbers

Examples:

```text
₹1,25,000
→ one lakh twenty-five thousand rupees

1,299
→ one thousand two hundred ninety-nine

03/15/2026
→ March fifteenth, twenty twenty-six
```

Do not blindly rewrite every number. Handle only patterns we can test.

## Layer B — Identifiers

Example:

```text
A12B9X7
→ spell(A12B9X7)
```

The exact mechanism must follow the Rime model/API features supported by the chosen configuration.

## Layer C — Acronyms

Example:

```text
HTTP 429
→ HTTP four-two-nine
```

or a project-specific speech representation.

Do not claim that one representation is universally correct; validate each fixture.

## Layer D — Domain names

Examples:

```text
Kubernetes
PostgreSQL
Neo4j
a custom product name
an uncommon surname
```

Use Rime coverage checks and custom pronunciation where appropriate.

## Layer E — Delivery

The system can modify:

- punctuation
- sentence segmentation
- pause placement
- wording for listeners rather than readers
- speech speed.

Rime explicitly recommends treating punctuation like a parameter: render variants, listen, and choose the stronger result.

---

# 9. Rime's own recommended approach — translated into our product

The PS gives unusually specific guidance for pronunciation:

### Step 1 — Test representative fixtures early

Use a fixture set containing:

- names
- numbers
- codes
- addresses
- identifiers
- domain-specific vocabulary.

### Step 2 — Establish a raw baseline

Send the original text to the **same Rime model and voice**.

### Step 3 — Produce the controlled variant

Modify only the pronunciation/delivery-relevant surface form.

### Step 4 — Render both

Keep:

- model constant
- voice constant
- environment as constant as possible.

### Step 5 — Listen and record results

For every fixture, capture:

- original input
- transformed input
- Rime config
- audio
- result
- reviewer judgment.

### Step 6 — Show before/after evidence

Do not just say "better."

Show the exact phrase and let the judge hear it.

### Step 7 — Disclose limitations

For example:

- language coverage is limited
- automatic detection can miss domain terms
- pronunciation overrides may require human confirmation
- network latency affects measured end-to-end latency
- a fixed benchmark is not proof of universal correctness.

**Source:** Rime Hackathon Challenge, pp. 3–4.

---

# 10. Acceptance test

The acceptance test should be written **before the demo**.

## Proposed acceptance test

### Corpus

Start with 20 fixed fixtures:

| Category | Count |
|---|---:|
| Names | 4 |
| Numbers/currency | 4 |
| IDs/codes | 4 |
| Acronyms | 3 |
| Addresses | 2 |
| Technical/product vocabulary | 3 |
| **Total** | **20** |

### Procedure

For every fixture:

1. Generate RAW audio using model M + voice V.
2. Generate CONTROLLED audio using the same M + V.
3. Blind-listen or review both.
4. Mark:
   - correct
   - incorrect
   - ambiguous
   - unacceptable delivery.
5. Record synthesis latency.
6. Record the transformation applied.

### Primary metric

**Critical-term success rate**

```text
correct difficult items / difficult items tested
```

### Secondary metrics

- correction rate
- unresolved-risk rate
- median TTS response / TTFB
- number of manual pronunciation overrides
- delivery preference in blind listening.

### Important evidence rule

Do not claim a percentage unless we actually run the test and keep the underlying fixture-level results.

The PS explicitly says unverified performance numbers receive no credit.

---

# 11. Recommended architecture

## High-level

```text
                Browser
                   │
             Next.js Frontend
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
  Speech Risk Engine     Rime API Route
        │                     │
        │              Server-side API key
        │                     │
        └──────────┬──────────┘
                   ▼
              Rime TTS
                   │
             Audio response
                   │
                   ▼
              Browser Player
                   │
                   ▼
             Evidence Store
```

## Detailed pipeline

```text
USER INPUT
   │
   ▼
Input parser
   │
   ├── detect numbers
   ├── detect IDs
   ├── detect acronyms
   ├── detect punctuation/delivery issues
   └── detect configured domain terms
   │
   ▼
Speech normalization engine
   │
   ├── safe deterministic rewrite
   ├── optional pronunciation override
   └── confidence / requires-review flag
   │
   ├────────────── RAW TEXT ──────────────┐
   │                                      │
   └──────── SPEECH-READY TEXT ────────┐  │
                                       │  │
                                       ▼  ▼
                                  Rime TTS
                                       │
                             audio + metadata
                                       │
                                       ▼
                               comparison player
                                       │
                                       ▼
                               evaluation results
```

---

# 12. Tech stack

## Frontend

**Next.js + TypeScript**

Why:

- very fast to build
- one repository
- simple deployment
- API routes remove need for a separate backend
- excellent fit for a browser demo.

**UI:** Tailwind CSS

**Audio:** HTML5 `<audio>` initially; use MediaSource/Web Audio only if streaming is needed.

## Backend

**Next.js Route Handlers**

Responsibilities:

- hold Rime API key
- validate input
- call Rime
- return audio
- attach experiment metadata.

## Rime

Primary TTS:

- `mistv3` for the judged prototype
- one verified current English voice
- direct Rime HTTP API for simplest implementation.

Use WebSocket streaming only if needed; do not add it just because it is available.

## Optional LLM

Use an LLM only for the **speech-rewrite reasoning layer**, not as the core evidence.

The LLM should output structured edits:

```json
{
  "original": "...",
  "speech_ready": "...",
  "edits": [
    {
      "text": "HTTP 429",
      "replacement": "HTTP four-two-nine",
      "reason": "identifier delivery"
    }
  ],
  "needs_review": []
}
```

Then enforce deterministic validation before synthesis.

## Storage

MVP:

- local JSON/JSONL fixture file in repo.

Optional:

- Supabase for runs and feedback.

Do not introduce a database unless needed.

## Deployment

Preferred:

- Frontend/API: Vercel
- Rime secret: server environment variable
- Repository: GitHub.

---

# 13. Modules

## M1 — Text input

Input:

- sentence / paragraph
- optional domain.

Output:

- cleaned source text.

## M2 — Risk detector

Detect:

- numbers
- currency
- dates
- alphanumerics
- uppercase sequences
- URLs/emails
- configured domain terms
- uncommon words if coverage checking is enabled.

Output:

```text
risk_type
token
severity
```

## M3 — Speech normalizer

Purpose:

Convert written text to a spoken-safe representation.

Must be:

- deterministic where possible
- reversible enough to explain
- transparent.

## M4 — Pronunciation override layer

For terms that need explicit control:

- store verified pronunciation mappings
- attach Rime custom pronunciation syntax only when supported by the selected Rime model/configuration.

Example conceptual record:

```json
{
  "term": "ExampleCorp",
  "phonetic": "...",
  "verified": true
}
```

Do not pretend a phonetic string was generated live unless it actually was.

## M5 — Delivery editor

Controls:

- speech-ready vs original
- punctuation/pause variant
- speed.

Keep the number of controls small because the PS explicitly discourages decorative sliders.

## M6 — Rime adapter

One job:

> text + model + voice + settings → audio.

Record:

- model
- voice
- language
- endpoint
- format
- timestamp
- latency.

## M7 — Comparison player

Side-by-side:

```text
RAW
▶

CONTROLLED
▶
```

Users should be able to replay instantly.

## M8 — Evidence runner

Run the fixed corpus and generate:

```text
results.json
summary.csv
```

## M9 — Failure/limitation panel

Example:

```text
⚠ Needs review
"XyloQ" is not in our verified pronunciation set.
```

The tool should prefer an honest "review needed" over an unverified automatic fix.

---

# 14. MVP scope — DO THIS

## Must have

### Product

- polished single-page web UI
- typed text input
- risk highlighting
- speech-ready transformation
- raw vs optimized comparison
- Rime playback
- one verified voice
- one verified current Rime model
- 20-fixture evaluation corpus
- results view
- explicit limitations.

### Demo

- one impressive normal case
- one difficult stress case
- one failure/uncertain case
- before/after audio
- measurable result.

### Repo

- clean README
- `.env.example`
- setup instructions
- exact Rime model/voice/endpoint
- evidence file
- fixture corpus
- results/artifacts
- AI disclosure.

---

# 15. Things explicitly OUT OF SCOPE for the deadline

Do **not** build:

- full conversational agent
- phone/telephony
- LiveKit unless necessary
- user authentication
- multi-user workspaces
- complex database
- automatic pronunciation learning
- mobile app
- Chrome extension
- dozens of domains
- TTS provider benchmark
- real-time STT.

These are attractive distractions.

---

# 16. Stretch features — only after MVP works

## Stretch A — Live word highlighting

Use Rime word-level timestamps where supported to highlight what is being spoken.

## Stretch B — Coverage check

Check whether risky vocabulary is in Rime's dictionary before synthesis.

## Stretch C — Voice speed comparison

Allow two speeds and test intelligibility.

## Stretch D — Human correction loop

User hears:

> "Needs review"

then adds an approved pronunciation.

## Stretch E — Batch QA

Upload a CSV containing:

```text
name, sku, address, script
```

and receive a pronunciation risk report.

---

# 17. Why this is feasible by tomorrow

## Engineering complexity

### Low

The core pipeline is only:

```text
input
→ transform
→ Rime API
→ audio player
```

The hard part is **evidence and presentation**, not infrastructure.

## Rime integration complexity

Low.

Rime's documentation provides:

- direct TTS quickstart
- live voices
- model selection
- custom pronunciation
- text normalization guidance
- latency guidance.

Rime's official quickstart is designed to generate the first clip in minutes.

## Deployment complexity

Low.

Next.js + Vercel removes the need to deploy multiple services.

## Evaluation complexity

Moderate but manageable.

A 20-item fixture set is enough to produce concrete evidence without pretending to prove a universal theorem.

---

# 18. Risk matrix

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Rime key/config fails | Medium | Critical | Test API first, server-side secret, preflight early |
| Voice unavailable | Medium | High | Choose from live catalog on submission day |
| Pronunciation override behaves unexpectedly | Medium | High | Use only tested fixtures; keep fallback |
| LLM introduces text corruption | Medium | High | Structured output + exact-content validation |
| UI looks like generic text-to-speech | Medium | High | Make audio comparison and QA the core experience |
| Unsupported claims | High | High | Store fixture-level evidence |
| Network/API latency | Medium | Medium | Distinguish synthesis latency from total browser latency |
| Demo failure | Medium | Critical | Record a clean backup demo |
| Secret leak in GitHub | Low | Critical | `.env`, server-only access, scan before push |

---

# 19. Demo story

## 0:00–0:30 — Problem

Show:

> "Your confirmation code is A12B9X7 and the total is ₹1,25,000."

Say:

> "The text is correct. The question is what the customer actually hears."

## 0:30–1:15 — Raw output

Generate RAW.

Play it.

Point out the difficult tokens.

## 1:15–2:00 — SaySure

Run the same input through the speech-risk engine.

Show:

```text
A12B9X7 → identifier delivery
₹1,25,000 → currency normalization
```

Generate CONTROLLED Rime output.

## 2:00–2:45 — Stress case

Use a difficult technical name / acronym / address.

Show the before/after audio.

## 2:45–3:30 — Evidence

Show fixture results.

Example structure:

```text
20 fixtures
14 automatically safe
4 corrected with controlled text
2 flagged for human review
```

Only show numbers that actually come from the run.

## 3:30–4:00 — Limitation

Show a term we intentionally do not "guess."

This is valuable.

Say:

> "When we're not confident, SaySure does not silently invent a pronunciation."

## 4:00–4:30 — Rime + architecture

Briefly show:

```text
SaySure
  ↓
speech normalization
  ↓
Rime Mist v3
  ↓
verified audio
```

Then mention the exact production configuration used.

---

# 20. Repository structure

```text
saysure/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   ├── synthesize/
│   │   │   └── route.ts
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   └── evaluate/
│   │       └── route.ts
│   └── components/
│       ├── TextEditor.tsx
│       ├── RiskHighlights.tsx
│       ├── AudioCompare.tsx
│       ├── FixtureResults.tsx
│       └── EvidencePanel.tsx
│
├── lib/
│   ├── rime.ts
│   ├── normalize.ts
│   ├── risk-detector.ts
│   ├── validators.ts
│   └── metrics.ts
│
├── fixtures/
│   ├── corpus.json
│   └── expected.json
│
├── evidence/
│   ├── results.json
│   ├── results.csv
│   └── audio/
│
├── README.md
├── RIME_EVIDENCE.md
├── .env.example
├── package.json
└── LICENSE
```

---

# 21. README requirements

The PS requires the README to state:

- setup instructions
- architecture
- third-party services
- known limitations
- failure behavior
- exact Rime model ID
- speaker/voice
- language
- endpoint
- audio format
- transport.

Also disclose:

- AI assistance
- reused code
- data
- assets
- licenses.

**Never commit API keys.**

**Source:** Rime Hackathon Challenge, pp. 2 and 5.

---

# 22. RIME_EVIDENCE.md template

```md
# Rime Evidence

## Hard voice claim

Speech-specific normalization improves the intelligibility/controlled
delivery of difficult domain terms compared with raw written input.

## Acceptance test

20 fixed representative fixtures across:
- names
- numbers/currency
- codes/identifiers
- acronyms
- addresses
- technical vocabulary.

## Configuration

Model:
Voice:
Language:
Endpoint:
Audio format:
Transport:

## Procedure

1. Render raw version.
2. Render controlled version.
3. Keep model and voice constant.
4. Listen and evaluate each item.
5. Record fixture-level outcomes.

## Results

Attach:
- results.json
- results.csv
- generated audio

## Limitations

- Fixed corpus
- Human listening component
- Environment/network effects
- Not a guarantee of universal pronunciation correctness
- Review required for unsupported terms
```

---

# 23. Technical rules we must not violate

## Credential hygiene

- Rime API key lives only on the server.
- `.env` is ignored.
- `.env.example` contains placeholders only.

## Current catalog

The final build must verify the exact:

- model
- voice
- language
- endpoint
- audio format
- transport.

Do not copy an outdated speaker list.

## Fallbacks

A fallback can exist, but:

- it must be disclosed,
- Rime remains the default judged path,
- the active provider must be observable.

## Evidence

Do not say:

> "Our system improves pronunciation by 37%"

unless that exact result is reproducibly measured.

---

# 24. Rime-specific technical choices

## Preferred path

### Direct Rime HTTP API

Reason:

- fastest to integrate
- easiest to debug
- easy to make the Rime dependency explicit
- no reason to add LiveKit when the core challenge is pronunciation/controlled delivery.

## Optional streaming

Move to WebSocket only after the basic demo works.

Rime's current documentation says streaming reduces time-to-audio and provides word-level timestamps on supported paths.

## Model choice

Use **Mist v3** for the prototype because current Rime documentation describes it as a fast, predictable model with pronunciation control.

However:

> **The exact voice/model must be checked against the live catalog at submission time.**

---

# 25. Research-backed design principles

## Principle 1 — Optimize for listeners, not readers

Rime's August 2026 "Writing for the Ear" guidance says text can be technically correct yet still sound like written prose.

Therefore our transformation engine is not merely a spellchecker.

It is:

> **reader-text → listener-text**

## Principle 2 — Treat punctuation and delivery as parameters

Rime recommends rendering alternative punctuation/delivery variants and listening to them.

Therefore the product makes delivery changes visible and testable.

## Principle 3 — Control the hard words

Rime's production guidance emphasizes names, addresses, medical/product terms, acronyms, and other domain-specific language.

Therefore our evaluation corpus deliberately contains those classes.

## Principle 4 — Test correctability, not only initial accuracy

Rime's 2026 best-practices material argues that a useful pronunciation system is one where mistakes can be found and corrected reliably.

Therefore SaySure tracks:

```text
found → fixed → verified
```

rather than only:

```text
right / wrong
```

---

# 26. Important distinction: what is ours vs what is Rime

## Rime provides

- TTS model
- voices
- speech synthesis
- pronunciation controls
- text normalization behavior
- streaming APIs.

## SaySure provides

- risk detection
- domain-specific speech QA workflow
- transformations
- fixture management
- comparison UI
- acceptance testing
- evidence generation
- human-review loop.

This separation is important because the Rime PS explicitly says the application remains responsible for user input, reasoning, orchestration, state, tools, safety, and evaluation.

---

# 27. Why judges should care

Our value proposition is not:

> "Look, we can call a TTS API."

It is:

> "Voice systems fail most noticeably on the information users absolutely need to hear correctly. SaySure turns that failure into an inspectable, testable engineering problem."

That creates a complete judging story:

```text
real voice failure
      ↓
specific user
      ↓
technical intervention
      ↓
Rime synthesis
      ↓
measurable evidence
      ↓
known limitations
```

---

# 28. One-day execution plan

## Phase 0 — first 30 minutes

- create GitHub repo
- obtain/verify Rime access
- make one raw Rime request
- hear one clip
- verify chosen model/voice.

**Do not touch UI until this works.**

## Phase 1 — 1 hour

Build:

```text
input → Rime → audio
```

## Phase 2 — 2 hours

Build deterministic risk detector:

- numbers
- alphanumeric codes
- acronyms
- domain words.

## Phase 3 — 2 hours

Build speech-ready transformation engine.

## Phase 4 — 2 hours

Build polished comparison UI.

## Phase 5 — 1 hour

Build fixture corpus + evidence runner.

## Phase 6 — 1 hour

Run corpus and save real results.

## Phase 7 — 1–2 hours

README + RIME_EVIDENCE.md + `.env.example` + disclosure.

## Phase 8 — 1 hour

Deploy + verify public link.

## Phase 9 — 1 hour

Record demo.

## Final buffer

Keep at least **2 hours of buffer** for:

- API issues
- deployment
- audio bugs
- secret/config mistakes
- final cleanup.

---

# 29. What "good" looks like

A strong submission should feel like this:

### On load

A difficult example is already present.

### In one click

Judge hears the baseline.

### In one more click

Judge hears the controlled version.

### On screen

They can see exactly **what changed and why**.

### Then

They see the real test corpus.

### Finally

They see an honest failure case.

That is much stronger than a giant dashboard.

---

# 30. What NOT to overclaim

Avoid:

- "eliminates pronunciation errors"
- "guarantees correct speech"
- "works for every language"
- "better than all other TTS systems"
- "37% better" without a reproducible benchmark
- "production ready" from a hackathon fixture set.

Prefer:

- "improves these tested fixtures"
- "provides explicit controls"
- "flags unsupported terms"
- "demonstrates controlled delivery"
- "validated on our fixed corpus."

---

# 31. Final submission checklist

## Product

- [ ] Public URL opens without sign-in
- [ ] Rime is the primary spoken path
- [ ] Audio is central to the UX
- [ ] Normal case works
- [ ] Stress case works
- [ ] Failure case is visible
- [ ] Current Rime configuration verified

## Evidence

- [ ] Fixed fixture corpus
- [ ] Before/after audio
- [ ] Fixture-level results
- [ ] Acceptance test documented
- [ ] No unsupported percentages
- [ ] Limitations documented

## Repository

- [ ] Public GitHub repo
- [ ] README
- [ ] `.env.example`
- [ ] no secrets
- [ ] RIME_EVIDENCE.md
- [ ] setup instructions
- [ ] third-party services listed
- [ ] exact Rime model/voice/language/endpoint/audio/transport listed
- [ ] AI assistance disclosure
- [ ] asset/code/data licenses

## Demo

- [ ] <= 4–5 minutes
- [ ] target user
- [ ] problem
- [ ] normal flow
- [ ] hard voice problem
- [ ] deliberate stress/failure case
- [ ] measurement
- [ ] Rime visibly/verbally identified.

---

# 32. Source research

## Official hackathon specification

**Rime Hackathon Challenge — DataForge x Rime**

Uploaded source:
`Rime PS(1).pdf`

Key pages:
- p.1 — judging rubric + definition of voice-native product
- p.2 — submission package + voice problem selection
- p.3 — pronunciation/controlled delivery
- p.4 — acceptance-test methodology + full-duplex example
- p.5 — current production config + credential rules + eligibility
- p.6 — evidence requirement + starter resources

## Official Rime documentation

### Rime documentation index
https://docs.rime.ai/llms.txt

Important current documentation:
- Models: https://docs.rime.ai/docs/models
- Voices: https://docs.rime.ai/docs/voices
- Custom pronunciation: https://docs.rime.ai/docs/custom-pronunciation
- Text normalization: https://docs.rime.ai/docs/text-normalization
- Prompting: https://docs.rime.ai/docs/prompting
- Latency: https://docs.rime.ai/docs/latency
- TTS quickstart: https://docs.rime.ai/docs/quickstart-five-minute
- Coverage: https://docs.rime.ai/api-reference/other/oov

### Rime — Writing for the Ear
https://www.rime.ai/resources/writing-for-the-ear-prompting-your-tts-to-sound-human

Published August 20, 2026.

Core takeaway:
- text is designed for readers;
- speech is consumed by listeners;
- punctuation, wording, and voice choice influence spoken delivery;
- render variants and listen rather than assuming one written form is optimal.

### Rime — TTS + Voice Best Practices
https://www.rime.ai/resources/tts-voice-best-practices

Published February 26, 2026.

Relevant themes:
- pronunciation is a major production quality issue;
- names, addresses, medical/product terms, acronyms, and domain vocabulary are high-risk;
- pronunciation correction and observability matter, not just initial accuracy.

### Rime — Word Coverage API
https://www.rime.ai/resources/check-word-coverage-via-api

Relevant themes:
- verify vocabulary coverage before production;
- handle misses with custom pronunciation or dictionary updates;
- numbers, dates, currency, addresses, and spelled-out strings need normalization.

### Rime — Product updates
https://www.rime.ai/resources/product-updates

Relevant controls:
- custom pauses
- custom pronunciation
- number-sequence and spelling improvements.

### Rime — Linguistics and TTS
https://docs.rime.ai/docs/linguistics

Relevant concept:
- one written form can have multiple valid acoustic realizations;
- Rime exposes controls for custom pronunciation and pauses.

---

# 33. LiveKit research — useful but NOT required for MVP

Rime's challenge recommends LiveKit Agents as a starting point for real-time transport, turn handling, and orchestration.

Current official LiveKit Rime documentation:
https://docs.livekit.io/agents/models/tts/rime/

It supports:
- Rime TTS inside LiveKit Agents
- HTTP or WebSocket operation through the plugin
- streaming
- voice selection
- speed controls
- custom pronunciation support.

**Decision:** Do not use LiveKit for the first MVP unless the prototype evolves into a true realtime agent. It is useful infrastructure, but it solves a broader problem than our selected one.

---

# 34. Final recommendation

## Build this:

# SaySure — Voice Delivery & Pronunciation QA

### Core claim

> **Speech-specific normalization and controlled pronunciation can make difficult domain information more reliably intelligible than raw written input sent directly to TTS.**

### Core interaction

```text
PASTE
  ↓
ANALYZE
  ↓
SEE RISKS
  ↓
SPEECH-READY VERSION
  ↓
HEAR RAW
  ↓
HEAR CONTROLLED
  ↓
VERIFY
```

### Core technical contribution

A small, explainable layer that sits **before Rime** and makes the hard parts of spoken output explicit and testable.

### Core judging advantage

It directly addresses the exact Rime guidance:

- one hard voice problem
- acceptance test
- representative fixtures
- before/after evidence
- controlled delivery
- Rime as primary speech
- deliberate failure case
- transparent limitations.

---

# 35. Strategic rule for the build

> **Do not build more product. Build more proof.**

A polished page + strong before/after audio + 20 well-designed fixtures + a clean acceptance test + honest failure case is a stronger hackathon submission than an ambitious assistant with ten unfinished features.

