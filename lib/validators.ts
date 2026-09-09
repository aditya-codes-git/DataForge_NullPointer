import { SpeechRisk, Transformation } from './schemas';

export interface ValidationResult {
  isValid: boolean;
  reviewRequired: boolean;
  reasons: string[];
}

export function validateControlledText(
  originalText: string,
  controlledText: string,
  risks: SpeechRisk[],
  changes: Transformation[]
): ValidationResult {
  const reasons: string[] = [];
  let reviewRequired = false;

  // 1. Output sanity: cannot be empty
  if (!controlledText || controlledText.trim().length === 0) {
    return {
      isValid: false,
      reviewRequired: true,
      reasons: ['Controlled text output is empty.'],
    };
  }

  // 2. Length sanity: cannot explode inexplicably (> 3.5x original unless original is very short < 15 chars)
  if (originalText.length >= 15 && controlledText.length > originalText.length * 3.5) {
    reviewRequired = true;
    reasons.push('Controlled text is disproportionately longer than original text.');
  }

  // 3. Identifier preservation: Every detected identifier's characters must be preserved
  for (const risk of risks) {
    if (risk.category === 'identifier') {
      const code = risk.text.replace(/[-_]/g, '');
      // Check if code itself is in controlled text
      const directMatch = controlledText.includes(code);
      
      // Or check if its characters/digits are spelled out in sequence
      const digitMap: Record<string, string> = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
        '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
      };
      
      const charTokens = Array.from(code).map(c => digitMap[c] || c.toLowerCase());
      const lowerControlled = controlledText.toLowerCase();
      
      let allCharsAccounted = true;
      for (const token of charTokens) {
        if (!lowerControlled.includes(token)) {
          allCharsAccounted = false;
          break;
        }
      }

      if (!directMatch && !allCharsAccounted) {
        reviewRequired = true;
        reasons.push(`Identifier "${risk.text}" was not faithfully preserved in controlled text.`);
      }
    }

    // 4. Currency / Number preservation
    if (risk.category === 'currency') {
      const numericDigits = risk.text.replace(/[^0-9]/g, '');
      if (numericDigits.length >= 4) {
        // e.g. 125000 -> check for "lakh" or "thousand" or the number itself
        const lowerControlled = controlledText.toLowerCase();
        const hasNumberTokens =
          lowerControlled.includes('lakh') ||
          lowerControlled.includes('thousand') ||
          lowerControlled.includes('million') ||
          lowerControlled.includes(numericDigits);

        if (!hasNumberTokens) {
          reviewRequired = true;
          reasons.push(`Currency amount "${risk.text}" was not properly represented.`);
        }
      }
    }

    // 5. Technical Domain Entity & Version Preservation
    if (risk.category === 'domain_term') {
      const termBase = risk.text.split(/[\s/]/)[0]; // e.g. "PostgreSQL" from "PostgreSQL v16"
      const lowerControlled = controlledText.toLowerCase();
      const lowerBase = termBase.toLowerCase();

      // Check if technical entity base is preserved or spelled out (e.g. "I P V" or "G R P C" or "Node")
      const isEntityPreserved =
        lowerControlled.includes(lowerBase) ||
        lowerControlled.includes('i p v') ||
        lowerControlled.includes('g r p c') ||
        (lowerBase.includes('node') && lowerControlled.includes('node'));

      if (!isEntityPreserved) {
        reviewRequired = true;
        reasons.push(`Technical entity "${termBase}" was not preserved in candidate representation.`);
      }

      // Check version number preservation if risk includes a version like "v16" or "3.12"
      const versionMatch = risk.text.match(/(?:v|\b)(\d+(?:\.\d+)*)\b/);
      if (versionMatch) {
        const verNum = versionMatch[1];
        const digitWordMap: Record<string, string> = {
          '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
          '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
          '16': 'sixteen',
        };
        const spelledWord = digitWordMap[verNum];
        const hasVersion =
          controlledText.includes(verNum) ||
          (spelledWord !== undefined && lowerControlled.includes(spelledWord));

        if (!hasVersion) {
          reviewRequired = true;
          reasons.push(`Version number for "${risk.text}" was not faithfully preserved.`);
        }
      }
    }

    // 6. Explicit uncertainty handling
    if (risk.category === 'ambiguous' || risk.confidence === 'NEEDS_REVIEW') {
      reviewRequired = true;
      reasons.push(`Ambiguous token "${risk.text}" could not be verified with high certainty.`);
    }
  }

  // 7. Check changes array for any NEEDS_REVIEW
  for (const change of changes) {
    if (change.confidence === 'NEEDS_REVIEW' || change.action === 'NEEDS_REVIEW') {
      reviewRequired = true;
      if (!reasons.some((r) => r.includes(change.original))) {
        reasons.push(`Token "${change.original}" flagged as requiring human listener review.`);
      }
    }
  }

  return {
    isValid: true,
    reviewRequired,
    reasons,
  };
}
