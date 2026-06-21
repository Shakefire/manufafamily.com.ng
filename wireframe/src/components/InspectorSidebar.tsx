import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArchitectureSection, ThemeMode } from '../types';
import {
  Sparkles,
  Columns,
  Type,
  BookOpen,
  Activity,
  Layers,
  Compass,
  CornerDownRight,
  X
} from 'lucide-react';

interface InspectorSidebarProps {
  selectedSection: ArchitectureSection | null;
  onClose: () => void;
  theme: ThemeMode;
  onSelectSection: (sectionId: string) => void;
  sections: ArchitectureSection[];
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  selectedSection,
  onClose,
  theme,
  onSelectSection,
  sections
}) => {
  const isGeometric = theme === 'geometric';
  const isChampagne = theme === 'champagne';

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-300 ${
        isGeometric
          ? 'bg-brand-white border-l border-brand-grey/25 text-brand-black shadow-lg shadow-black/5'
          : isChampagne
          ? 'bg-[#181817] border-l border-stone-800 text-stone-300'
          : 'bg-[#171c26] border-l border-slate-800 text-slate-300'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isGeometric
            ? 'border-brand-grey/20 bg-brand-light'
            : isChampagne 
            ? 'border-stone-800 bg-[#121211]' 
            : 'border-slate-800 bg-[#0f131a]'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedSection ? (
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs px-2 py-0.5 rounded ${
                  isGeometric
                    ? 'bg-brand-orange text-white font-bold'
                    : isChampagne
                    ? 'bg-[#cba87c]/10 text-[#d4af37]'
                    : 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
                }`}
              >
                {selectedSection.num}
              </span>
              <h2 className={`font-sans font-bold text-sm tracking-tight ${isGeometric ? 'text-brand-black' : 'text-white'}`}>
                Section Inspector
              </h2>
            </div>
          ) : (
            <div className={`flex items-center gap-2 ${isGeometric ? 'text-brand-black font-bold' : 'text-white'}`}>
              <Compass className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`} />
              <h2 className="font-sans font-bold text-sm tracking-tight">
                Architectural Index
              </h2>
            </div>
          )}
        </div>
        {selectedSection && (
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isGeometric 
                ? 'text-brand-grey hover:text-brand-black hover:bg-brand-light'
                : isChampagne 
                ? 'text-stone-400 hover:text-white hover:bg-stone-800' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedSection ? (
            <motion.div
              key={selectedSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              {/* Section Tagline */}
              <div>
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase ${
                    isGeometric ? 'text-brand-grey font-bold' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'
                  }`}
                >
                  Section Label: {selectedSection.id.toUpperCase()}
                </span>
                <h3 className={`text-xl font-medium tracking-tight mt-1 ${isGeometric ? 'font-sans font-bold text-brand-black' : 'font-serif text-white'}`}>
                  {selectedSection.title}
                </h3>
              </div>

              {/* Grid / Layout Spec */}
              <div
                className={`p-4 rounded-lg space-y-3 border ${
                  isGeometric
                    ? 'bg-brand-light/50 border-brand-grey/25'
                    : isChampagne
                    ? 'bg-[#21211f] border-stone-800/80'
                    : 'bg-[#1e2533] border-slate-850'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Columns
                    className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`}
                  />
                  <span className={`font-sans text-xs font-semibold uppercase tracking-wider ${isGeometric ? 'text-brand-black font-bold' : 'text-white'}`}>
                     Grid & Spatial Metrics
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className={`flex justify-between border-b pb-1.5 ${isGeometric ? 'border-brand-grey/15' : 'border-stone-800/60'}`}>
                    <span className="text-stone-500">Grid Template</span>
                    <span className={`text-right max-w-[180px] truncate ${isGeometric ? 'text-brand-black font-semibold' : 'text-white'}`}>
                      {selectedSection.gridSpec.columns}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1.5 ${isGeometric ? 'border-brand-grey/15' : 'border-stone-800/60'}`}>
                    <span className="text-stone-500">Grid Gap</span>
                    <span className={isGeometric ? 'text-brand-black font-semibold' : 'text-white'}>{selectedSection.gridSpec.gap}</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1.5 ${isGeometric ? 'border-brand-grey/15' : 'border-stone-800/60'}`}>
                    <span className="text-stone-500">Est. Target Height</span>
                    <span className={`font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>
                      {selectedSection.heightEstimate}
                    </span>
                  </div>
                  <div className={`pt-1 font-sans leading-relaxed ${isGeometric ? 'text-brand-grey' : 'text-stone-400'}`}>
                    <span className="text-stone-500 font-mono text-[10px] block mb-1">GRID PURPOSE</span>
                    {selectedSection.gridSpec.purpose}
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen
                    className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`}
                  />
                  <h4 className={`font-sans text-xs font-semibold uppercase tracking-wider ${isGeometric ? 'text-brand-black font-bold' : 'text-white'}`}>
                    Layout Psychology & Rationale
                  </h4>
                </div>
                <p className={`text-sm leading-relaxed ${isGeometric ? 'text-brand-grey' : 'text-stone-400'}`}>
                  {selectedSection.rationale}
                </p>
                <div
                  className={`mt-2 p-3 rounded text-xs italic ${
                    isGeometric
                      ? 'bg-brand-light border-l-2 border-brand-orange text-brand-black font-medium'
                      : isChampagne
                      ? 'bg-[#1c1c1b] border-l-2 border-[#cba87c] text-stone-400'
                      : 'bg-[#181d27] border-l-2 border-blue-500 text-slate-400'
                  }`}
                >
                  <strong className="not-italic block font-mono text-[10px] uppercase text-stone-500 mb-1">
                    Visual Accent Choice
                  </strong>
                  &ldquo;{selectedSection.keyAesthetic}&rdquo;
                </div>
              </div>

              {/* Typography Spec Blueprint */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`} />
                  <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isGeometric ? 'text-brand-black' : 'text-white'}`}>
                    Editorial Typography Specifications
                  </h4>
                </div>

                <div className="space-y-3">
                  {selectedSection.typography.map((typo, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md border text-xs space-y-1.5 ${
                        isGeometric
                          ? 'border-brand-grey/20 bg-brand-light/40'
                          : isChampagne 
                          ? 'border-stone-800 bg-[#1e2021]' 
                          : 'border-slate-805 bg-[#161a23]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${isGeometric ? 'text-brand-black' : 'text-white'}`}>{typo.element}</span>
                        <span className="font-mono text-[10px] text-stone-500">
                          {typo.fontFamily.split(' ')[0]}
                        </span>
                      </div>
                      <div className={`font-mono text-[10px] p-1.5 rounded ${isGeometric ? 'bg-brand-light text-brand-black border border-brand-grey/10 font-mono font-bold' : 'bg-black/30 text-stone-400'}`}>
                        {typo.className}
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-500">
                        <div>
                          <strong>Size:</strong> {typo.fontSize}
                        </div>
                        <div>
                          <strong>Weight:</strong> {typo.fontWeight}
                        </div>
                      </div>
                      <p className={`text-[11px] leading-relaxed pt-1 border-t ${isGeometric ? 'text-brand-grey border-brand-grey/10' : 'text-stone-400 border-stone-800/30'}`}>
                        {typo.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Behaviors */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity
                    className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`}
                  />
                  <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isGeometric ? 'text-brand-black' : 'text-white'}`}>
                    Micro-Interactions & Animation Loop
                  </h4>
                </div>
                <div
                  className={`p-3 rounded-md text-xs leading-relaxed ${
                    isGeometric
                      ? 'bg-brand-light/50 text-brand-grey'
                      : isChampagne 
                      ? 'bg-[#1f1f1e] text-stone-400' 
                      : 'bg-[#181e29] text-slate-400'
                  }`}
                >
                  {selectedSection.interactionDetails}
                </div>
              </div>

              {/* Mobile Adaptation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers
                    className={`w-4 h-4 ${isGeometric ? 'text-brand-orange' : isChampagne ? 'text-[#cba87c]' : 'text-blue-400'}`}
                  />
                  <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isGeometric ? 'text-brand-black' : 'text-white'}`}>
                    Responsive Mobile Adaptation
                  </h4>
                </div>
                <div
                  className={`p-3 rounded-md text-xs leading-relaxed border ${
                    isGeometric
                      ? 'border-brand-grey/20 bg-brand-light/50 text-brand-grey'
                      : isChampagne
                      ? 'border-stone-805/40 bg-[#1b1c1b] text-stone-400'
                      : 'border-slate-805/40 bg-[#131821] text-slate-400'
                  }`}
                >
                  {selectedSection.mobileAdaptation}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 text-center space-y-4 py-16">
              <Compass
                className={`w-12 h-12 mx-auto stroke-[1.25] animate-pulse ${
                  isGeometric ? 'text-brand-orange/60' : isChampagne ? 'text-[#cba87c]/60' : 'text-blue-400/60'
                }`}
              />
              <div className="space-y-2">
                <h3 className={`font-sans font-bold text-sm ${isGeometric ? 'text-brand-black' : 'text-white'}`}>No Section Selected</h3>
                <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isGeometric ? 'text-brand-grey' : 'text-stone-500'}`}>
                  Hover over the wireframe and click any section on the canvas, or select from the index below to trigger detail inspection.
                </p>
              </div>

              {/* Flat Index List */}
              <div className="pt-6 text-left space-y-2">
                <span className={`font-mono text-[10px] uppercase tracking-wider block mb-2 px-1 ${
                  isGeometric ? 'text-brand-grey font-semibold' : 'text-stone-500'
                }`}>
                  Blueprint Outlines
                </span>
                <div className="space-y-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => onSelectSection(sec.id)}
                      className={`w-full text-left p-2.5 rounded-md flex items-center justify-between text-xs transition-colors group ${
                        isGeometric
                          ? 'hover:bg-brand-light text-brand-black/80 hover:text-brand-orange font-medium'
                          : isChampagne
                          ? 'hover:bg-stone-800/50 text-stone-400 hover:text-[#cba87c]'
                          : 'hover:bg-slate-800/50 text-slate-400 hover:text-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-[10px] ${isGeometric ? 'text-brand-grey' : 'text-stone-605'} group-hover:text-stone-300`}>
                          {sec.num}
                        </span>
                        <span>{sec.title.split(':')[0]}</span>
                      </div>
                      <CornerDownRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer statistics */}
      <div
        className={`p-4 border-t text-[10px] font-mono flex justify-between items-center ${
          isGeometric ? 'border-brand-grey/25 bg-brand-light text-brand-grey font-semibold' : isChampagne ? 'border-stone-800 bg-[#121211]' : 'border-slate-800 bg-[#0f131a]'
        }`}
      >
        <span>STRUCTURE: ECHELON_LPG</span>
        <span>v1.2.0 (STABLE)</span>
      </div>
    </div>
  );
};
