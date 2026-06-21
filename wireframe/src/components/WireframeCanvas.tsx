import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArchitectureSection, WireframeSettings } from '../types';
import {
  Maximize2,
  Play,
  ArrowRight,
  Eye,
  Info,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';

interface WireframeCanvasProps {
  sections: ArchitectureSection[];
  settings: WireframeSettings;
  selectedSection: ArchitectureSection | null;
  onSelectSection: (section: ArchitectureSection) => void;
}

export const WireframeCanvas: React.FC<WireframeCanvasProps> = ({
  sections,
  settings,
  selectedSection,
  onSelectSection
}) => {
  const {
    viewport,
    theme,
    showGridLines,
    showPaddingInlay,
    showTypographyBadges,
    showLayoutRationale,
    interactiveInspecting
  } = settings;

  const isGeometric = theme === 'geometric';
  const isChampagne = theme === 'champagne';
  const [activePortfolioFilter, setActivePortfolioFilter] = useState<'all' | 'private' | 'brand' | 'corporate'>('all');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Style helper based on current visual profile theme
  const containerBg = isGeometric ? 'bg-slate-50' : isChampagne ? 'bg-[#121211]' : 'bg-[#0b0e14]';
  const borderColor = isGeometric ? 'border-slate-200' : isChampagne ? 'border-stone-800' : 'border-slate-800';
  const textPrimary = isGeometric ? 'text-slate-900' : isChampagne ? 'text-stone-100' : 'text-slate-100';
  const textSecondary = isGeometric ? 'text-slate-500' : isChampagne ? 'text-stone-400' : 'text-slate-400';
  const cardBg = isGeometric ? 'bg-slate-100/50 border border-slate-200/80 shadow-inner' : isChampagne ? 'bg-[#1c1c1b]' : 'bg-[#111622]';
  const highlightColor = isGeometric ? 'text-slate-900 font-bold' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400';
  const highlightBg = isGeometric ? 'bg-slate-900/10' : isChampagne ? 'bg-[#cba87c]/10' : 'bg-blue-500/10';
  const indicatorBorder = isGeometric ? 'border-slate-900' : isChampagne ? 'border-[#cba87c]' : 'border-blue-500';

  // Sizing based on viewport selection
  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[400px] border-x';
      case 'tablet':
        return 'max-w-[768px] border-x';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  // Star ratings for Luxury Event testimonials
  const testimonials = [
    {
      quote: "The Atelier shaped a space that felt deeply sacred and personal. Every corner carried poetic weight.",
      client: "Contessa Isabelle de Valois",
      event: "Palazzo Launch, Florence"
    },
    {
      quote: "A sublime merger of high-technology spatial engineering and bespoke editorial romance. Perfect choreography.",
      client: "Director of Brand LVMH",
      event: "Global High-Jewelry Launch"
    },
    {
      quote: "Absolute discretion and perfect physical orchestration. Echelon does not plan events; they compose monuments.",
      client: "Nolan Sterling VII",
      event: "Sloane Estate Wedding, London"
    }
  ];

  const handleNextNote = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };
  const handlePrevNote = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Traditional crossed-box illustration for wireframe graphics
  const WireframePlaceholder: React.FC<{ label: string; heightClass?: string; ratioText?: string }> = ({
    label,
    heightClass = 'h-64',
    ratioText = '16:9'
  }) => {
    return (
      <div className={`relative w-full ${heightClass} ${
        isGeometric
          ? 'bg-slate-100 border-slate-200 text-slate-350'
          : isChampagne
          ? 'bg-[#171716] text-[#cba87c]/30'
          : 'bg-[#131924] text-slate-700'
      } rounded border overflow-hidden flex flex-col items-center justify-center`}>
        {/* Wireframe Diagonal Cross lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>

        {/* Labels */}
        <div className={`z-10 px-3 py-1.5 rounded text-center backdrop-blur-sm border space-y-1 ${
          isGeometric ? 'bg-white/90 border-slate-205' : 'bg-black/60 border-white/5'
        }`}>
          <span className={`font-mono text-[10px] uppercase font-semibold tracking-widest ${
            isGeometric ? 'text-slate-900' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'
          }`}>
            {label}
          </span>
          <span className={`block text-[8px] font-mono ${isGeometric ? 'text-slate-500' : 'text-stone-500'}`}>
            MEDIA ASSET AREA ({ratioText})
          </span>
        </div>
      </div>
    );
  };

  // Typography overlay generator helpers
  const TypoBadge: React.FC<{ spec: string }> = ({ spec }) => {
    if (!showTypographyBadges) return null;
    return (
      <span className="inline-flex items-center gap-1 absolute top-0 left-0 -translate-y-4 bg-purple-900/90 text-purple-200 border border-purple-800 text-[8px] font-mono px-1.5 py-0.5 rounded shadow z-50 pointer-events-none">
        {spec}
      </span>
    );
  };

  const PaddingInlay: React.FC<{ label: string; position: 'top' | 'bottom' | 'both' }> = ({ label, position }) => {
    if (!showPaddingInlay) return null;
    return (
      <div className="pointer-events-none absolute left-0 right-0 z-40 select-none">
        {(position === 'top' || position === 'both') && (
          <div className="top-0 left-0 right-0 h-8 bg-red-500/10 border-y border-red-500/20 flex items-center justify-center">
            <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">
              Spacer Zone: {label}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Rendering individual section contents
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <div className="w-full flex items-center justify-between py-4 px-6 md:px-12 relative">
            <TypoBadge spec="h2: font-sans tracking-[0.3em]" />

            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full ${isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'} animate-pulse`} />
              <span className={`font-sans tracking-[0.35em] text-sm uppercase font-semibold text-white`}>
                ECHELON <span className="font-light text-stone-500 text-xs tracking-normal font-serif lowercase italic mr-1">atelier</span>
              </span>
            </div>

            {/* Middle Nav Links */}
            {viewport !== 'mobile' ? (
              <div className="flex items-center gap-8 font-mono text-[10px] tracking-widest text-[#a8a29e] uppercase font-medium">
                <a href="#portfolio" className={`hover:${highlightColor} transition-colors duration-300`}>Portfolio</a>
                <a href="#services" className={`hover:${highlightColor} transition-colors duration-300`}>Services</a>
                <a href="#process" className={`hover:${highlightColor} transition-colors duration-300`}>Process</a>
                <a href="#testimonials" className={`hover:${highlightColor} transition-colors duration-300`}>Reflections</a>
                <a href="#footer" className={`hover:${highlightColor} transition-colors duration-300`}>Enquiry</a>
              </div>
            ) : null}

            {/* Right Action Button */}
            <div className="flex items-center gap-3">
              {viewport === 'mobile' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className={`p-1.5 rounded border ${borderColor} text-white hover:${highlightColor}`}
                >
                  <Menu className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="#footer"
                  className={`px-4 py-1.5 border rounded-full font-mono text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 ${
                    isChampagne
                      ? 'border-[#cba87c]/30 text-[#cba87c] hover:bg-[#cba87c] hover:text-[#121211]'
                      : 'border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-[#0b0e14]'
                  }`}
                >
                  Inquire Now
                </a>
              )}
            </div>

            {/* Mobile Expanded menu mockup */}
            <AnimatePresence>
              {viewport === 'mobile' && mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 right-0 border-b p-6 ${cardBg} ${borderColor} z-50 shadow-2xl flex flex-col gap-4 text-xs font-mono tracking-widest text-stone-400 uppercase`}
                >
                  <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className={`py-1.5 hover:${highlightColor}`}>Portfolio</a>
                  <a href="#services" onClick={() => setMobileMenuOpen(false)} className={`py-1.5 hover:${highlightColor}`}>Services</a>
                  <a href="#process" onClick={() => setMobileMenuOpen(false)} className={`py-1.5 hover:${highlightColor}`}>Process</a>
                  <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className={`py-1.5 hover:${highlightColor}`}>Reflections</a>
                  <a href="#footer" onClick={() => setMobileMenuOpen(false)} className={`py-2 text-center text-white font-bold bg-[#cba87c]/20 rounded`}>Book Enquiry</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'hero':
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12 px-6 md:px-12 relative min-h-[500px]">
            <TypoBadge spec="h1: font-serif text-5xl md:text-7xl leading-tight" />

            {/* Left Content column */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-px ${isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'}`} />
                  <span className="font-mono text-[10px] text-stone-500 tracking-[0.25em] uppercase font-semibold">
                    ECHELON ATELIER EST. 2024
                  </span>
                </div>
                <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-tight leading-[1.1] relative`}>
                  We shape moments <br />
                  <span className="italic font-light text-[#ece6df]/85">that resonate</span> <br />
                  in perpetuity.
                </h1>
              </div>

              <p className="text-stone-400 font-sans text-xs sm:text-sm max-w-md leading-relaxed">
                A premium design agency orchestrating high-concept event blueprint architectures, boutique luxury productions, and bespoke hospitality systems globally.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#portfolio"
                  className={`px-5 py-2.5 rounded text-xs tracking-widest font-mono uppercase bg-white text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-2 font-semibold`}
                >
                  Explore Occasions <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#footer"
                  className={`px-5 py-2.5 rounded text-xs tracking-widest font-mono uppercase border ${borderColor} text-white hover:bg-white/5 transition-colors`}
                >
                  Curate Proposal
                </a>
              </div>

              {/* Status metrics bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/50 max-w-sm">
                <div>
                  <span className="block font-mono text-[10px] text-stone-500 uppercase tracking-widest">METRIC_A</span>
                  <span className="text-xs text-white font-semibold tracking-tight font-serif">12+ Cities</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-stone-500 uppercase tracking-widest">METRIC_B</span>
                  <span className="text-xs text-white font-semibold tracking-tight font-serif">Aura Build No. VII</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-stone-500 uppercase tracking-widest">METRIC_C</span>
                  <span className="text-xs text-white font-semibold tracking-tight font-serif">Private Access Only</span>
                </div>
              </div>
            </div>

            {/* Right Picture visual placeholder: asymmetric shape */}
            <div className="md:col-span-5 relative">
              <WireframePlaceholder label="Cinematic Cover Visual" heightClass="h-96 md:h-[420px]" ratioText="11:15 vertical aspect" />
            </div>
          </div>
        );

      case 'showreel':
        return (
          <div className="relative py-12 px-6 md:px-12 flex flex-col items-center justify-center">
            <TypoBadge spec="caption: font-mono text-stone-400 tracking-widest" />
            <div className="w-full max-w-5xl rounded border border-stone-800/80 relative overflow-hidden group">
              <WireframePlaceholder label="Dynamic Cinema Reel Window" heightClass="h-64 sm:h-80 md:h-96" ratioText="16:9 full-width preview" />

              {/* Overlay elements like duration indicator or specs */}
              <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[9px] ${textSecondary} px-3 py-1.5 bg-black/70 backdrop-blur-md rounded border border-white/5`}>
                <div className="flex items-center gap-2">
                  <Play className={`w-3 h-3 ${highlightColor} fill-current`} />
                  <span>PREVIEW_REEL_001.MP4</span>
                </div>
                <div>SEC: 02:44 / SIZE: 44.5MB</div>
              </div>
            </div>
          </div>
        );

      case 'intro':
        return (
          <div className="py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 relative">
            <TypoBadge spec="blockquote: font-serif text-3xl italic font-light hover:text-white" />
            <div className="md:col-span-3 hidden md:block border-r border-[#cba87c]/10 pr-6">
              <span className={`font-mono text-[10px] ${highlightColor} tracking-[0.25em] block mb-2`}>
                THE ATELIER PHILOSOPHY
              </span>
              <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                Refining spatial details to match pure conceptual dreams. A sanctuary of uncompromising execution standards.
              </p>
            </div>
            <div className="md:col-span-9 flex flex-col justify-center">
              <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-light text-stone-200 leading-relaxed italic">
                 &ldquo;A bespoke layout blueprint is not merely decoration. It is the rhythmic staging of spatial tension and fluid human encounters, elevated with quiet Champagne Noir precision.&rdquo;
              </h2>
              <span className="font-mono text-[10px] text-stone-500 tracking-widest uppercase mt-4 block">
                — ECHELON DIRECTIVE SECTOR IX
              </span>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="py-12 px-6 md:px-12 space-y-8 relative">
            <TypoBadge spec="grid: gap-0 / border-fused grid" />
            <div className="flex flex-col gap-2">
              <span className={`font-mono text-[10px] tracking-widest uppercase ${highlightColor}`}>
                OUR SPECIFIC EXPERTIZE
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-light">
                Bespoke Event Capabilities
              </h2>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border ${borderColor} rounded-lg overflow-hidden`}>
              {/* Card 1 */}
              <div className={`p-6 border-b sm:border-r ${borderColor} flex flex-col justify-between min-h-[300px] hover:bg-stone-900/40 transition-colors`}>
                <div className="space-y-4">
                  <span className="font-mono text-stone-500 text-xs tracking-wider block">PROD_01</span>
                  <h3 className="font-serif text-lg text-white font-normal">Luxury Galas & Dinners</h3>
                  <p className="text-stone-400 text-xs font-sans leading-relaxed">
                    Symphonic culinary spatial blueprints, tablescapes paired with high-concept custom lighting, and bespoke ambient acoustic programming.
                  </p>
                </div>
                <ul className="text-[10px] font-mono text-stone-500 space-y-1.5 pt-6 border-t border-stone-800/40">
                  <li>• Dynamic Spatial Flow Maps</li>
                  <li>• Table Geometry Rendering</li>
                  <li>• Lighting Hue Orchestration</li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className={`p-6 border-b lg:border-r ${borderColor} flex flex-col justify-between min-h-[300px] hover:bg-stone-900/40 transition-colors`}>
                <div className="space-y-4">
                  <span className="font-mono text-stone-500 text-xs tracking-wider block">PROD_02</span>
                  <h3 className="font-serif text-lg text-white font-normal">High-Impact Brand Launches</h3>
                  <p className="text-stone-400 text-xs font-sans leading-relaxed">
                    Sculptural product visual displays, high-end content-creator experience framing, immersive luxury brand storytelling.
                  </p>
                </div>
                <ul className="text-[10px] font-mono text-stone-500 space-y-1.5 pt-6 border-t border-stone-800/40">
                  <li>• Absolute Brand Silhouette Frame</li>
                  <li>• Projection Map Alignment</li>
                  <li>• Custom Acoustic Soundscapes</li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className={`p-6 border-b sm:border-r ${borderColor} flex flex-col justify-between min-h-[300px] hover:bg-stone-900/40 transition-colors`}>
                <div className="space-y-4">
                  <span className="font-mono text-stone-500 text-xs tracking-wider block">PROD_03</span>
                  <h3 className="font-serif text-lg text-white font-normal">Immersive Productions</h3>
                  <p className="text-stone-400 text-xs font-sans leading-relaxed">
                     Complex technical set designs, kinetic stage structures, multi-sensory interactive components, and digital system staging.
                  </p>
                </div>
                <ul className="text-[10px] font-mono text-stone-500 space-y-1.5 pt-6 border-t border-stone-800/40">
                  <li>• CAD Stage Dimension Specs</li>
                  <li>• Kinetic Truss Grid Matrix</li>
                  <li>• Real-Time Spatial Feed</li>
                </ul>
              </div>

              {/* Card 4 */}
              <div className="p-6 flex flex-col justify-between min-h-[300px] hover:bg-stone-900/40 transition-colors">
                <div className="space-y-4">
                  <span className="font-mono text-stone-500 text-xs tracking-wider block">PROD_04</span>
                  <h3 className="font-serif text-lg text-white font-normal">Bespoke Retreats</h3>
                  <p className="text-stone-400 text-xs font-sans leading-relaxed">
                    Intimate private property sourcing, executive wellness and strategy workshop integration, custom transport logistics and details.
                  </p>
                </div>
                <ul className="text-[10px] font-mono text-stone-500 space-y-1.5 pt-6 border-t border-stone-800/40">
                  <li>• Drone Site Boundary Scanning</li>
                  <li>• High-Security Sourcing Routes</li>
                  <li>• Micro-Curation Concierge</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="py-12 px-6 md:px-12 space-y-8 relative">
            <TypoBadge spec="columns: staggered layout / asymmetric frames" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-2">
                <span className={`font-mono text-[10px] tracking-widest uppercase ${highlightColor}`}>
                   SELECTED OCCASIONS CATALOGUE
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-white font-light">
                  Architectural Portfolios
                </h2>
              </div>

              {/* Filter Tabs layout */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-widest uppercase">
                {['all', 'private', 'brand', 'corporate'].map((f) => (
                  <button
                    key={f}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePortfolioFilter(f as any);
                    }}
                    className={`px-3 py-1.5 rounded transition-all ${
                      activePortfolioFilter === f
                        ? `${highlightBg} ${highlightColor} font-semibold`
                        : `${textSecondary} hover:text-white`
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Asymmetrical Layout view column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Col-1 */}
              <div className="space-y-12">
                <div className={`p-4 rounded-xl border ${borderColor} hover:border-[#cba87c]/30 transition-all cursor-crosshair group`}>
                  <WireframePlaceholder label="The Dunes Retreat - 2024" heightClass="h-80" ratioText="4:5 vertical portfolio template" />
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#cba87c] tracking-widest uppercase">SAHARA / MOROCCO</span>
                      <h3 className="font-serif text-lg text-white font-light mt-1">Dunes Sanctuary Pavilion</h3>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 border border-stone-800 rounded px-2 py-0.5">CASE_089</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${borderColor} hover:border-[#cba87c]/30 transition-all cursor-crosshair group md:translate-y-6`}>
                  <WireframePlaceholder label="The Sloane Gala - 2025" heightClass="h-64" ratioText="16:10 wide showcase" />
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#cba87c] tracking-widest uppercase">LONDON / UNITED KINGDOM</span>
                      <h3 className="font-serif text-lg text-white font-light mt-1">Sloane Glass Atrium Gala</h3>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 border border-stone-800 rounded px-2 py-0.5">CASE_102</span>
                  </div>
                </div>
              </div>

              {/* Col-2 */}
              <div className="space-y-12 md:pt-16">
                <div className={`p-4 rounded-xl border ${borderColor} hover:border-[#cba87c]/30 transition-all cursor-crosshair group`}>
                  <WireframePlaceholder label="Palazzo Launch - 2025" heightClass="h-64" ratioText="16:9 widescreen showcase" />
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#cba87c] tracking-widest uppercase">FLORENCE / ITALY</span>
                      <h3 className="font-serif text-lg text-white font-light mt-1">Palazzo Vecchio Jewel Show</h3>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 border border-stone-800 rounded px-2 py-0.5">CASE_110</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${borderColor} hover:border-[#cba87c]/30 transition-all cursor-crosshair group md:translate-y-6`}>
                  <WireframePlaceholder label="Sotheby’s Private Dinner - 2026" heightClass="h-80" ratioText="3:4 fine portrait" />
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#cba87c] tracking-widest uppercase">MILAN / ITALY</span>
                      <h3 className="font-serif text-lg text-white font-light mt-1">Ateliers Milan Private Suite</h3>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 border border-stone-800 rounded px-2 py-0.5">CASE_124</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="py-12 px-6 md:px-12 space-y-8 relative">
            <TypoBadge spec="stepper: sequential grid 4-span layout" />
            <div className="space-y-2">
              <span className={`font-mono text-[10px] tracking-widest uppercase ${highlightColor}`}>
                 CHOREOGRAPHED TIMELINE
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-light">
                The Curatorial Journey
              </h2>
            </div>

            {/* Interactive Timeline Stepper */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 relative">
              {/* Connector horizontal axis lines inside grid on tablet/desktop */}
              {viewport !== 'mobile' && (
                <div className="absolute top-[34px] left-8 right-8 h-[1px] bg-stone-800 pointer-events-none" />
              )}

              {/* Step 1 */}
              <div className="relative group p-4 border border-stone-800/40 rounded bg-stone-950/20">
                <div className="flex items-center gap-3 mb-4 z-10 relative">
                  <span className={`font-mono text-xs w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${isChampagne ? 'border-[#cba87c]/50 bg-stone-900 text-[#cba87c]' : 'border-blue-500 bg-slate-900 text-blue-400'}`}>
                    01
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 tracking-wider">PHASE_ONE</span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-white tracking-tight">Vision Discovery</h3>
                <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                  Deep qualitative analysis of our premium clients design values, mood boarding, and atmospheric goals.
                </p>
                <div className="mt-3 text-[10px] text-stone-500 font-mono italic">
                  Metrics: 14 Business Days
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group p-4 border border-stone-800/40 rounded bg-stone-950/20">
                <div className="flex items-center gap-3 mb-4 z-10 relative">
                  <span className={`font-mono text-xs w-9 h-9 rounded-full flex items-center justify-center font-bold border ${borderColor} text-stone-500 bg-stone-900`}>
                    02
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 tracking-wider">PHASE_TWO</span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-white tracking-tight">Spatial Blueprinting</h3>
                <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                  Constructing responsive CAD physical space arrangements, camera view templates, and acoustic vector matrices.
                </p>
                <div className="mt-3 text-[10px] text-stone-500 font-mono italic">
                  Metrics: CAD Blueprint Output
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group p-4 border border-stone-800/40 rounded bg-stone-950/20">
                <div className="flex items-center gap-3 mb-4 z-10 relative">
                  <span className={`font-mono text-xs w-9 h-9 rounded-full flex items-center justify-center font-bold border ${borderColor} text-stone-500 bg-stone-900`}>
                    03
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 tracking-wider">PHASE_THREE</span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-white tracking-tight">Atelier Fabrication</h3>
                <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                  Discreet sourcing, technical fabrication rehearsal of kinetic lighting vectors, and material curation.
                </p>
                <div className="mt-3 text-[10px] text-stone-500 font-mono italic">
                  Metrics: Material Checklists
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative group p-4 border border-stone-800/40 rounded bg-stone-950/20">
                <div className="flex items-center gap-3 mb-4 z-10 relative">
                  <span className={`font-mono text-xs w-9 h-9 rounded-full flex items-center justify-center font-bold border ${borderColor} text-stone-500 bg-stone-900`}>
                    04
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 tracking-wider">PHASE_FOUR</span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-white tracking-tight">Live Orchestration</h3>
                <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                  Atmospheric deployment and real-time live performance oversight, ensuring flawless runtime flow under strict constraints.
                </p>
                <div className="mt-3 text-[10px] text-stone-500 font-mono italic">
                  Metrics: Real-time Live Log
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        const note = testimonials[activeTestimonialIdx];
        return (
          <div className="py-16 px-6 md:px-12 relative flex flex-col items-center">
            <TypoBadge spec="testimonials: flex column centered block" />
            <div className="w-full max-w-3xl text-center space-y-6 relative py-4">
              <span className="text-5xl font-serif text-[#cba87c]/30 italic pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 select-none font-light">
                &ldquo;
              </span>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-light leading-relaxed italic z-10 relative">
                &ldquo;{note.quote}&rdquo;
              </h2>

              <div className="flex flex-col gap-1 inline-block">
                <span className={`font-sans text-xs font-semibold uppercase tracking-widest ${highlightColor}`}>
                  {note.client}
                </span>
                <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                  {note.event}
                </span>
              </div>

              {/* Switch ticks buttons */}
              <div className="flex justify-center items-center gap-6 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevNote();
                  }}
                  className={`p-1.5 rounded-full border ${borderColor} hover:${highlightColor} hover:bg-stone-900 transition-all text-white`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activeTestimonialIdx === i
                          ? `${highlightBg} ${highlightColor} ring-1 ${indicatorBorder}`
                          : 'bg-stone-700'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextNote();
                  }}
                  className={`p-1.5 rounded-full border ${borderColor} hover:${highlightColor} hover:bg-stone-900 transition-all text-white`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-12 px-6 md:px-12 relative">
            <TypoBadge spec="footer: dual asymmetric grid column blocks" />

            {/* Left Content column: Social Maps and legal */}
            <div className="md:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className={`font-sans uppercase tracking-[0.3em] font-semibold text-white`}>
                  ECHELON <span className="font-serif lowercase italic text-[#cba87c]">atelier</span>
                </span>
                <p className="text-stone-400 text-xs sm:text-sm font-sans leading-relaxed max-w-sm">
                  Whether booking a brand showcase in Milan or an expansive dune retreat in Morocco, our curation architects are standing by to execute your spatial vision.
                </p>
              </div>

              {/* Coordinates List */}
              <div className="space-y-2 text-[11px] font-mono text-stone-500">
                <div className="flex justify-between border-b border-stone-900 pb-1.5">
                  <span>OFFICE ARCHIVE</span>
                  <span className="text-white">MILAN / LONDON / PARIS</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-1.5">
                  <span>MAIN EMAIL</span>
                  <span className={`text-white hover:${highlightColor} cursor-pointer`}>inquiries@echelon.aura</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-1.5">
                  <span>TELEMETRY SECURE</span>
                  <span className="text-white">+39 02 4492 10</span>
                </div>
              </div>

              {/* Copy links */}
              <div className="pt-4 flex flex-wrap gap-4 text-[10px] font-mono text-stone-605">
                <a href="#portfolio" className="hover:text-white transition-colors">© {new Date().getFullYear()} ECHELON</a>
                <a href="#portfolio" className="hover:text-white transition-colors">PRIVACY CODE</a>
                <a href="#portfolio" className="hover:text-white transition-colors font-semibold text-[#cba87c]">CRAFT BY AURA.BUILD</a>
              </div>
            </div>

            {/* Right Contact Form blueprint */}
            <div className={`md:col-span-7 p-6 border ${borderColor} rounded-xl ${cardBg} space-y-6`}>
              <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">PROP_CONSULTATION_FORM</span>
                <span className={`font-mono text-[9px] ${highlightColor} uppercase tracking-widest`}>SECURE CONNECTOR</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">01. FULL CLIENT NAME</label>
                  <input
                    type="text"
                    disabled
                    placeholder="e.g. Nolan Sterling"
                    className={`w-full px-3 py-2 text-xs text-stone-300 font-semibold bg-black/40 border ${borderColor} rounded focus:outline-none`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">02. CLIENT EMAIL ADDRESS</label>
                  <input
                    type="text"
                    disabled
                    placeholder="e.g. sterling@ateliers.lux"
                    className={`w-full px-3 py-2 text-xs text-stone-300 font-semibold bg-black/40 border ${borderColor} rounded focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">03. DESIRED DESTINATION</label>
                  <select
                    disabled
                    className={`w-full px-3 py-2 text-xs text-stone-400 bg-black/40 border ${borderColor} rounded focus:outline-none`}
                  >
                    <option>Florence, Italy</option>
                    <option>Marrakesh, Morocco</option>
                    <option>London, United Kingdom</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">04. ESTIMATED SPACE BUDGET</label>
                  <select
                    disabled
                    className={`w-full px-3 py-2 text-xs text-stone-400 bg-black/40 border ${borderColor} rounded focus:outline-none`}
                  >
                    <option>Premium Private ($50k - $150k)</option>
                    <option>Luxury Custom ($150k - $500k)</option>
                    <option>Monumental Elite ($500k+)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">05. ATMOSPHERIC GOALS SUMMARY</label>
                <textarea
                  disabled
                  rows={2}
                  placeholder="Tell us about the emotional blueprint, lighting priorities, and target attendees..."
                  className={`w-full px-3 py-2 text-xs text-stone-300 bg-black/40 border ${borderColor} rounded focus:outline-none resize-none`}
                />
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-not-allowed ${
                  isChampagne
                    ? 'bg-[#cba87c] text-stone-900 border border-[#cba87c]'
                    : 'bg-blue-500 text-stone-950 border border-blue-500'
                }`}
              >
                Inquire Proposal <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full flex justify-center py-8 px-4 ${containerBg} relative overflow-hidden transition-colors duration-300`}>
      {/* Absolute grid system lines overlay background */}
      {showGridLines && (
        <div className="absolute inset-0 grid grid-cols-12 max-w-[1200px] mx-auto pointer-events-none h-full z-0 px-6 opacity-30 select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-full border-r border-dashed ${
                isGeometric ? 'border-slate-900/5' : isChampagne ? 'border-[#cba87c]/10' : 'border-blue-500/10'
              } flex items-start justify-end pr-1 pt-2`}
            >
              <span className={`font-mono text-[8px] opacity-40 ${isGeometric ? 'text-slate-450' : 'text-stone-750'}`}>C{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wireframe Canvas Device wrap */}
      <div
        className={`w-full transition-all duration-300 relative shadow-2xl overflow-hidden rounded-md border ${borderColor} ${getViewportWidth()} ${
          isGeometric ? 'bg-white' : 'bg-black/30'
        } z-10`}
      >
        {/* Device indicator top strip */}
        <div className={`p-2 border-b flex justify-between items-center select-none ${borderColor} ${
          isGeometric ? 'bg-slate-105 bg-slate-100 text-slate-800' : isChampagne ? 'bg-[#1b1b1a]' : 'bg-[#111520]'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-widest flex items-center gap-1 ${isGeometric ? 'text-slate-500' : 'text-stone-500'}`}>
            {viewport === 'desktop' && <Laptop className="w-3 h-3 text-stone-500" />}
            {viewport === 'tablet' && <Tablet className="w-3 h-3 text-stone-500" />}
            {viewport === 'mobile' && <Smartphone className="w-3 h-3 text-stone-500" />}
            {viewport.toUpperCase()}_VIEWPORT — ECHELON_STAGING
          </span>
          <div className={`font-mono text-[8px] ${isGeometric ? 'text-slate-500' : 'text-stone-500'}`}>
            {viewport === 'desktop' && '1200px Grid'}
            {viewport === 'tablet' && '768px Grid'}
            {viewport === 'mobile' && '380px Grid'}
          </div>
        </div>

        {/* Dynamic Mapping Over Landing Page Sections */}
        <div className={`divide-y ${isGeometric ? 'divide-slate-200' : 'divide-stone-850'}`}>
          {sections.map((section, idx) => {
            const isInspected = selectedSection?.id === section.id;
            return (
              <div
                key={section.id}
                onClick={() => onSelectSection(section)}
                className={`group relative transition-all duration-300 ${
                  interactiveInspecting
                    ? 'cursor-pointer'
                    : ''
                } ${
                  isInspected
                    ? isGeometric
                      ? 'ring-2 ring-slate-900 scale-[0.99] bg-slate-50'
                      : isChampagne
                      ? 'ring-2 ring-[#cba87c] scale-[0.99] bg-[#1a1918]'
                      : 'ring-2 ring-blue-500 scale-[0.99] bg-[#111726]'
                    : isGeometric
                    ? 'hover:bg-slate-50'
                    : 'hover:bg-white/[0.015]'
                }`}
                style={{ scrollMarginTop: '100px' }}
                id={`wireframe-sec-${section.id}`}
              >
                {/* Visual Height / Section Dimension taggers overlay on hover */}
                {interactiveInspecting && (
                  <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-mono text-[8px] rounded px-1.5 py-0.5 bg-black text-stone-200 border ${borderColor} flex items-center gap-1.5`}>
                    <Maximize2 className="w-2.5 h-2.5 text-stone-400" />
                    <span>SEC_{section.num}</span>
                    <span className={highlightColor}>({section.heightEstimate})</span>
                  </div>
                )}

                {/* Padding inlay visualization overlays */}
                <PaddingInlay label={`${section.id.toUpperCase()}_SPACING`} position="both" />

                {/* Section layout logic explanation tags when enabled */}
                {showLayoutRationale && (
                  <div className="absolute top-2 left-2 z-40 bg-stone-900/90 text-stone-300 border border-stone-700/60 font-sans text-[10px] px-2 py-1 rounded max-w-xs shadow-lg backdrop-blur flex items-start gap-1.5 pointer-events-none select-none">
                    <Info className={`w-3 h-3 mt-0.5 shrink-0 ${highlightColor}`} />
                    <div className="space-y-0.5">
                      <strong className="block font-mono text-[9px] uppercase tracking-wide text-white">
                        {section.shortTitle} Architecture
                      </strong>
                      <p className="text-[9px] leading-tight text-stone-450">{section.rationale.substring(0, 75)}...</p>
                    </div>
                  </div>
                )}

                {/* Render corresponding wireframe element block */}
                <div className="py-2.5 relative z-10">
                  {renderSectionContent(section.id)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
