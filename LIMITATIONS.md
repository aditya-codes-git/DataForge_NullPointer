# SaySure — Engineering Limitations & Known Boundaries

> **Transparent engineering disclosure for judges, contributors, and evaluators.**  
> **Repository**: `aditya-codes-git/DataForge_NullPointer`  
> **Date**: September 10, 2026

---

## 1. Scope & Philosophy

SaySure is an evidence-driven Voice Delivery & Pronunciation QA layer. In accordance with Rime Hackathon evaluation principles, this document provides an honest, unvarnished accounting of what the current implementation does **not** do, where its technical boundaries lie, and what requires human review.

---

## 2. Voice & Model Boundaries

### A. Model-Specific Pronunciation Variance
- **Tested Baseline**: All primary tests and fixtures are evaluated against Rime's `mistv3` model with the `astra` voice speaker.
- **Cross-Model Drift**: Neural TTS pronunciation behavior can vary between model generations (e.g., `mistv3` vs. newer conversational models like `coda`) and across different voice personas (e.g., `astra` vs. `celeste` vs. `peak`).
- **Limitation**: A controlled candidate that sounds optimal under `astra` on `mistv3` may behave differently under a voice with distinct cadence or accent characteristics. SaySure mitigates this by logging the exact `model` and `voice` in every evidence record and associating verified preferences with specific `term:voice` combinations.

### B. No Universal Pronunciation Claim
- SaySure does **not** claim universal pronunciation accuracy for all world languages, dialects, or regional accents.
- It provides a structured, repeatable methodology to detect risks and test candidate representations against specific production voices.

---

## 3. Language & Locale Boundaries

### A. English Primary
- The current rule catalog, deterministic transformers, and pronunciation knowledge layers are tailored for English text (`en-US` and `en-IN` numbering conventions).
- Non-English languages (Spanish, German, Japanese, etc.) and complex multilingual code-switching within a single sentence have not been benchmarked.

### B. Locale Format Ambiguity
- Ambiguous slash dates (e.g., `03/04/2026` — March 4th vs. April 3rd) depend on locale context. While SaySure expands dates cleanly when day/month order is clear or locale is specified, fully ambiguous dates without locale context remain a known linguistic challenge.

---

## 4. Latency & Transport Boundaries

### A. HTTP REST Transport vs. WebSocket Streaming
- **Current Implementation**: SaySure utilizes Rime's official HTTP REST API (`https://users.rime.ai/v1/rime-tts`) via standard server-side `fetch`.
- **First-Synthesis Latency**: Uncached synthesis requires a full server-to-Rime network roundtrip (typically `~1,000ms – 1,400ms` depending on network conditions).
- **Cached Latency**: Subsequent audits of identical phrases return in **`0ms`** from the server's in-memory SHA-256 synthesis cache.
- **Limitation**: Realtime WebSocket streaming with word-level alignment timestamps is not implemented in the current build. Audio is returned as a complete Base64 Data URI once synthesis finishes.

---

## 5. Storage & Persistence Boundaries

### A. In-Memory Evidence & Cache Stores
- **Server State**: The `EVIDENCE_STORE` (provenance records) and the SHA-256 audio synthesis cache are maintained in Node.js server process memory.
- **Limitation**: If the Express server restarts, in-memory evidence records and cached audio buffers reset. In a mature post-MVP enterprise architecture, these would be backed by a persistent PostgreSQL database and an S3-compatible audio bucket.

### B. Client History Persistence
- **Client State**: Analysis history shown in `/dashboard/history` is persisted in the browser's `localStorage` under `saysure_analysis_history_v1`.
- **Limitation**: History does not automatically synchronize across different devices or browsers for the same user.

---

## 6. Dependency & Failure Handling Boundaries

### A. Rime API Downtime / Missing Credentials
- If `RIME_API_KEY` is not provided or the Rime endpoint is unreachable, SaySure runs in **Offline Inspection Mode**:
  - Speech-risk detection, candidate generation, 10-point preservation validation, and decision engine logic operate normally.
  - Audio comparison displays an explicit, non-crashing banner informing the user that live synthesis requires an active Rime key.
  - SaySure does not fake audio playback or invent synthetic audio when the provider is offline.

### B. Groq LLM Downtime / Missing Credentials
- If `GROQ_API_KEY` is omitted or Groq is unreachable:
  - Deterministic rules and catalog terms (`PostgreSQL`, `Kubernetes`, currencies, identifiers, dates, status codes) operate with zero degradation via rule-based fast paths.
  - Contextual resolution for ambiguous proper nouns falls back to rule-based defaults and marks `reviewRequired: true`.

---

## 7. Security Boundaries

- **What SaySure Protects**: Server-side API keys (`RIME_API_KEY`, `GROQ_API_KEY`) are isolated from client bundles. Input text is scanned for common secret patterns (API keys, JWTs, private keys) before synthesis.
- **What SaySure Does Not Protect Against**: SaySure is not an enterprise DLP (Data Loss Prevention) gateway. It does not perform deep PII redaction (e.g., social security numbers or HIPAA-governed health records) beyond standard pattern warnings. Users should only test synthetic or non-sensitive text.

---

## 8. Post-MVP Feature Delimitations

The following capabilities are deliberately outside the scope of the Hackathon MVP:
1. **Batch CSV Script Processing**: Bulk file uploads and mass export are post-MVP features; the current product focuses on interactive single-sentence and multi-entity paragraph QA.
2. **Developer CLI / npm SDK Package**: Sample SDK integration code is demonstrated on the landing page, but `@saysure/sdk` is not published to npm.
3. **LiveKit Realtime Transport Adapter**: LiveKit integration is documented as a future architectural adapter for realtime agent voice streams.
4. **Fine-Grained Delivery Sliders**: Decorative sliders for speed and pause duration were excluded per specification to avoid unbacked UI controls.
