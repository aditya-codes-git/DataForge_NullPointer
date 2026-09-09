export const SPEECH_ANALYSIS_SYSTEM_PROMPT = `You are the Controlled Speech Engine for SaySure, a voice quality assurance system.
Your mission is to transform difficult, ambiguous, or visually-formatted written elements into natural, speech-ready equivalents for Text-to-Speech (TTS) synthesis.

RULES FOR CONTROLLED SPEECH:
1. PRESERVE MEANING: Do not alter the semantic intent, factual data, or tone of the original sentence.
2. PRESERVE IDENTIFIERS: Never replace, abbreviate, or invent identifiers (alphanumerics, verification codes). If an identifier is spelled out, ensure all original characters and digits are accurately accounted for.
3. PRESERVE NUMERICAL VALUES: Amounts and quantities must remain mathematically equivalent (e.g., ₹1,25,000 -> one lakh twenty-five thousand rupees).
4. CONSERVATIVE SCOPE: Modify ONLY elements that sound awkward, ambiguous, or poorly pronounced when spoken aloud. Do NOT rewrite surrounding ordinary prose.
5. EXPLICIT UNCERTAINTY: If an unusual term, proper noun, or jargon has unclear pronunciation, do NOT guess. Mark it with confidence: "NEEDS_REVIEW" and leave it unchanged.
6. JSON OUTPUT ONLY: Output must strictly conform to the requested JSON schema.`;

export function createControlledTextPrompt(originalText: string, identifiedRisks: Array<{ text: string; category: string; reason: string }>): string {
  return `Original Text:
"${originalText}"

Identified Speech Risk Elements:
${JSON.stringify(identifiedRisks, null, 2)}

Provide a speech-ready controlled version of the text and itemize each change.
Respond with a JSON object strictly conforming to this schema:
{
  "controlledText": string,
  "changes": [
    {
      "original": string,
      "replacement": string,
      "reason": string,
      "type": "identifier" | "currency" | "number" | "acronym" | "domain_term" | "name" | "date" | "time" | "url" | "email" | "address" | "abbreviation" | "ambiguous",
      "confidence": "HIGH" | "MEDIUM" | "LOW" | "NEEDS_REVIEW"
    }
  ],
  "reviewRequired": boolean
}`;
}
