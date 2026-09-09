import { describe, it, expect } from 'vitest';
import { analyzeSpeechRisks } from '../lib/risk-detector';
import { detectIdentifiers } from '../lib/risk-rules/identifiers';
import { detectCurrency } from '../lib/risk-rules/currency';
import { detectNumbers } from '../lib/risk-rules/numbers';
import { detectAcronyms } from '../lib/risk-rules/acronyms';
import { detectDomainTerms } from '../lib/risk-rules/domain-terms';
import { detectAmbiguousTerms } from '../lib/risk-rules/ambiguous';

describe('Speech Risk Detection Engine', () => {
  describe('Identifiers Detector', () => {
    it('detects alphanumeric verification codes like A12B9X7', () => {
      const risks = detectIdentifiers('Your code is A12B9X7.');
      expect(risks).toHaveLength(1);
      expect(risks[0].text).toBe('A12B9X7');
      expect(risks[0].category).toBe('identifier');
      expect(risks[0].severity).toBe('high');
    });

    it('detects hyphenated reference numbers like INV-2024-9X', () => {
      const risks = detectIdentifiers('Reference INV-2024-9X has been paid.');
      expect(risks.some(r => r.text === 'INV-2024-9X')).toBe(true);
    });

    it('does not falsely detect standard units like 100m or 50kg', () => {
      const risks = detectIdentifiers('Run 100m and lift 50kg.');
      expect(risks).toHaveLength(0);
    });
  });

  describe('Currency Detector', () => {
    it('detects Indian Rupee amounts with lakh commas: ₹1,25,000', () => {
      const risks = detectCurrency('Total is ₹1,25,000.');
      expect(risks).toHaveLength(1);
      expect(risks[0].text).toBe('₹1,25,000');
      expect(risks[0].category).toBe('currency');
      expect(risks[0].ruleMatched).toBe('INDIAN_CURRENCY_GROUPING');
    });

    it('detects international currencies like $4,500.50', () => {
      const risks = detectCurrency('Fee: $4,500.50 due now.');
      expect(risks).toHaveLength(1);
      expect(risks[0].text).toBe('$4,500.50');
    });
  });

  describe('Acronym & Status Code Detector', () => {
    it('detects HTTP status codes like HTTP 429', () => {
      const risks = detectAcronyms('Error HTTP 429 received.');
      expect(risks).toHaveLength(1);
      expect(risks[0].text).toBe('HTTP 429');
      expect(risks[0].category).toBe('acronym');
    });

    it('detects standalone acronyms like AWS and JSON', () => {
      const risks = detectAcronyms('Deployed on AWS with JSON payloads.');
      expect(risks.map(r => r.text)).toContain('AWS');
      expect(risks.map(r => r.text)).toContain('JSON');
    });
  });

  describe('Domain Terms Detector', () => {
    it('detects technical domain terms like Kubernetes and PostgreSQL', () => {
      const risks = detectDomainTerms('Kubernetes clusters running PostgreSQL.');
      expect(risks.map(r => r.text)).toContain('Kubernetes');
      expect(risks.map(r => r.text)).toContain('PostgreSQL');
    });
  });

  describe('Ambiguous Term Detector', () => {
    it('flags uncommon or unverified tokens like XyloQ with NEEDS_REVIEW', () => {
      const risks = detectAmbiguousTerms('Product XyloQ has arrived.');
      expect(risks).toHaveLength(1);
      expect(risks[0].text).toBe('XyloQ');
      expect(risks[0].confidence).toBe('NEEDS_REVIEW');
    });
  });

  describe('End-to-End Orchestrated Analyzer', () => {
    it('Case 1: correctly identifies identifier and Indian currency simultaneously', () => {
      const text = 'Your verification code is A12B9X7 and your total is ₹1,25,000.';
      const risks = analyzeSpeechRisks(text);
      expect(risks.length).toBeGreaterThanOrEqual(2);
      expect(risks.map(r => r.text)).toContain('A12B9X7');
      expect(risks.map(r => r.text)).toContain('₹1,25,000');
    });

    it('Case 2: correctly identifies HTTP 429 and Kubernetes', () => {
      const text = 'HTTP 429 occurred while connecting to Kubernetes.';
      const risks = analyzeSpeechRisks(text);
      expect(risks.map(r => r.text)).toContain('HTTP 429');
      expect(risks.map(r => r.text)).toContain('Kubernetes');
    });

    it('Case 3: does not falsely identify risks on plain speech', () => {
      const text = 'Hello, how are you today?';
      const risks = analyzeSpeechRisks(text);
      expect(risks).toHaveLength(0);
    });
  });
});
