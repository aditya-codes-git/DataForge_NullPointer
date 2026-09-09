import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HeroPipeline } from '@/components/landing/HeroPipeline';
import { ProductDemo } from '@/components/landing/ProductDemo';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { ComparisonDemo } from '@/components/landing/ComparisonDemo';
import { DetectionVsCorrection } from '@/components/landing/DetectionVsCorrection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PronunciationSection } from '@/components/landing/PronunciationSection';
import { RimeSection } from '@/components/landing/RimeSection';
import { DeveloperSection } from '@/components/landing/DeveloperSection';
import { Architecture } from '@/components/landing/Architecture';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'SaySure — Voice Delivery & Pronunciation QA for Production TTS',
  description:
    'SaySure tests pronunciation-sensitive text against your actual TTS voice, compares candidate representations, and helps you choose what listeners should hear.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
      <HeroPipeline />
      <ProductDemo />
      <ProblemSection />
      <ComparisonDemo />
      <DetectionVsCorrection />
      <HowItWorks />
      <PronunciationSection />
      <RimeSection />
      <DeveloperSection />
      <Architecture />
      <CTA />
      <Footer />
    </main>
  );
}
