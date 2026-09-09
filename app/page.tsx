import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { SpeechSpecimen } from '@/components/landing/SpeechSpecimen';
import { ScenesStory } from '@/components/landing/ScenesStory';
import { DetectionStatement } from '@/components/landing/DetectionStatement';
import { InteractiveSentence } from '@/components/landing/InteractiveSentence';
import { DeveloperSection } from '@/components/landing/DeveloperSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'SaySure — Voice Delivery & Pronunciation QA for Production TTS',
  description:
    'SaySure tests how pronunciation-sensitive text actually sounds through your TTS voice. Text can be correct and still sound wrong.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-950 selection:text-white">
      <Navbar />
      <Hero />
      <SpeechSpecimen />
      <ScenesStory />
      <DetectionStatement />
      <InteractiveSentence />
      <DeveloperSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
