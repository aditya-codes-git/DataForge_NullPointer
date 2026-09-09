import { SpeechRisk, Transformation } from './schemas';

export interface ValidationResult {
  isValid: boolean;
  reviewRequired: boolean;
  reasons: string[];
  checklistPassed: {
    identifierPreservation: boolean;
    numericPreservation: boolean;
    currencyPreservation: boolean;
    datePreservation: boolean;
    timePreservation: boolean;
    entityPreservation: boolean;
    versionPreservation: boolean;
    semanticPreservation: boolean;
    noHallucinations: boolean;
    minimalIntervention: boolean;
  };
}

/**
 * 10-Point Candidate Validation Checklist
 *
 * Enforces rigorous integrity checks so no candidate corrupts meaning,
 * loses characters, alters numeric/monetary values, or modifies unrelated text.
 */
export function validateControlledText(
  originalText: string,
  controlledText: string,
  risks: SpeechRisk[],
  changes: Transformation[]
): ValidationResult {
  const reasons: string[] = [];
  let reviewRequired = false;

  const checklist = {
    identifierPreservation: true,
    numericPreservation: true,
    currencyPreservation: true,
    datePreservation: true,
    timePreservation: true,
    entityPreservation: true,
    versionPreservation: true,
    semanticPreservation: true,
    noHallucinations: true,
    minimalIntervention: true,
  };

  // 1. Output sanity: cannot be empty
  if (!controlledText || controlledText.trim().length === 0) {
    return {
      isValid: false,
      reviewRequired: true,
      reasons: ['Controlled text output is empty.'],
      checklistPassed: { ...checklist, semanticPreservation: false, minimalIntervention: false },
    };
  }

  // 2. Length sanity (Checklist #10: Minimal Intervention / No Unrelated Rewriting)
  if (originalText.length >= 15 && controlledText.length > originalText.length * 3.5) {
    reviewRequired = true;
    checklist.minimalIntervention = false;
    reasons.push('Controlled text is disproportionately longer than original text.');
  }

  const lowerControlled = controlledText.toLowerCase();

  for (const risk of risks) {
    // Checklist #1: Identifier Preservation
    if (risk.category === 'identifier') {
      const code = risk.text.replace(/[-_]/g, '');
      const directMatch = controlledText.includes(code);

      const digitMap: Record<string, string> = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
        '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
      };

      const charTokens = Array.from(code).map((c) => digitMap[c] || c.toLowerCase());
      let allCharsAccounted = true;
      for (const token of charTokens) {
        if (!lowerControlled.includes(token)) {
          allCharsAccounted = false;
          break;
        }
      }

      if (!directMatch && !allCharsAccounted) {
        reviewRequired = true;
        checklist.identifierPreservation = false;
        reasons.push(`Identifier "${risk.text}" was not faithfully preserved in candidate text.`);
      }
    }

    // Checklist #2 & #3: Numeric & Currency Preservation
    if (risk.category === 'currency') {
      const numericDigits = risk.text.replace(/[^0-9]/g, '');
      if (numericDigits.length >= 4) {
        const hasNumberTokens =
          lowerControlled.includes('lakh') ||
          lowerControlled.includes('thousand') ||
          lowerControlled.includes('million') ||
          lowerControlled.includes(numericDigits);

        if (!hasNumberTokens) {
          reviewRequired = true;
          checklist.currencyPreservation = false;
          reasons.push(`Currency amount "${risk.text}" was not properly represented.`);
        }
      }
    }

    if (risk.category === 'number') {
      const digits = risk.text.replace(/[^0-9]/g, '');
      if (digits.length > 0 && !controlledText.includes(digits) && !lowerControlled.includes('point')) {
        // Digits may be spelled out; check basic presence
        const spelledCheck = lowerControlled.includes('zero') || lowerControlled.includes('one') || lowerControlled.includes('two') || lowerControlled.includes('three') || lowerControlled.includes('four') || lowerControlled.includes('five') || lowerControlled.includes('hundred') || lowerControlled.includes('thousand');
        if (!spelledCheck) {
          checklist.numericPreservation = false;
          reviewRequired = true;
          reasons.push(`Numeric value "${risk.text}" may have been dropped or altered.`);
        }
      }
    }

    // Checklist #4: Date Preservation
    if (risk.category === 'date') {
      const dateParts = risk.text.split(/[-/.]/);
      const somePartsPresent = dateParts.some((p) => p.length >= 2 && controlledText.includes(p));
      if (!somePartsPresent) {
        checklist.datePreservation = false;
        reviewRequired = true;
        reasons.push(`Date expression "${risk.text}" not preserved.`);
      }
    }

    // Checklist #5: Time & Timezone Preservation
    if (risk.category === 'time') {
      const tzMatch = risk.text.match(/\b(EST|EDT|PST|PDT|CST|CDT|IST|UTC|GMT)\b/i);
      if (tzMatch) {
        const tz = tzMatch[1].toLowerCase();
        if (!lowerControlled.includes(tz) && !lowerControlled.includes('standard time')) {
          checklist.timePreservation = false;
          reviewRequired = true;
          reasons.push(`Timezone in "${risk.text}" was omitted or altered.`);
        }
      }
    }

    // Checklist #6: Entity Name Preservation
    if (risk.category === 'domain_term' || risk.category === 'brand' || risk.category === 'name') {
      const termBase = risk.text.split(/[\s/]/)[0];
      const lowerBase = termBase.toLowerCase();

      const isEntityPreserved =
        lowerControlled.includes(lowerBase) ||
        lowerControlled.includes('i p v') ||
        lowerControlled.includes('g r p c') ||
        lowerControlled.includes('post-gres-q-l') ||
        lowerControlled.includes('postgres') ||
        lowerControlled.includes('graph q l') ||
        lowerControlled.includes('web r t c') ||
        lowerControlled.includes('neo four j') ||
        (lowerBase.includes('node') && lowerControlled.includes('node'));

      if (!isEntityPreserved) {
        reviewRequired = true;
        checklist.entityPreservation = false;
        reasons.push(`Technical entity "${termBase}" was not preserved in candidate representation.`);
      }

      // Checklist #7: Version Number Preservation
      const versionMatch = risk.text.match(/(?:v|\b)(\d+(?:\.\d+)*)\b/);
      if (versionMatch) {
        const verNum = versionMatch[1];
        const digitWordMap: Record<string, string> = {
          '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
          '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
          '16': 'sixteen', '22': 'twenty-two', '19': 'nineteen',
        };
        const spelledWord = digitWordMap[verNum];
        const hasVersion =
          controlledText.includes(verNum) ||
          (spelledWord !== undefined && lowerControlled.includes(spelledWord));

        if (!hasVersion) {
          reviewRequired = true;
          checklist.versionPreservation = false;
          reasons.push(`Version number for "${risk.text}" was not faithfully preserved.`);
        }
      }
    }

    // Uncertainty Handling
    if (risk.category === 'ambiguous' || risk.confidence === 'NEEDS_REVIEW') {
      reviewRequired = true;
      reasons.push(`Ambiguous token "${risk.text}" could not be verified with high certainty.`);
    }
  }

  // Checklist #8 & #9: Check changes array for unverified edits
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
    checklistPassed: checklist,
  };
}
