'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

const testimonials = [
  {
    quote: "Joining MANUFA has completely transformed my savings habits. The weekly structure keeps me disciplined, and the transparency of the leadership gives me absolute peace of mind.",
    client: "Sani Muhammad",
    org: "Savings Member",
    service: "Regular Savings",
  },
  {
    quote: "Being able to vote collectively on investment proposals is what makes this cooperative unique. It is a true community where everyone has a voice in strategic investments.",
    client: "Abbas Namadi Nasiru",
    org: "Chairman",
    service: "Collective Investments",
  },
  {
    quote: "The profit sharing distributions are prompt and transparent, calculated precisely based on our weekly contributions. Highly recommend to anyone seeking financial empowerment.",
    client: "Faruq Abubakar",
    org: "Secretary",
    service: "Wealth Creation",
  },
  {
    quote: "As a small business owner, having a disciplined savings structure was exactly what I needed. MANUFA helped me pool resources with trusted community members, and the returns on our collective investments have been steady and reliable. Wanda ala alheri ne.",
    client: "Salihu Adam & Saeed",
    org: "Business Partners",
    service: "Collective Investments",
  },
  {
    quote: "What drew me to MANUFA was the sharia-compliant approach to savings and investments. No riba, complete transparency, and every kobo is accounted for. The weekly meetings keep us connected and accountable to one another.",
    client: "Hassan Attahiru",
    org: "Compliance Officer",
    service: "Ethical Savings",
  },
  {
    quote: "I have been with MANUFA since the early days and watched it grow from a small circle of friends into a real community fund. The leadership listens to every member, and our contributions are working hard for us. Nagode sosai ga jagoranci.",
    client: "Isa Sale Isa",
    org: "Founding Member",
    service: "Community Growth",
  },
  {
    quote: "The emergency support from MANUFA when my family had a medical situation was beyond what I expected. Knowing that my savings are not locked away but accessible when life happens gives me real confidence in this system.",
    client: "Usman Muhammad",
    org: "Savings Member",
    service: "Emergency Savings",
  },
  {
    quote: "I used to struggle keeping consistent savings on my own. But the group accountability in MANUFA changed everything. Now I never miss a contribution, and the quarterly cashouts have helped me invest in my children's education.",
    client: "Abdurrashid N Nasiru",
    org: "Active Saver",
    service: "Education Fund",
  },
  {
    quote: "The beauty of MANUFA is that it is owned by us, the members. Every investment decision is put to a vote, and profits are shared according to what each person put in. That is true financial inclusion, wallahi.",
    client: "Abdallah A Musa",
    org: "Member Representative",
    service: "Democratic Finance",
  },
  {
    quote: "Coming from a background in agriculture, I was looking for a savings group that understands our seasonal income patterns. MANUFA allowed me to adjust my contributions during harvest and scale down in lean months. Very flexible and understanding.",
    client: "Aminu Abubakar",
    org: "Farmer Member",
    service: "Flexible Savings",
  },
  {
    quote: "MANUFA small small dey change my life. Before I no fit save anything, money just finish. Now with the weekly contribution and my people dey together, I see my money dey grow. Na God.",
    client: "Abota",
    org: "Regular Contributor",
    service: "Weekly Savings",
  }
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : dir < 0 ? -60 : 0,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : dir < 0 ? 60 : 0,
    opacity: 0
  })
};

export const Testimonials = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = (dir: number) => {
    setDirection(dir);
    setActiveIdx((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const next = () => navigate(1);
  const prev = () => navigate(-1);

  // Auto-play timer
  useEffect(() => {
    if (shouldReduceMotion) return;

    timerRef.current = setInterval(() => {
      navigate(1);
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIdx, shouldReduceMotion]);

  const note = testimonials[activeIdx];

  return (
    <section id="testimonials" className="py-32 md:py-40 px-6 md:px-12 relative bg-[#F5F7FA] border-b border-[#7F7F7F]/20 overflow-hidden">

      {/* Background large quote mark */}
      <div className="pointer-events-none select-none absolute -top-8 left-1/2 -translate-x-1/2 text-[18rem] font-serif text-[#00A651]/[0.04] leading-none italic">&ldquo;</div>

      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="text-center mb-14 space-y-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#00A651] font-semibold">
              MEMBER REFLECTIONS
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] font-light">
              Trusted by Members Across the Community
            </h2>
          </div>
        </RevealOnScroll>

        {/* Main testimonial card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#FFFFFF] border border-[#7F7F7F]/20 rounded-2xl p-10 md:p-16 shadow-sm overflow-hidden min-h-[380px] md:min-h-[340px] flex flex-col justify-between">

            {/* Quote icon */}
            <div className="w-12 h-12 rounded-full bg-[#00A651]/10 flex items-center justify-center mb-8 relative z-10">
              <Quote className="w-5 h-5 text-[#00A651]" strokeWidth={1.5} />
            </div>

            {/* Quote text and attribution wrapped with AnimatePresence */}
            <div className="relative flex-grow flex flex-col justify-between">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIdx}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col justify-between h-full w-full"
                >
                  <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-[#1A1A1A] font-light leading-relaxed italic mb-10">
                    &ldquo;{note.quote}&rdquo;
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-[#7F7F7F]/15">
                    <div>
                      <span className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">
                        {note.client}
                      </span>
                      <span className="block font-mono text-xs text-[#7F7F7F] uppercase tracking-widest mt-1 font-semibold">
                        {note.org}
                      </span>
                    </div>
                    <span className="inline-block font-mono text-[9px] uppercase tracking-widest font-semibold text-[#00A651] border border-[#00A651]/30 bg-[#00A651]/5 px-3 py-1.5 rounded-full self-start sm:self-auto">
                      {note.service}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex justify-between items-center mt-8 px-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="p-2 rounded-full border border-[#7F7F7F]/30 text-[#1A1A1A] hover:text-[#00A651] hover:border-[#00A651] bg-[#FFFFFF] transition-colors focus:outline-none"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {/* Dot indicators */}
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIdx ? 1 : -1);
                    setActiveIdx(i);
                  }}
                  className={`relative rounded-full overflow-hidden transition-all ${
                    activeIdx === i
                      ? 'w-6 h-1.5 bg-[#00A651]/20'
                      : 'w-1.5 h-1.5 bg-[#7F7F7F]/30 hover:bg-[#7F7F7F]/60'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  {activeIdx === i && !shouldReduceMotion && (
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-[#00A651] w-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 8, ease: 'linear' }}
                      style={{ originX: 0 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="p-2 rounded-full border border-[#7F7F7F]/30 text-[#1A1A1A] hover:text-[#00A651] hover:border-[#00A651] bg-[#FFFFFF] transition-colors focus:outline-none"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
};

