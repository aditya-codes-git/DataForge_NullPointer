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
