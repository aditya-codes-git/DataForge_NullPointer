import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { SpeechSpecimen } from '@/components/landing/SpeechSpecimen';
import { ScenesStory } from '@/components/landing/ScenesStory';
import { DetectionStatement } from '@/components/landing/DetectionStatement';
import { InteractiveSentence } from '@/components/landing/InteractiveSentence';
import { DeveloperSection } from '@/components/landing/DeveloperSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export function Landing() {
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
