# SaySure — 4–5 Minute Hackathon Video Demo Script

> **Judge-Ready Walkthrough Script for the Rime Hackathon.**  
> **Challenge Track**: Pronunciation + Controlled Delivery  
> **Target Duration**: 4:30 – 5:00 minutes

---

## Overview & Demo Goals

This script demonstrates:
1. **The Problem**: Written text fails when consumed directly by neural speech models.
2. **Core Philosophy**: `DETECTION ≠ CORRECTION` (Investigation beats blind rewriting).
3. **Hard Voice Problem**: Alphanumeric codes (`A12B9X7`) and Indian currency (`₹1,25,000`).
4. **Concurrent Rime Audition**: Side-by-side comparison of RAW vs. CONTROLLED audio.
5. **RAW Can Win**: `Kubernetes` retained raw because native Rime synthesis already excels.
6. **Failure Surfacing**: `XyloQ` routes to `NEEDS_REVIEW` because SaySure refuses to guess.
7. **Evidence & Provenance**: Human verification and reproducible evidence tracking.

---

## Demo Script Timeline

```
[0:00 - 0:35]  ACT 1: THE REAL-WORLD PROBLEM
[0:35 - 1:05]  ACT 2: SAYSURE ARCHITECTURE & CORE PRINCIPLE
[1:05 - 2:30]  ACT 3: THE HARD VOICE PROBLEM (A12B9X7 + ₹1,25,000)
[2:30 - 3:15]  ACT 4: RAW VS CONTROLLED RIME AUDITION
[3:15 - 3:45]  ACT 5: WHEN RAW WINS (KUBERNETES)
[3:45 - 4:15]  ACT 6: HONEST FAILURE SURFACING (XYLOQ -> NEEDS_REVIEW)
[4:15 - 4:45]  ACT 7: LISTENER VERIFICATION & EVIDENCE RECORD
[4:45 - 5:00]  ACT 8: CONCLUSION & RIME ESSENTIALITY
```

---

### ACT 1: The Real-World Problem (0:00 – 0:35)

