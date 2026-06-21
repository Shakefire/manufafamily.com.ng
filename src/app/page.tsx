import React from 'react';
import { Header } from '../components/sections/Header';
import { Hero } from '../components/sections/Hero';
import { ScrollAnimation } from '../components/sections/ScrollAnimation';
import { Manifesto } from '../components/sections/Manifesto';
import { Services } from '../components/sections/Services';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Portfolio } from '../components/sections/Portfolio';
import { Process } from '../components/sections/Process';
import { Testimonials } from '../components/sections/Testimonials';
import { Footer } from '../components/sections/Footer';

export default function Home() {
  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1A1A1A] selection:bg-[#00A651] selection:text-white">
      <Header />
      
      <main>
        <Hero />
        <ScrollAnimation />
        <Manifesto />
        <Services />
        <HowItWorks />
        <Portfolio />
        <Process />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
