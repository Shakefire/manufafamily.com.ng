import React, { useState } from 'react';
import { ECHELON_SECTIONS } from './data/wireframeData';
import { WireframeSettings, ArchitectureSection } from './types';
import { NavigationStudio } from './components/NavigationStudio';
import { WireframeCanvas } from './components/WireframeCanvas';
import { InspectorSidebar } from './components/InspectorSidebar';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Setup standard visual applet states
  const [settings, setSettings] = useState<WireframeSettings>({
    viewport: 'desktop',
    theme: 'geometric',
    showGridLines: true,
    showPaddingInlay: false,
    showTypographyBadges: false,
    showLayoutRationale: true,
    interactiveInspecting: true
  });

  const [selectedSection, setSelectedSection] = useState<ArchitectureSection | null>(
    ECHELON_SECTIONS[0] // Default to header to explain the navigation first!
  );

  const handleUpdateSettings = (newSettings: Partial<WireframeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectSection = (section: ArchitectureSection) => {
    setSelectedSection(section);
  };

  const handleSelectSectionById = (sectionId: string) => {
    const section = ECHELON_SECTIONS.find((s) => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
      const element = document.getElementById(`wireframe-sec-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const { theme } = settings;
  const isGeometric = theme === 'geometric';
  const isChampagne = theme === 'champagne';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isGeometric
          ? 'bg-brand-white text-brand-black font-sans'
          : isChampagne
          ? 'bg-[#0f0f0e] text-stone-100'
          : 'bg-[#07090e] text-slate-100'
      }`}
    >
      {/* Top Workspace Header Bar */}
      <header
        className={`px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isGeometric
            ? 'border-brand-grey/20 bg-brand-white/95 text-brand-black'
            : isChampagne
            ? 'border-stone-900 bg-[#141413]/80 text-stone-100'
            : 'border-slate-900 bg-[#0a0c12]/80 text-slate-100'
        } backdrop-blur`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${
              isGeometric
                ? 'bg-brand-orange text-white'
                : isChampagne
                ? 'bg-[#cba87c]/15 text-[#cba87c]'
                : 'bg-blue-500/15 text-blue-400'
            }`}
          >
            E
          </div>
          <div>
            <h1 className="font-sans text-base font-bold tracking-tight leading-tight">
              Echelon Atelier Layout Studio
            </h1>
            <span className={`block text-[9px] font-mono uppercase tracking-widest leading-none mt-0.5 ${
              isGeometric ? 'text-brand-grey' : 'text-stone-500'
            }`}>
              interactive wireframe & spatial navigator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className={`flex items-center gap-1.5 font-mono text-[10px] ${
            isGeometric ? 'text-brand-grey' : 'text-stone-500'
          }`}>
            <Compass className={`w-3.5 h-3.5 animate-spin-slow ${
              isGeometric ? 'text-brand-orange' : 'text-stone-400'
            }`} />
            <span>STAGING: LOCAL_RUN</span>
          </div>
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded font-mono text-[10px] ${
            isGeometric
              ? 'bg-brand-light border border-brand-grey/30 text-brand-orange'
              : isChampagne
              ? 'bg-[#cba87c]/5 border border-[#cba87c]/10 text-[#cba87c]'
              : 'bg-blue-500/5 border border-blue-500/10 text-blue-400'
          }`}>
            <Sparkles className="w-3 h-3" />
            <span>{isGeometric ? 'CORE ORANGE BRAND' : isChampagne ? 'CHAMPAGNE NOIR' : 'DRAFT BLUEPRINT'}</span>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace container: Split Screen layout */}
      <div className="flex-1 lg:flex items-stretch overflow-hidden">
        {/* Left Space: Configuration Panel + Responsive Viewer Stage */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* IFrame Note Alert indicator to inform client and guidelines */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
            isGeometric
              ? 'bg-brand-light border-brand-grey/25 text-brand-black'
              : isChampagne
              ? 'bg-[#1a140f] border-[#cba87c]/20 text-stone-300'
              : 'bg-[#0f1521] border-blue-900/30 text-slate-300'
          }`}>
            <AlertCircle className={`w-[14px] h-[14px] shrink-0 mt-0.5 ${
              isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'
            }`} />
            <div>
              <p className={`font-semibold ${isGeometric ? 'text-brand-black font-bold' : 'text-white'}`}>Interactive Engineering Preview</p>
              <p className={`text-[11px] mt-0.5 ${isGeometric ? 'text-brand-grey' : 'text-stone-400'}`}>
                The content below is an interactive functional reconstruction demonstrating the exact site layout, spatial dimensions, and custom grid sections of <strong className={isGeometric ? 'text-brand-orange font-bold' : 'text-[#ece6df]'}>echelon.aura.build</strong>. Click on any block to explore section-level editorial code rules, micro-interactions, and visual spacing guidelines.
              </p>
            </div>
          </div>

          {/* Settings and philosophy studio */}
          <NavigationStudio
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            sections={ECHELON_SECTIONS}
            selectedSection={selectedSection}
            onSelectSection={handleSelectSection}
          />

          {/* Staging Canvas area rendering the interactive Echelon Landing Page wireframe */}
          <div className="space-y-4">
            <span className={`font-mono text-[10px] tracking-wider block uppercase ${
              isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-500'
            }`}>
              INTERACTIVE RECONSTRUCTED WIREFRAME CANVAS (CLICK TO INSPECT)
            </span>
            <WireframeCanvas
              sections={ECHELON_SECTIONS}
              settings={settings}
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
            />
          </div>
        </main>

        {/* Right Space: Detailed Inspections Sidebar with absolute scrolling */}
        <aside className={`w-full lg:w-[380px] shrink-0 border-t lg:border-t-0 border-l lg:h-auto overflow-y-auto select-none ${
          isGeometric ? 'border-brand-grey/25 bg-brand-white' : 'border-slate-900'
        }`}>
          <InspectorSidebar
            selectedSection={selectedSection}
            onClose={() => setSelectedSection(null)}
            theme={settings.theme}
            onSelectSection={handleSelectSectionById}
            sections={ECHELON_SECTIONS}
          />
        </aside>
      </div>

      {/* Humble footer */}
      <footer
        className={`p-4 border-t text-center text-xs font-mono shadow-sm ${
          isGeometric
            ? 'border-brand-grey/20 bg-brand-light text-brand-grey'
            : isChampagne
            ? 'border-stone-900 bg-[#121211] text-stone-500'
            : 'border-slate-900 bg-[#090b10] text-stone-500'
        }`}
      >
        <span>ECHELON LUXURY TEMPLATE ATELIER WIREFRAME &bull; DESIGN STRUCTURE DEMO &bull; 2026.06.07</span>
      </footer>
    </div>
  );
}