**Visual**: Start on the SaySure Landing Page ([`http://localhost:3000`](http://localhost:3000)). Scroll down slightly to the specimen card.

**Speaker**:
> "Every production AI application is producing written text that is meant to be spoken aloud. But text written for the eye behaves fundamentally differently from speech meant for the ear.
> 
> When standard text-to-speech engines synthesize raw written content:
> - Alphanumeric security codes like `A12B9X7` get slurred into mumbled pseudowords.
> - Currencies like Indian Rupee `₹1,25,000` get mangled because Western TTS engines don't understand lakh comma grouping.
> - And protocol status codes like `HTTP 429` are read as 'four hundred twenty-nine' rather than 'four two nine'.
> 
> The result? A confusing, embarrassing, and failed user experience."

---

### ACT 2: SaySure Architecture & Core Principle (0:35 – 1:05)

**Visual**: Click **Launch Console** or navigate to `/dashboard/analyze`. Show the clean SaySure SaaS workspace with the left sidebar.

**Speaker**:
> "This is SaySure: a Voice Delivery & Pronunciation QA layer that sits directly between your application text and Rime TTS.
> 
> Our foundational engineering philosophy is: **DETECTION DOES NOT EQUAL CORRECTION**.
> 
> When SaySure detects a difficult term, it does not blindly mutate it. It treats the risk as an invitation to investigate, tests competing hypotheses against Rime TTS, and lets real acoustic evidence decide the outcome."

---

### ACT 3: The Hard Voice Problem (1:05 – 2:30)

**Visual**: In the Analyze textarea, click the preset **`Identifier + Currency`** (or paste: `"Your verification code is A12B9X7 and your total is ₹1,25,000."`).

**Speaker**:
> "Let’s test a mission-critical sentence that combines two hard voice challenges: an alphanumeric confirmation code and an Indian currency denomination.
> 
> Notice what happens:
> 1. SaySure immediately isolates `A12B9X7` as an alphanumeric identifier and `₹1,25,000` as currency.
> 2. It generates a speech-ready candidate:
>    *'Your verification code is A one two B nine X seven and your total is one lakh twenty-five thousand rupees.'*
> 3. Our 10-point candidate validator runs: it verifies that 100% of the characters in `A12B9X7` are preserved, and that the currency is accurately denominated in lakhs without numeric drift."

---

### ACT 4: RAW vs CONTROLLED Rime Audition (2:30 – 3:15)

**Visual**: Click **Analyze Speech**. Show the dual waveform comparison cards. Click **Play RAW Audio**, then click **Play Controlled**.

**Speaker**:
> "When we click Analyze, SaySure initiates a concurrent fair audition through Rime TTS. It synthesizes both the RAW unnormalized text and the Controlled candidate under the exact same Rime voice—`astra` on `mistv3`.
> 
> Listen to the RAW audio:
> *(Play RAW: Hear the model slur 'ay-twelve-bee...' and stumble on the rupee symbol)*
> 
> Now listen to the Controlled audio:
> *(Play Controlled: Hear 'A one two B nine X seven' and 'one lakh twenty-five thousand rupees')*
> 
> The difference is stark. The decision engine evaluates the auditory evidence and confirms: **CONTROLLED PREFERRED**."

---

### ACT 5: When RAW Wins (3:15 – 3:45)

**Visual**: Click the preset **`HTTP 429 + Kubernetes`** or paste: `"All microservices run on Kubernetes in production."` Click **Analyze Speech**.

**Speaker**:
> "Now let’s look at why SaySure is not a blind rewriter.
> 
> Here, `Kubernetes` is detected as a technical domain term. A naive rewriter would force an ugly phonetic respelling like 'koo-ber-net-eez'.
> 
> But SaySure knows that Rime's native neural model already pronounces Kubernetes with high fidelity.
> 
> Look at the decision outcome: **KEEP RAW**. SaySure retains the original written text because native Rime synthesis is already optimal. The original is always allowed to win."

---

### ACT 6: Honest Failure Surfacing (3:45 – 4:15)

**Visual**: Click the preset **`Ambiguous XyloQ`** (or paste: `"The customer requested a refund for XyloQ."`). Click **Analyze Speech**.

**Speaker**:
> "What happens when a brand name or proper noun is completely novel or unsupported?
> 
> Most AI tools make a confident guess and hallucinate a pronunciation. SaySure refuses to guess.
> 
> Here, `XyloQ` is flagged as an ambiguous token. The decision engine outputs: **NEEDS REVIEW**.
> 
> It transparently alerts the developer that human verification is required before shipping this phrase to users. In voice engineering, surfacing uncertainty is a feature, not a failure."

---

### ACT 7: Listener Verification & Evidence Record (4:15 – 4:45)

**Visual**: Scroll down to the **Verification QA** card. Show the double-blind listener buttons. Click **Candidate B (Controlled) Preferred**.

**Speaker**:
> "Every audition produces a permanent, auditable provenance record. Notice the unique Evidence ID: `ev-1789016...`.
> 
> A human reviewer can listen double-blind and cast a vote: Candidate A, Candidate B, Same, or Not Sure.
> 
> When we submit this preference, it records into our server's verified voice memory, ensuring that future checks for this specific voice and term reuse the verified human decision."

---

### ACT 8: Conclusion & Rime Essentiality (4:45 – 5:00)

**Visual**: Navigate to the `/dashboard/history` page, showing the logged checks and filters. Return to the main screen.

**Speaker**:
> "SaySure turns voice delivery into a testable, measurable, and reproducible engineering discipline.
> 
> Rime TTS is the heart of SaySure: its neural clarity, predictable `mistv3` pronunciation, and sub-second synthesis make fine-grained voice quality assurance possible.
> 
> Thank you!"

---

## Live Demo Checklist

- [ ] Dev server running on `http://localhost:3000` via `npm run dev`.
- [ ] Valid `RIME_API_KEY` in `.env.local`.
- [ ] Microphone and desktop audio routed cleanly to screen recorder.
- [ ] Browser zoom set to 100% or 110% for sharp text rendering.
- [ ] Presets tested: `A12B9X7 + ₹1,25,000`, `Kubernetes`, `XyloQ`.
