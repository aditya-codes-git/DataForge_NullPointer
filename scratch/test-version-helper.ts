import { integerToWords, spellDigits } from '../src/lib/number-words';

export function formatVersionSpoken(verDigits: string): {
  digitByDigit: string;
  grouped: string;
  spokenForms: string[];
} {
  const cleanVer = verDigits.replace(/^v/i, '').trim();
  const segments = cleanVer.split('.');

  if (segments.length === 1) {
    const num = parseInt(segments[0], 10);
    const spoken = isNaN(num) ? segments[0] : integerToWords(num);
    return {
      digitByDigit: spoken,
      grouped: spoken,
      spokenForms: [spoken],
    };
  }

  const majorNum = parseInt(segments[0], 10);
  const majorSpoken = isNaN(majorNum) ? segments[0] : integerToWords(majorNum);

  // 1. Digit by digit reading for all decimal segments
  const digitParts = segments.slice(1).map((seg) => spellDigits(seg));
  const digitByDigit = `${majorSpoken} point ${digitParts.join(' point ')}`;

  // 2. Grouped / whole-number reading for decimal segments
  const groupParts = segments.slice(1).map((seg) => {
    if (seg.startsWith('0') && seg.length > 1) {
      // e.g. "04" -> "zero four" or "o four"
      return spellDigits(seg);
    }
    const n = parseInt(seg, 10);
    return isNaN(n) ? seg : integerToWords(n);
  });
  const grouped = `${majorSpoken} point ${groupParts.join(' point ')}`;

  const formsSet = new Set<string>([digitByDigit, grouped]);

  // If there is a leading zero in minor segment (like 24.04), also add "o four" variant
  if (segments.length === 2 && segments[1].startsWith('0') && segments[1].length === 2) {
    const secondDigitWord = spellDigits(segments[1].slice(1));
    formsSet.add(`${majorSpoken} point o ${secondDigitWord}`);
  }

  return {
    digitByDigit,
    grouped,
    spokenForms: Array.from(formsSet),
  };
}

export function recoverVersionFromText(text: string, verDigits: string): boolean {
  const cleanVer = verDigits.replace(/^v/i, '').trim();
  const lowerText = text.toLowerCase();

  // 1. Literal digits present
  if (lowerText.includes(cleanVer) || lowerText.includes(`v${cleanVer}`)) {
    return true;
  }

  // 2. Spoken form present
  const { spokenForms } = formatVersionSpoken(cleanVer);
  for (const form of spokenForms) {
    const lowerForm = form.toLowerCase();
    // Direct match
    if (lowerText.includes(lowerForm)) {
      return true;
    }
    // Also match without hyphens (e.g. "twenty four" vs "twenty-four")
    const dehyphenatedForm = lowerForm.replace(/-/g, ' ');
    const dehyphenatedText = lowerText.replace(/-/g, ' ');
    if (dehyphenatedText.includes(dehyphenatedForm)) {
      return true;
    }
  }

  return false;
}

// Test cases
const testVers = ['16', '1.34', '1.34.7', '3.12', '12.6', '24.04', '22', '19', '5.6'];
for (const v of testVers) {
  const spoken = formatVersionSpoken(v);
  console.log(`Version "${v}":`);
  console.log(`  digitByDigit: "${spoken.digitByDigit}"`);
  console.log(`  grouped:      "${spoken.grouped}"`);
  console.log(`  spokenForms:  `, spoken.spokenForms);
  console.log(`  recovered from "${spoken.digitByDigit}":`, recoverVersionFromText(spoken.digitByDigit, v));
  console.log(`  recovered from "${spoken.grouped}":`, recoverVersionFromText(spoken.grouped, v));
  console.log(`  recovered from bad "version one thirty-four":`, recoverVersionFromText('version one thirty-four', v));
}
