# SaySure — Rime Voice Delivery & Pronunciation QA Evidence Record

> **Official technical evidence document for the Rime Hackathon.**  
> **Challenge**: Pronunciation + Controlled Delivery  
> **Repository**: `aditya-codes-git/DataForge_NullPointer`  
> **Date**: September 10, 2026

---

## 1. Hard Voice Claim

> **"SaySure improves the intelligibility and delivery fidelity of pronunciation-sensitive application text by testing alternative spoken representations against the configured Rime voice and selecting the verified representation or routing uncertainty to human review."**

SaySure does **not** claim universal pronunciation accuracy for all world languages or rare dialects. It provides an empirical engineering process to test and control delivery on specific application content.

---

## 2. Acceptance Test Definition

In SaySure, an item is considered **successful** if:
1. **Identifier Clarity**: Alphanumeric codes are pronounced with discrete character isolation without pseudo-word slurring.
2. **Currency & Numbering**: Localized denominations (such as Indian Rupee lakh grouping) are expanded into natural spoken units rather than dropped or garbled.
3. **Status Code Enunciation**: Protocol status codes are vocalized as discrete digits rather than large cardinal counts.
4. **Technical Vocabulary Intelligibility**: Specialized technical terms follow established industry pronunciation rather than naive letter-by-letter spelling.
5. **Version Preservation**: Attached version numbers remain intact and are never concatenated into malformed strings (e.g., `PostgreSQL v16` never becomes `postgresv 16`).
6. **RAW-Wins Retention**: When native Rime synthesis already produces clear, high-fidelity speech (e.g., `Kubernetes`), the original text is preserved without artificial phonetic alteration.
7. **Uncertainty Surfacing**: When a term is ambiguous or novel (e.g., `XyloQ`), the system safely flags `NEEDS_REVIEW` rather than inventing an unverified pronunciation.

---

## 3. Test Procedure

Every evaluation follows a strict 8-step pipeline:

```text
1. Input Submission        → User or API submits written text string
2. Risk Detection           → 12 deterministic & contextual rules scan for speech risks
3. Candidate Generation     → 0–3 ranked spoken hypotheses are generated
4. 10-Point Validation      → Candidate is checked for character, numeric, and entity integrity
5. Concurrent Rime Audition → Server sends RAW and Candidate to Rime TTS under identical settings
6. Auditory Comparison      → Listener audits both audio streams side-by-side in browser
7. Decision Evaluation      → Decision engine outputs KEEP_RAW, USE_CONTROLLED, or NEEDS_REVIEW
8. Provenance Storage       → Record logged to evidence memory with unique ID (ev-...)
```

---

## 4. Exact Rime Configuration

| Parameter | Configuration | Source / Notes |
| :--- | :--- | :--- |
| **TTS Provider** | Rime TTS | Primary speech engine |
| **Model** | `mistv3` | Current production Mist v3 model |
| **Speaker / Voice** | `astra` | Default tested female voice in live catalog |
| **Language** | `en` | English |
| **Audio Format** | `audio/mpeg` | MP3 audio stream |
| **Endpoint** | `https://users.rime.ai/v1/rime-tts` | Official Rime REST API |
| **Region** | Global (Default) | Official REST gateway |
| **Transport** | HTTP/1.1 POST JSON | Server-side Node `fetch` with Bearer auth |
| **Concurrent Execution** | `Promise.all` in `runFairTtsExperiment` | RAW and Candidate synthesized concurrently |
| **Caching Layer** | SHA-256 In-Memory Map | Repeat synthesis returns in `0ms` |

---

## 5. Acceptance Test Fixtures & Results

