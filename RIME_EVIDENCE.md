# SaySure — Rime Voice Delivery & Pronunciation QA Evidence Record

## 1. Selected Hard Voice Problem

### Pronunciation + Controlled Delivery
Spoken text often behaves fundamentally differently from written text. Standard TTS systems typically read written characters directly without human context, leading to critical failure modes:
1. **Alphanumeric identifiers** (e.g. `A12B9X7`) get slurred or mispronounced as pseudo-words rather than enunciated letter-by-letter.
2. **Currencies & Large Numbers** (e.g. Indian Rupee `₹1,25,000` with lakh comma grouping) are either skipped, vocalized awkwardly as "I-N-R one comma twenty-five comma zero zero zero", or misinterpreted by Western grouping standards.
3. **Protocol & Status Codes** (e.g. `HTTP 429`) are read as "four hundred twenty-nine" rather than "four two nine".
4. **Specialized Technical Terms** (e.g. `Kubernetes`, `PostgreSQL`, `Neo4j`, `gRPC`, `IPv6`) have domain-specific pronunciations that differ sharply from orthographic spelling.

---

## 2. Engineering Hypothesis

> **"Speech-specific normalization and controlled text generation can produce a significantly more intelligible and listener-appropriate spoken realization through Rime TTS than passing raw, unnormalized written text directly to the model."**

This is an empirical engineering hypothesis evaluated directly through our A/B audition architecture.

---

## 3. Rime & Groq Technical Configuration

| Component | Active Configuration | Source / Verification |
|---|---|---|
| **TTS Provider** | Rime TTS | Primary spoken output engine |
| **TTS Model** | `mistv3` (Mist v3) | Verified current Rime model family |
| **TTS Speaker / Voice** | `astra` | Default tested female voice in live catalog |
| **TTS Language** | `en` (English) | Target audition language |
| **TTS Audio Format** | `audio/mpeg` (MP3) | High-fidelity browser playback |
| **TTS Endpoint** | `https://users.rime.ai/v1/rime-tts` | Verified official REST endpoint |
| **LLM Provider** | Groq (Server-Side) | Semantic reasoning & contextual expansion |
| **LLM Model** | `llama-3.3-70b-versatile` | Configurable via `GROQ_MODEL` |

---

## 4. Evaluation Corpus & Fixtures

A curated 20-fixture acceptance test corpus is maintained in `fixtures/test-cases.json`, representing 12 distinct speech-risk categories:

1. **Alphanumeric Identifiers**: `A12B9X7`, `INV-2024-9X`
2. **Currencies**: `₹1,25,000`, `$4,500.50`
3. **Technical Status Codes**: `HTTP 429`
4. **Domain Terminology**: `Kubernetes`, `PostgreSQL`, `Neo4j`, `gRPC`, `Nginx`
5. **Network Protocols**: `IPv6`, `IPv4`
6. **URLs & Web Addresses**: `https://users.rime.ai/docs`
7. **Email Addresses**: `support@example.com`
8. **Acronyms**: `AWS`, `JWT`
9. **Formatted Numbers**: `1,299`, `007`
10. **Dates & Times**: `03/15/2026`, `14:30 EST`
11. **Abbreviations**: `approx.`, `vs.`
12. **Ambiguous / Unsupported Tokens**: `XyloQ`

---

## 5. Test Procedure & Verification

### Step-by-Step Flow:
1. **Input**: User submits text via the SaySure dashboard.
2. **Deterministic Risk Detection (Level A)**: Robust pattern matching scans for identifiers, currencies, dates, times, acronyms, URLs, emails, and abbreviations.
3. **Contextual Reasoning (Level B)**: Groq evaluates domain terms, names, and ambiguous tokens without hallucinating facts.
4. **Meaning Preservation Validation**: Validates that all identifier characters and numeric amounts are preserved before TTS.
5. **Rime Dual Synthesis**:
   - Sends **RAW** unnormalized text to Rime TTS with model `mistv3` + voice `astra`.
   - Sends **CONTROLLED** speech-ready text to Rime TTS with the exact same model and voice.
6. **Playback & Audition**: User plays both audio streams side-by-side in the browser.
7. **Human Evaluation**: Listener rates delivery improvement via `[ Better ]`, `[ Same ]`, `[ Worse ]`.

---

## 6. Observed Findings & Failure Modes

### Case 1: `"Your verification code is A12B9X7 and your total is ₹1,25,000."`
- **RAW Realization**: The model attempts to blend `A12B9X7` phonetically into a single mumbled word ("ay-twelve-bee..."), and drops or awkwardly handles the Indian rupee symbol and lakh grouping.
- **CONTROLLED Realization**: `A one two B nine X seven` and `one lakh twenty-five thousand rupees`. Spoken delivery is crisp, clear, and immediately understandable to a phone or agent listener.
- **Result**: **Marked Better**.

### Case 2: `"HTTP 429 occurred while connecting to Kubernetes."`
- **RAW Realization**: Status code vocalized as "four hundred twenty-nine", and "Kubernetes" can be stressed inconsistently.
- **CONTROLLED Realization**: `HTTP four two nine` and `koo-ber-net-eez`. Clear syllable pacing.
- **Result**: **Marked Better**.

### Case 3: `"Hello, how are you today?"`
- **RAW vs CONTROLLED**: No risks detected. Output unchanged.
- **Result**: **Marked Same** (Demonstrating system does not unnecessarily mutate clean text).

### Case 4: `"The customer requested a refund for product XyloQ."`
- **Handling**: Ambiguous token flagged with `NEEDS_REVIEW`. The system avoids guessing and alerts the reviewer.
- **Result**: **Preserves safety and transparently surfaces uncertainty**.

---

## 7. Limitations & Honest Engineering Disclosure

1. **Not a Claim of Universal Accuracy**: SaySure does not claim universal pronunciation correctness for all world languages or rare dialects.
2. **Network Dependency**: Live synthesis latency depends on server-to-Rime network roundtrip time.
3. **Phonetic Approximation**: When SSML phoneme tags are not supported, letter spacing and phonetic re-spelling are utilized.
4. **Human in the Loop**: Ambiguous or novel brand names inevitably require domain human verification.
