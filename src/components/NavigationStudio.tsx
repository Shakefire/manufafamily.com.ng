'use client';

import React, { useState } from 'react';
import { WireframeSettings, ThemeMode, ViewportMode, ArchitectureSection } from '../types';
import {
  Sliders,
  Eye,
  Settings,
  Grid,
  Type,
  BookOpen,
  MousePointerClick,
  Monitor,
  Tablet,
  Smartphone,
  ChevronRight,
  BookMarked,
  Code,
  Sparkles,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

interface NavigationStudioProps {
  settings: WireframeSettings;
  onUpdateSettings: (settings: Partial<WireframeSettings>) => void;
  sections: ArchitectureSection[];
  selectedSection: ArchitectureSection | null;
  onSelectSection: (section: ArchitectureSection) => void;
}

export const NavigationStudio: React.FC<NavigationStudioProps> = ({
  settings,
  onUpdateSettings,
  sections,
  selectedSection,
  onSelectSection
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'architecture' | 'code'>('blueprint');

  const {
    viewport,
    theme,
    showGridLines,
    showPaddingInlay,
    showTypographyBadges,
    showLayoutRationale,
    interactiveInspecting
  } = settings;

  const handleDeviceChange = (view: ViewportMode) => {
    onUpdateSettings({ viewport: view });
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    onUpdateSettings({ theme: newTheme });
  };

  const isGeometric = theme === 'geometric';
  const isChampagne = theme === 'champagne';
  
  const highlightColor = isGeometric ? 'text-brand-orange font-bold' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400';
  const highlightBg = isGeometric ? 'bg-brand-orange/10' : isChampagne ? 'bg-[#cba87c]/10' : 'bg-blue-500/10';
  const borderColor = isGeometric ? 'border-brand-grey/25' : isChampagne ? 'border-stone-800' : 'border-slate-800';

  // Code snippets for template styling
  const tailwindConfigSnippet = isGeometric ? `// tailwind.config.js - Echelon Core Orange Brand configuration (Tailwind v4 theme layout)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B00', // Core Orange CTA / Primary Accent
          black: '#1A1A1A',  // Deep Black Key Titles / Main Body Text
          grey: '#777777',   // Subtle Grey / Sub-Headers / Borders
          header: '#333333', // Header Grey / Deep Contrast Backgrounds
          light: '#F5F7FA',  // Light Section Grey UI Cards / Alternates
          white: '#FFFFFF'   // Base White Page Background
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  }
}` : `// tailwind.config.js - High-End Champagne Noir Configuration
module.exports = {
  theme: {
    extend: {
      colors: {
        basalt: {
          900: '#121211', // Deep editorial charcoal
          800: '#1b1b1a', // Staggered cards backdrop
          700: '#2b2b29', // Hairstyle borders
        },
        champagne: {
          500: '#cba87c', // Primary glowing metallic
          600: '#a38155', // Muted text overlay
          100: '#ece6df', // Text titles white-silk
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  }
}`;

  const stickyHeaderSnippet = isGeometric ? `// React / Tailwind Core brand Orange header integration
export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-20 bg-brand-white border-b border-brand-grey/20 px-10 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-orange text-white rounded flex items-center justify-center font-mono font-bold text-sm">E</div>
        <span className="font-bold tracking-tighter text-xl text-brand-black">ECHELON // AURA</span>
      </div>
      <nav className="flex gap-8 font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-grey">
        <a href="#portfolio" className="text-brand-orange border-b-2 border-brand-orange py-6">01. Universe</a>
        <a href="#services" className="hover:text-brand-black transition-colors">02. Chronicles</a>
        <a href="#process" className="hover:text-brand-black transition-colors">03. Portal</a>
      </nav>
      <button className="px-5 py-2 bg-brand-orange text-white text-[10px] uppercase font-bold tracking-widest hover:bg-brand-black transition-colors">
        Launch App
      </button>
    </header>
  );
};` : `// React / Tailwind Sticky Header with BackDrop Blur
export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-basalt-900/60 backdrop-blur-md border-b border-basalt-700/40 px-12 flex justify-between items-center">
      <div className="font-sans tracking-[0.3em] font-semibold text-white uppercase text-sm">
        ECHELON <span className="font-serif lowercase italic text-champagne-500">atelier</span>
      </div>
      <nav className="flex gap-8 font-mono text-[10px] tracking-widest text-stone-400 uppercase">
        <a href="#portfolio" className="hover:text-champagne-500 transition-colors">Portfolio</a>
        <a href="#services" className="hover:text-champagne-500 transition-colors">Services</a>
        <a href="#process" className="hover:text-champagne-500 transition-colors">Process</a>
      </nav>
      <button className="px-4 py-1.5 border border-champagne-500/30 text-champagne-500 rounded-full font-mono text-[9px] uppercase tracking-widest">
        Inquire Now
      </button>
    </header>
  );
};`;

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 ${
        isGeometric
          ? 'bg-brand-white border-brand-grey/25 text-brand-black shadow-sm'
          : isChampagne
          ? 'bg-[#181817] border-stone-800 text-stone-300'
          : 'bg-[#121824] border-slate-800 text-slate-300'
      }`}
    >
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b ${
        isGeometric ? 'border-brand-grey/15' : 'border-stone-800/60'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono tracking-wider ${
                isGeometric
                  ? 'bg-brand-orange text-white font-semibold'
                  : isChampagne
                  ? 'bg-[#cba87c]/10 text-[#cba87c] border border-[#cba87c]/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}
            >
              LAYOUT BLUEPRINT LABS
            </span>
            <span className={`text-[10px] font-mono ${isGeometric ? 'text-brand-grey' : 'text-stone-500'}`}>EST_ECL_90</span>
          </div>
          <h1 className={`font-serif text-2xl md:text-3xl font-normal mt-2 ${isGeometric ? 'text-brand-black font-sans font-bold tracking-tight' : 'text-white'}`}>
            Echelon Atelier Layout Studio
          </h1>
          <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed`}>
            Architectural wireframe visualizer for <a href="https://echelon.aura.build/" target="_blank" rel="noreferrer" className={`underline ${highlightColor} hover:${isGeometric ? 'text-brand-black' : 'text-white'}`}>echelon.aura.build</a>, focusing on landing page grid geometry, whitespace intervals, and main navigation hierarchy.
          </p>
        </div>

        {/* Viewport switch controls */}
        <div className={`flex p-1.5 rounded-lg border gap-1.5 ${isGeometric ? 'bg-brand-light border-brand-grey/20' : 'bg-black/40 border-stone-850'}`}>
          <button
            onClick={() => handleDeviceChange('desktop')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs transition-colors ${
              viewport === 'desktop'
                ? isGeometric
                  ? 'bg-brand-orange text-white font-semibold'
                  : isChampagne
                  ? 'bg-[#cba87c] text-stone-900 font-bold'
                  : 'bg-blue-500 text-slate-950 font-bold'
                : isGeometric
                ? 'text-brand-grey hover:text-brand-black'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Desktop 1200px Grid"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => handleDeviceChange('tablet')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs transition-colors ${
              viewport === 'tablet'
                ? isGeometric
                  ? 'bg-brand-orange text-white font-semibold'
                  : isChampagne
                  ? 'bg-[#cba87c] text-stone-900 font-bold'
                  : 'bg-blue-500 text-slate-950 font-bold'
                : isGeometric
                ? 'text-brand-grey hover:text-brand-black'
                : 'text-stone-400 hover:text-white'
            }`}
             title="Tablet 768px Width"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => handleDeviceChange('mobile')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs transition-colors ${
              viewport === 'mobile'
                ? isGeometric
                  ? 'bg-brand-orange text-white font-semibold'
                  : isChampagne
                  ? 'bg-[#cba87c] text-stone-900 font-bold'
                  : 'bg-blue-500 text-slate-950 font-bold'
                : isGeometric
                ? 'text-brand-grey hover:text-brand-black'
                : 'text-stone-400 hover:text-white'
            }`}
             title="Mobile 400px Width"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className={`flex border-b mt-4 text-xs font-mono tracking-widest uppercase ${isGeometric ? 'border-brand-grey/25' : 'border-stone-850/60'}`}>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            activeTab === 'blueprint'
              ? isGeometric
                ? 'border-brand-orange text-brand-orange font-bold'
                : isChampagne
                ? 'border-[#cba87c] text-[#cba87c]'
                : 'border-blue-500 text-blue-400'
              : isGeometric
              ? 'border-transparent text-brand-grey hover:text-brand-black'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Settings Panel
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            activeTab === 'architecture'
              ? isGeometric
                ? 'border-brand-orange text-brand-orange font-bold'
                : isChampagne
                ? 'border-[#cba87c] text-[#cba87c]'
                : 'border-blue-500 text-blue-400'
              : isGeometric
              ? 'border-transparent text-brand-grey hover:text-brand-black'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          Layout Philosophy
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            activeTab === 'code'
              ? isGeometric
                ? 'border-brand-orange text-brand-orange font-bold'
                : isChampagne
                ? 'border-[#cba87c] text-[#cba87c]'
                : 'border-blue-500 text-blue-400'
              : isGeometric
              ? 'border-transparent text-brand-grey hover:text-brand-black'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Copy Specs / Code
        </button>
      </div>

      <div className="pt-6">
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Settings control */}
            <div className="lg:col-span-7 space-y-6">
              <span className={`font-mono text-[10px] tracking-wider block ${isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-500'}`}>
                TOGGLE BLUEPRINT GRAPHIC OVERLAYS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Show Grid Columns */}
                <div
                  onClick={() => onUpdateSettings({ showGridLines: !showGridLines })}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                    showGridLines
                      ? isGeometric
                        ? 'bg-brand-light border-brand-orange text-brand-black font-semibold shadow-sm'
                        : isChampagne 
                        ? 'bg-[#cba87c]/5 border-[#cba87c]' 
                        : 'bg-blue-500/5 border-blue-500'
                      : isGeometric
                      ? 'border-brand-grey/20 bg-brand-light/30 text-brand-grey hover:border-brand-grey/50'
                      : 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-4 h-4 text-brand-grey" />
                    <div>
                      <span className={`block text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Grid Guides Overlay</span>
                      <span className={`block text-[10px] ${isGeometric ? 'text-brand-grey' : 'text-stone-505'}`}>12-Column Alignment Guidelines</span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-0.5 ${
                      showGridLines
                        ? isGeometric
                          ? 'border-brand-orange'
                          : isChampagne 
                          ? 'border-[#cba87c]' 
                          : 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {showGridLines && <div className={`w-1.5 h-1.5 rounded-full ${isGeometric ? 'bg-brand-orange' : isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'}`} />}
                  </div>
                </div>

                {/* 2. Show Spatial Spacers */}
                <div
                  onClick={() => onUpdateSettings({ showPaddingInlay: !showPaddingInlay })}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                    showPaddingInlay
                      ? isGeometric
                        ? 'bg-brand-light border-brand-orange text-brand-black font-semibold shadow-sm'
                        : isChampagne 
                        ? 'bg-[#cba87c]/5 border-[#cba87c]' 
                        : 'bg-blue-500/5 border-blue-500'
                      : isGeometric
                      ? 'border-brand-grey/20 bg-brand-light/30 text-brand-grey hover:border-brand-grey/50'
                      : 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-brand-grey" />
                    <div>
                      <span className={`block text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Padding & Spacer Indicators</span>
                      <span className={`block text-[10px] ${isGeometric ? 'text-brand-grey' : 'text-stone-505'}`}>Highlights vertical margins</span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-0.5 ${
                      showPaddingInlay
                        ? isGeometric
                          ? 'border-brand-orange'
                          : isChampagne 
                          ? 'border-[#cba87c]' 
                          : 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {showPaddingInlay && <div className={`w-1.5 h-1.5 rounded-full ${isGeometric ? 'bg-brand-orange' : isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'}`} />}
                  </div>
                </div>

                {/* 3. Show Typography specifications labels */}
                <div
                  onClick={() => onUpdateSettings({ showTypographyBadges: !showTypographyBadges })}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                    showTypographyBadges
                      ? isGeometric
                        ? 'bg-brand-light border-brand-orange text-brand-black font-semibold shadow-sm'
                        : isChampagne 
                        ? 'bg-[#cba87c]/5 border-[#cba87c]' 
                        : 'bg-blue-500/5 border-blue-500'
                      : isGeometric
                      ? 'border-brand-grey/20 bg-brand-light/30 text-brand-grey hover:border-brand-grey/50'
                      : 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-4 h-4 text-brand-grey" />
                    <div>
                      <span className={`block text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Typography Tags</span>
                      <span className={`block text-[10px] ${isGeometric ? 'text-brand-grey' : 'text-stone-505'}`}>Identify font structures</span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-0.5 ${
                      showTypographyBadges
                        ? isGeometric
                          ? 'border-brand-orange'
                          : isChampagne 
                          ? 'border-[#cba87c]' 
                          : 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {showTypographyBadges && <div className={`w-1.5 h-1.5 rounded-full ${isGeometric ? 'bg-brand-orange' : isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'}`} />}
                  </div>
                </div>

                {/* 4. Show Rationale explanations */}
                <div
                  onClick={() => onUpdateSettings({ showLayoutRationale: !showLayoutRationale })}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                    showLayoutRationale
                      ? isGeometric
                        ? 'bg-brand-light border-brand-orange text-brand-black font-semibold shadow-sm'
                        : isChampagne 
                        ? 'bg-[#cba87c]/5 border-[#cba87c]' 
                        : 'bg-blue-500/5 border-blue-500'
                      : isGeometric
                      ? 'border-brand-grey/20 bg-brand-light/30 text-brand-grey hover:border-brand-grey/50'
                      : 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-brand-grey" />
                    <div>
                      <span className={`block text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Layout Rationale Flags</span>
                      <span className={`block text-[10px] ${isGeometric ? 'text-brand-grey' : 'text-stone-505'}`}>Show UX design purpose</span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-0.5 ${
                      showLayoutRationale
                        ? isGeometric
                          ? 'border-brand-orange'
                          : isChampagne 
                          ? 'border-[#cba87c]' 
                          : 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {showLayoutRationale && <div className={`w-1.5 h-1.5 rounded-full ${isGeometric ? 'bg-brand-orange' : isChampagne ? 'bg-[#cba87c]' : 'bg-blue-500'}`} />}
                  </div>
                </div>
              </div>

              {/* Theme selections */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isGeometric ? 'border-brand-grey/15' : 'border-stone-850/60'
              }`}>
                <div>
                  <span className={`block text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Wireframe Visual Theme</span>
                  <p className={`text-[10px] leading-relaxed ${isGeometric ? 'text-brand-grey' : 'text-stone-505'}`}>
                     Toggle between Blueprint, Champagne Noir, or modern Geometric Balance.
                  </p>
                </div>

                <div className={`flex p-1 border gap-1 rounded-lg ${
                  isGeometric ? 'bg-brand-light border-brand-grey/20' : 'bg-black/40 border-stone-800'
                }`}>
                  <button
                    onClick={() => handleThemeChange('geometric')}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      theme === 'geometric'
                        ? 'bg-brand-orange text-white font-semibold shadow-sm'
                        : isGeometric
                        ? 'text-brand-grey hover:text-brand-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Geometric Balance
                  </button>
                  <button
                    onClick={() => handleThemeChange('blueprint')}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      theme === 'blueprint'
                        ? 'bg-blue-405 text-white bg-blue-500/15 font-semibold'
                        : isGeometric
                        ? 'text-brand-grey hover:text-brand-black font-sans'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Draft Blueprint
                  </button>
                  <button
                    onClick={() => handleThemeChange('champagne')}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      theme === 'champagne'
                        ? 'bg-[#cba87c]/10 text-[#cba87c] font-semibold'
                        : isGeometric
                        ? 'text-brand-grey hover:text-brand-black font-sans'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                     Champagne Noir
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts / Quick Jump Bookmarks */}
            <div className="lg:col-span-5 space-y-4">
              <span className={`font-mono text-[10px] tracking-wider block ${isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-505'}`}>
                RAPID BLUEPRINT ANCHORS
              </span>

              <div
                className={`p-4 rounded-xl border ${
                  isGeometric
                    ? 'bg-brand-light border-brand-grey/25'
                    : isChampagne 
                    ? 'bg-[#1e1e1d] border-stone-800/80' 
                    : 'bg-[#181f2f] border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MousePointerClick className="w-4 h-4 text-brand-grey" />
                  <span className={`text-xs font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>Focus Frame Layout Jump</span>
                </div>
                <p className={`text-[10px] mb-4 leading-relaxed ${isGeometric ? 'text-brand-grey' : 'text-stone-450'}`}>
                   Select a specific layout coordinate block below to immediately focus details in the inspection segment.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        onSelectSection(sec);
                        // Trigger scrolling
                        const element = document.getElementById(`wireframe-sec-${sec.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`p-1.5 rounded text-left border ${borderColor} transition-colors truncate flex items-center gap-1.5 ${
                        selectedSection?.id === sec.id
                          ? isGeometric
                            ? 'bg-brand-orange text-white border-brand-orange font-bold'
                            : isChampagne
                            ? 'bg-[#cba87c]/10 border-[#cba87c] text-[#cba87c] font-semibold'
                            : 'bg-blue-500/10 border-blue-500 text-blue-400 font-semibold'
                          : isGeometric
                          ? 'text-brand-black font-semibold font-mono text-[10px] border-brand-grey/15 bg-brand-white hover:bg-brand-light'
                          : 'text-stone-400 font-mono text-[10px] hover:bg-stone-900/40'
                      }`}
                    >
                      <span>{sec.num}</span>
                      <span className="font-sans text-xs truncate">{sec.title.split(':')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${highlightColor}`} />
              <h2 className={`font-serif text-lg ${isGeometric ? 'text-brand-black font-sans font-bold' : 'text-white'}`}>
                {isGeometric ? 'Core Orange Brand Alignment Analysis' : 'Echelon’s Visual Grammar Analysis'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-md border ${borderColor} ${isGeometric ? 'bg-brand-light' : 'bg-black/10'} space-y-2`}>
                <h3 className={`font-sans font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 ${isGeometric ? 'text-brand-black' : 'text-stone-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full block ${isGeometric ? 'bg-brand-orange' : 'bg-[#cba87c]'}`} />
                   {isGeometric ? '1. Brand Orange Strategy' : '1. Dual-ToneBasalt Theme'}
                </h3>
                <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} text-xs leading-relaxed font-sans`}>
                  {isGeometric 
                    ? 'Provides clear user call-to-actions, highlight lines, and active elements colored in signature Core Orange (#FF6B00) set against Base White canvas.'
                    : 'The backdrop alternates between high gloss deep black (#121211) and slightly lighter container tiles to maintain structural separation.'}
                </p>
              </div>

              <div className={`p-4 rounded-md border ${borderColor} ${isGeometric ? 'bg-brand-light' : 'bg-black/10'} space-y-2`}>
                <h3 className={`font-sans font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 ${isGeometric ? 'text-brand-black' : 'text-stone-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full block ${isGeometric ? 'bg-brand-orange' : 'bg-[#cba87c]'}`} />
                  {isGeometric ? '2. Proportional Contrast' : '2. Asymmetric Pacing'}
                </h3>
                <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} text-xs leading-relaxed font-sans`}>
                  {isGeometric
                    ? 'Features stark Deep Black (#1A1A1A) typography for headliners, giving content clear reading weights and high contrast visibility.'
                    : 'Splits standard symmetric blocks to keep showcases active. Alternating 4:5 vertical proportions, widescreen 16:9 overlays, and empty margins.'}
                </p>
              </div>

              <div className={`p-4 rounded-md border ${borderColor} ${isGeometric ? 'bg-brand-light' : 'bg-black/10'} space-y-2`}>
                <h3 className={`font-sans font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 ${isGeometric ? 'text-brand-black' : 'text-stone-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full block ${isGeometric ? 'bg-brand-orange' : 'bg-[#cba87c]'}`} />
                  {isGeometric ? '3. Subtle Grid Wireframe' : '3. Typographic Contrasts'}
                </h3>
                <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} text-xs leading-relaxed font-sans`}>
                  {isGeometric
                    ? 'Arranges layout metrics within fine Subtle Grey (#777777) hairline guides and indicators for a deliberate structural feel.'
                    : 'The primary visual hierarchy leverages extremely light Serif fonts (Playfair Display) paired with monospaced (JetBrains Mono) index coordinate markers.'}
                </p>
              </div>
            </div>

            {/* Navigation specifically analysis */}
            <div className={`p-5 rounded-xl border ${borderColor} ${isGeometric ? 'bg-brand-light' : 'bg-black/30'} space-y-4`}>
              <h3 className={`text-sm flex items-center gap-2 ${isGeometric ? 'text-brand-black font-sans font-bold' : 'font-serif text-white'}`}>
                <Sliders className="w-4 h-4 text-brand-grey" />
                Main Navigation Architecture Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <strong className={isGeometric ? 'text-brand-black font-semibold' : 'text-stone-300'}>Universal Grid Portals</strong>
                  <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} font-sans leading-relaxed text-[11px]`}>
                     Maintains an elegant h-20 ceiling which splits branding, numbered indicators, and an action CTA. The layout locks seamlessly to protect visual negative space.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <strong className={isGeometric ? 'text-brand-black font-semibold' : 'text-stone-300'}>Asymmetry & Balance</strong>
                  <p className={`${isGeometric ? 'text-brand-grey' : 'text-stone-400'} font-sans leading-relaxed text-[11px]`}>
                     Uses active border underlines to denote current portal status, leaving 60% of the horizontal flow clear of structural items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Code className={`w-4 h-4 ${highlightColor}`} />
                <h2 className={`text-lg ${isGeometric ? 'text-brand-black font-bold font-sans' : 'font-serif text-white'}`}>Visual Layout Specifications</h2>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded ${isGeometric ? 'bg-brand-light text-brand-black font-semibold' : 'bg-stone-900 text-stone-500'}`}>
                TAILWIND_V4_READY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-slate-400">
              <div className="space-y-2">
                <span className={`text-[10px] block uppercase ${isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-500'}`}>1. Tailwind Color Configuration Snippet</span>
                <pre className={`p-4 rounded-lg overflow-x-auto text-[11px] leading-relaxed select-all custom-scrollbar ${
                  isGeometric ? 'bg-brand-header text-slate-100 border border-brand-black shadow-inner' : 'bg-[#0b0e14] border border-stone-850 text-white'
                }`}>
                  <code>{tailwindConfigSnippet}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <span className={`text-[10px] block uppercase ${isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-500'}`}>2. React Header Shell Implementation</span>
                <pre className={`p-4 rounded-lg overflow-x-auto text-[11px] leading-relaxed select-all custom-scrollbar ${
                  isGeometric ? 'bg-brand-header text-slate-100 border border-brand-black shadow-inner' : 'bg-[#0b0e14] border border-stone-850 text-white'
                }`}>
                  <code>{stickyHeaderSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