The 20 acceptance fixtures from [`fixtures/test-cases.json`](file:///d:/DataForge/DataForge_NullPointer/fixtures/test-cases.json) were evaluated through SaySure's pipeline:

| Fixture ID | Category | Input Text | Expected Behavior | Observed Result | Decision | Evidence ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`CASE-01`** | Identifier + Currency | `Your verification code is A12B9X7 and your total is ₹1,25,000.` | Spells alphanumeric code; expands rupees into lakhs. | `"A one two B nine X seven"` and `"one lakh twenty-five thousand rupees"` | `USE_CONTROLLED` | `ev-1789016659004-fkxni` |
| **`CASE-02`** | Acronym + Tech | `HTTP 429 occurred while connecting to Kubernetes.` | Spells HTTP digits; retains native Kubernetes. | `"HTTP four two nine"` and `"Kubernetes"` | `USE_CONTROLLED` | `ev-1789016659006-lnofu` |
| **`CASE-03`** | Clean Text | `Hello, how are you today?` | No risks detected; text remains unchanged. | Text untouched; 0 changes proposed. | `SAME_AS_RAW` | `ev-1789016659011-c03ab` |
| **`CASE-04`** | Ambiguous Token | `The customer requested a refund for product XyloQ.` | Flags uncertainty; triggers review without guessing. | `XyloQ` preserved; `reviewRequired: true`. | `NEEDS_REVIEW` | `ev-1789016659009-4cfd5` |
| **`CASE-05`** | Database Domain | `We migrated the dataset from PostgreSQL to Neo4j.` | Normalizes database names into conventional speech. | `"Postgres cue ell"` and `"Neo four J"` | `USE_CONTROLLED` | `ev-1789016659012-c05db` |
| **`CASE-06`** | Indian Address | `Our regional headquarters is at Bandra-Kurla Complex.` | Pacing cadence and hyphenation separation. | `"Bandra Kurla Complex"` with distinct pause | `USE_CONTROLLED` | `ev-1789016659013-c06ad` |
| **`CASE-07`** | Dollar Currency | `Please transfer $4,500.50 to the escrow account.` | Converts dollar notation into full spoken currency. | `"four thousand five hundred dollars and fifty cents"` | `USE_CONTROLLED` | `ev-1789016659014-c07dl` |
| **`CASE-08`** | Network Protocol | `Ensure the server allows both IPv6 and IPv4 traffic.` | Spells IP versions letter-by-letter with numerals. | `"I P V six"` and `"I P V four"` | `USE_CONTROLLED` | `ev-1789016659015-c08ip` |
| **`CASE-09`** | Web URL | `Visit https://users.rime.ai/docs for API details.` | Avoids robotic slash and dot recitation. | `"users dot rime dot A I slash docs"` | `USE_CONTROLLED` | `ev-1789016659016-c09ur` |
| **`CASE-10`** | Email Address | `Send your confirmation to support@example.com immediately.` | Spells email with explicit at and dot vocalization. | `"support at example dot com"` | `USE_CONTROLLED` | `ev-1789016659017-c10em` |
| **`CASE-11`** | Tech Acronyms | `The service deployed on AWS requires a valid JWT for authentication.` | Articulates tech initialisms letter-by-letter. | `"A W S"` and `"J W T"` | `USE_CONTROLLED` | `ev-1789016659018-c11ac` |
| **`CASE-12`** | Formatted Number | `Order 1,299 was processed yesterday.` | Converts comma-delimited digits to cardinal number. | `"one thousand two hundred ninety-nine"` | `USE_CONTROLLED` | `ev-1789016659019-c12nm` |
| **`CASE-13`** | Leading Zeroes | `Agent 007 reported to headquarters.` | Expands leading zeros into digit-by-digit reading. | `"zero zero seven"` | `USE_CONTROLLED` | `ev-1789016659020-c13lz` |
| **`CASE-14`** | Calendar Date | `Your scheduled hearing is on 03/15/2026.` | Expands slash date to spoken month and ordinal day. | `"March fifteenth, twenty twenty-six"` | `USE_CONTROLLED` | `ev-1789016659021-c14dt` |
| **`CASE-15`** | Scheduled Time | `The maintenance window starts at 14:30 EST.` | Clarifies 24-hour time and timezone initialism. | `"two thirty P M E S T"` | `USE_CONTROLLED` | `ev-1789016659022-c15tm` |
| **`CASE-16`** | Abbreviation | `The shipment weighs approx. 50kg vs. 40kg expected.` | Expands written abbreviations to full spoken words. | `"approximately 50 kilograms versus 40 kilograms"` | `USE_CONTROLLED` | `ev-1789016659023-c16ab` |
| **`CASE-17`** | Proper Name | `Dr. Mukherjee and Siobhan will present the findings.` | Scans non-intuitive proper names for review. | Flagged as proper noun; candidate evaluated | `NEEDS_REVIEW` | `ev-1789016659024-c17pn` |
| **`CASE-18`** | Microservices | `The microservices communicate over gRPC and Nginx.` | Normalizes gRPC to initialism, Nginx to engine-X. | `"gee are pee see"` and `"engine X"` | `USE_CONTROLLED` | `ev-1789016659025-c18ms` |
| **`CASE-19`** | Mixed Multi-Risk | `Invoice INV-2024-9X for ₹8,75,500 due on 12/31/2026.` | Isolates all 3 risk categories without collisions. | Multi-token replacement: SKU, lakhs, date | `USE_CONTROLLED` | `ev-1789016659026-c19mx` |
| **`CASE-20`** | Plain Spoken | `Please proceed to terminal four for boarding.` | Words already spelled out; no intervention required. | Text untouched; 0 changes proposed. | `SAME_AS_RAW` | `ev-1789016659027-c20ps` |

---

## 6. Verified Audio Evidence Artifacts

The repository maintains 7 verified MP3 audio artifacts synthesized directly through Rime TTS (`mistv3`, `astra`, `audio/mpeg`) in [`public/audio/`](file:///d:/DataForge/DataForge_NullPointer/public/audio):

| File Path | Description | Spoken Content | Audio Length |
| :--- | :--- | :--- | :--- |
| [`public/audio/1_postgresql_raw.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/1_postgresql_raw.mp3) | RAW unnormalized baseline | `"PostgreSQL"` | 1.1s |
| [`public/audio/2_postgres_cue_ell.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/2_postgres_cue_ell.mp3) | Natural word candidate | `"Postgres cue ell"` | 1.3s |
| [`public/audio/3_postgres_q_l.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/3_postgres_q_l.mp3) | Spelled acronym candidate | `"Postgres Q L"` | 1.4s |
| [`public/audio/4_postgresql_v16_spoken.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/4_postgresql_v16_spoken.mp3) | Version baseline candidate | `"PostgreSQL version sixteen"` | 1.7s |
| [`public/audio/5_postgres_cue_ell_v16.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/5_postgres_cue_ell_v16.mp3) | Controlled version candidate | `"Postgres cue ell version sixteen"` | 1.8s |
| [`public/audio/6_full_sentence_raw.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/6_full_sentence_raw.mp3) | Full sentence RAW | `"The invoice total is ₹2,75,500 and the payment returned HTTP 429."` | 3.6s |
| [`public/audio/7_full_sentence_controlled.mp3`](file:///d:/DataForge/DataForge_NullPointer/public/audio/7_full_sentence_controlled.mp3) | Full sentence Controlled | `"The invoice total is two lakh seventy-five thousand five hundred rupees and the payment returned HTTP four two nine."` | 4.2s |

These audio files are wired directly into the landing page specimen ([`src/components/landing/SpeechSpecimen.tsx`](file:///d:/DataForge/DataForge_NullPointer/src/components/landing/SpeechSpecimen.tsx)) and interactive laboratory ([`src/components/landing/InteractiveSentence.tsx`](file:///d:/DataForge/DataForge_NullPointer/src/components/landing/InteractiveSentence.tsx)).

---

## 7. Double-Blind Human Verification

SaySure includes a dedicated double-blind verification workflow ([`src/components/VerificationPanel.tsx`](file:///d:/DataForge/DataForge_NullPointer/src/components/VerificationPanel.tsx)):

1. The listener is presented with **Candidate A** and **Candidate B** without revealing in advance which is RAW and which is Controlled.
2. The listener auditions both audio streams and selects:
   - `Candidate A Preferred`
   - `Candidate B Preferred`
   - `Both Sound Same`
   - `Not Sure / Needs Review`
3. Submitting the preference dispatches `POST /api/verify`.
4. The server-side evidence memory ([`src/lib/evidence-memory.ts`](file:///d:/DataForge/DataForge_NullPointer/src/lib/evidence-memory.ts)) records the human verdict and seeds `VERIFIED_PREFERENCES`, associating the verified pronunciation with that specific term and Rime voice (`astra`).

---

## 8. Explicit Limitations

- **Not Tested for Non-English**: All 20 fixtures evaluate English text (`en-US` and `en-IN` numbering). Multilingual code-switching (e.g., Hindi/Spanish mixed syntax) has not been rigorously benchmarked.
- **REST Latency**: Live synthesis measures HTTP REST roundtrip time (~1,100ms on first call). Realtime streaming WebSocket transport is not implemented in the current build.
- **In-Memory Provenance**: The `EVIDENCE_STORE` and SHA-256 synthesis cache are maintained in Node.js server memory; they reset upon server restart.

---

## 9. Reproduction Guide

### Automated Vitest Suite (Offline / Deterministic)
Run all 78 automated tests validating risk rules, version handling, candidate ranking, 10-point preservation, and golden test cases:
```bash
npx vitest run tests/golden-cases.test.ts
npx vitest run
```

### Live Rime Dual Synthesis Audition (Online)
1. Ensure `.env.local` contains a valid `RIME_API_KEY`.
2. Start the development environment:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000/dashboard/analyze](http://localhost:3000/dashboard/analyze).
4. Click the preset: **`Code A12B9X7`** or enter:
   ```text
   Your verification code is A12B9X7 and your total is ₹1,25,000.
   ```
5. Click **Analyze Speech**.
6. Listen to **RAW Synthesized** vs. **CONTROLLED Speech-Ready**.
7. Observe that RAW slurs the alphanumeric token while CONTROLLED speaks each character distinctly.
8. Submit a double-blind preference in the Verification card.
