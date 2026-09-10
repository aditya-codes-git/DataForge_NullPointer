const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function integerToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + integerToWords(Math.abs(num));

  function convertChunk(n: number): string {
    let chunkStr = '';
    if (n >= 100) {
      chunkStr += ONES[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      chunkStr += TENS[Math.floor(n / 10)];
      if (n % 10 > 0) {
        chunkStr += '-' + ONES[n % 10];
      }
      chunkStr += ' ';
    } else if (n > 0) {
      chunkStr += ONES[n] + ' ';
    }
    return chunkStr.trim();
  }

  // Western scales
  const scales = ['', 'thousand', 'million', 'billion'];
  const chunks: string[] = [];
  let temp = num;
  let scaleIdx = 0;

  while (temp > 0 && scaleIdx < scales.length) {
    const chunk = temp % 1000;
    if (chunk > 0) {
      const chunkText = convertChunk(chunk);
      chunks.unshift(scales[scaleIdx] ? `${chunkText} ${scales[scaleIdx]}` : chunkText);
    }
    temp = Math.floor(temp / 1000);
    scaleIdx++;
  }

  return chunks.join(' ').trim();
}

export function indianNumberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + indianNumberToWords(Math.abs(num));

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${integerToWords(crore)} crore`);
  }
  if (lakh > 0) {
    parts.push(`${integerToWords(lakh)} lakh`);
  }
  if (thousand > 0) {
    parts.push(`${integerToWords(thousand)} thousand`);
  }
  if (hundred > 0) {
    parts.push(`${integerToWords(hundred)} hundred`);
  }
  if (remainder > 0) {
    parts.push(integerToWords(remainder));
  }

  return parts.join(' ').trim();
}

export function spellDigits(code: string): string {
  const digitWords: Record<string, string> = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
  };

  const tokens: string[] = [];
  for (const char of code) {
    if (char === '-' || char === '_') {
      continue;
    }
    if (/\d/.test(char)) {
      tokens.push(digitWords[char]);
    } else {
      tokens.push(char);
    }
  }

  return tokens.join(' ');
}

export interface SpokenVersionResult {
  digitByDigit: string;
  grouped: string;
  spokenForms: string[];
}

/**
 * Converts a version number string (e.g. "1.34", "16", "1.34.7", "24.04", "12.6")
 * into both digit-by-digit and grouped/cardinal spoken representations.
 */
export function formatVersionSpoken(verDigits: string): SpokenVersionResult {
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

  // 1. Digit-by-digit reading for decimal segments (e.g. "three four")
  const digitParts = segments.slice(1).map((seg) => spellDigits(seg));
  const digitByDigit = `${majorSpoken} point ${digitParts.join(' point ')}`;

  // 2. Grouped / whole-number reading for decimal segments (e.g. "thirty-four")
  const groupParts = segments.slice(1).map((seg) => {
    if (seg.startsWith('0') && seg.length > 1) {
      // e.g. "04" -> "zero four"
      return spellDigits(seg);
    }
    const n = parseInt(seg, 10);
    return isNaN(n) ? seg : integerToWords(n);
  });
  const grouped = `${majorSpoken} point ${groupParts.join(' point ')}`;

  const formsSet = new Set<string>([digitByDigit, grouped]);

  // If there is a leading zero in a two-digit minor segment (e.g. 24.04), also add "o four" variant
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

/**
 * Validates that an original version string is faithfully preserved in controlled text,
 * either in its raw digit form or in an approved spoken representation.
 */
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

