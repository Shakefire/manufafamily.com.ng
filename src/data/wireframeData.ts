import { ArchitectureSection } from '../types';

export const ECHELON_SECTIONS: ArchitectureSection[] = [
  {
    id: 'header',
    num: '00',
    title: 'Navigation Architecture & Sticky Bar',
    shortTitle: '00. Navigation',
    heightEstimate: '72px / 4.5rem',
    rationale: 'Serves as a high-contrast sticky portal anchors for structural sections. It acts as both a brand anchor (left logo) and primary user funnel (right custom styled CTA) with delayed drop-downs on secondary routes.',
    keyAesthetic: 'Highly sophisticated floating panel. Uses frosted glass effects (backdrop-blur) and thin hairline borders of 1px grey/champagne color. Links animate spacing on hover (tracking-widest).',
    gridSpec: {
      columns: 'Flexbox row (Justified content: Space Between)',
      gap: 'gap-8 (desktop) | Collapsed list to drawer (mobile)',
      purpose: 'Distributes branding, editorial pathways, and consultation triggers with maximum legibility and negative space.'
    },
    typography: [
      {
        element: 'Branding Logo',
        className: 'font-sans uppercase tracking-[0.3em] font-semibold text-lg',
        fontSize: '18px / 1.125rem',
        fontFamily: 'Inter (Sans-serif)',
        fontWeight: 'SemiBold (600)',
        purpose: 'Conveys severe contemporary luxury, resembling boutique fashion houses.'
      },
      {
        element: 'Navigation Links',
        className: 'font-mono uppercase text-xs tracking-widest font-normal hover:text-white transition-all duration-300',
        fontSize: '12px / 0.75rem',
        fontFamily: 'Inter / System Mono',
        fontWeight: 'Normal (400)',
        purpose: 'Provides functional metadata feel, ensuring technical precision without distracting from display titles.'
      },
      {
        element: 'Header CTA Button',
        className: 'font-mono uppercase text-xxs tracking-widest px-4 py-2 border rounded-full font-medium',
        fontSize: '10px / 0.625rem',
        fontFamily: 'Inter / System Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Draws focus dynamically with micro-borders. Fits compactly inside the 72px ceiling.'
      }
    ],
    interactionDetails: 'Sticky on scrolls with seamless layout height transition. Standardizes navigation on desktop. Triggers fluid mobile hamburger drawer menu with staggered sliding items when scaled down.',
    mobileAdaptation: 'Folds navigation links into a fullscreen vertical overlay panel with motion transitions. Triggers via a dual-line minimalist menu button.'
  },
  {
    id: 'hero',
    num: '01',
    title: 'Hero Landmark: Cinematic Visual Header',
    shortTitle: '01. Hero Section',
    heightEstimate: '90vh / 100vh',
    rationale: 'Establishes instant atmospheric weight. Rather than direct hard-coded static images, it balances ultra-high-contrast negative space on the left and a dramatic vertical placeholder canvas on the right to establish curated asymmetry.',
    keyAesthetic: 'Staggered dual columns, editorial headers, subtle vertical border separators, luxury metadata tickers.',
    gridSpec: {
      columns: '12-Column Responsive Grid (Left Span: 7, Right Span: 5)',
      gap: 'gap-12 (desktop) | 1-Column Stack (tablet/mobile)',
      purpose: 'Packs text, sub-anchors and primary micro-data vertically on the left while dedicating 40% width to scenic/cinematic content on the right.'
    },
    typography: [
      {
        element: 'Headline / Title',
        className: 'font-serif text-5xl md:text-7xl font-light tracking-tight leading-[1.05]',
        fontSize: '48px to 72px / 3rem to 4.5rem',
        fontFamily: 'Playfair Display / Serif',
        fontWeight: 'Light (300)',
        purpose: 'Evokes high-end editorial and curation culture. Focuses on premium spatial rhythm.'
      },
      {
        element: 'Section Index Tag',
        className: 'font-mono text-xs text-stone-500 tracking-[0.2em] uppercase',
        fontSize: '12px / 0.75rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Acts as structural grid coordinate, adding developer/architectural prestige.'
      },
      {
        element: 'Supporting Narrative Text',
        className: 'font-sans text-stone-400 text-sm md:text-base leading-relaxed max-w-sm',
        fontSize: '14px to 16px / 0.875rem to 1rem',
        fontFamily: 'Inter (Sans-serif)',
        fontWeight: 'Normal (400)',
        purpose: 'Delivers a quiet, understated summary of services without overwhelming visual pacing.'
      }
    ],
    interactionDetails: 'Micro-animations slide text block up on mounting. Right picture features deep zooming effect on scroll. Double primary action cards hover and grow with champagne border glows.',
    mobileAdaptation: 'Splits column grid. Shifts cinematic media box above the headline or converts it into a full background layout with text overlaid inside clean cards.'
  },
  {
    id: 'showreel',
    num: '02',
    title: 'Visual Interval: Full-Width Cinematic Video',
    shortTitle: '02. Cinema Window',
    heightEstimate: '380px to 500px',
    rationale: 'Injects visual sensory depth. Acts as a transition breaker ("breath container") between the noisy Hero and the dense Services sections.',
    keyAesthetic: 'Full-bleed viewport container with dark gradient masks, minimal play/hover indicator, slow zoom animation.',
    gridSpec: {
      columns: '1-Column Full-width layout',
      gap: 'No gap / Full bleed',
      purpose: 'Creates a cinematic immersion zone that fills the horizontal viewport entirely.'
    },
    typography: [
      {
        element: 'Overlay Caption / Year',
        className: 'font-mono text-stone-400 text-xs tracking-widest uppercase absolute bottom-8 left-8',
        fontSize: '12px / 0.75rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Normal (400)',
        purpose: 'Provides temporal context (e.g., SEASON 2026/06) placed inside empty margins.'
      },
      {
        element: 'Centered Action Prompt',
        className: 'font-sans underline uppercase text-stone-100 text-xs tracking-[0.15em] hover:text-stone-300 transition-colors duration-200',
        fontSize: '12px / 0.75rem',
        fontFamily: 'Inter / System Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Subtle visual prompt for optional interactive video playback modal.'
      }
    ],
    interactionDetails: 'Parallax background scrolling. Media player slides in with overlay when play-button is clicked. Muted loops standardizes container motion during active session.',
    mobileAdaptation: 'Maintains aspect-ratio height scaling down smoothly from 450px to 250px, securing readable content ratios without lateral overflow.'
  },
  {
    id: 'intro',
    num: '03',
    title: 'Atelier Manifesto: Creative Philosophy',
    shortTitle: '03. Manifesto',
    heightEstimate: '50vh / 400px',
    rationale: 'Deepens the emotional and design theory of Echelon. Communicates values before sales hooks, reinforcing a high-end luxury client match rather than mass transactional messaging.',
    keyAesthetic: 'Massive, elegant editorial typeface covering 100% of horizontal layout. Left spacer block creates layout asymmetry.',
    gridSpec: {
      columns: '12-Column Grid (Left spacer: 3, Center text span: 9)',
      gap: 'gap-6',
      purpose: 'Pushes the focal point towards standard screen reading vectors, maximizing editorial whitespace.'
    },
    typography: [
      {
        element: 'Big Manifesto Quote',
        className: 'font-serif text-3xl md:text-5xl text-stone-100 font-light leading-snug tracking-normal italic',
        fontSize: '32px to 48px / 2rem to 3rem',
        fontFamily: 'Playfair Display / Serif',
        fontWeight: 'Light (300)',
        purpose: 'Delivers high-impact philosophical narrative with maximum elegance and weight.'
      },
      {
        element: 'Sub-annotation block',
        className: 'font-mono text-xxs tracking-widest text-stone-500 uppercase mt-4 block',
        fontSize: '10px / 0.625rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Supplies index metadata like geographical coordinates or catalog publication issue numbers.'
      }
    ],
    interactionDetails: 'Words fade in sequentially as the screen scrolls into view (staggered scroll trigger), creating a reading experience that mimics printed editorial publications.',
    mobileAdaptation: 'Removes the 3-column left spacer completely, scaling the serif text down to text-2xl and left-aligning items cleanly.'
  },
  {
    id: 'services',
    num: '04',
    title: 'Services Grid: Bespoke Event Offerings',
    shortTitle: '04. Services',
    heightEstimate: '600px to 800px',
    rationale: 'Displays core agency capability. Organizes specialized tasks (Galas, Brand Launches, Private Retreats) into a structured visual menu with clean divisions.',
    keyAesthetic: 'Elegant bento-box-style grid with thin 1px border cards, dark champagne backdrop highlights, absolute corner coordinates.',
    gridSpec: {
      columns: '4-Column equal size layouts on full-deck, collapsing dynamically.',
      gap: 'gap-0 (card lines fused directly) or gap-4 spacing options',
      purpose: 'Unifies adjacent service domains under a single blueprint architecture, styled like drafting panels.'
    },
    typography: [
      {
        element: 'Card Headline',
        className: 'font-sans text-xl font-medium tracking-tight text-stone-100',
        fontSize: '20px / 1.25rem',
        fontFamily: 'Inter (Sans-serif)',
        fontWeight: 'Medium (500)',
        purpose: 'Provides direct, unambiguous labeling inside interactive areas.'
      },
      {
        element: 'Service Category Index',
        className: 'font-mono text-stone-500 text-xs tracking-widest uppercase font-semibold',
        fontSize: '12px / 0.75rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Regular (400)',
        purpose: 'Identifies core functional segments (e.g., CAPABILITY_01, PROD_02).'
      },
      {
        element: 'Capability Bullet List',
        className: 'font-sans text-xs text-stone-400 mt-6 space-y-2 max-w-xs',
        fontSize: '12px / 0.75rem',
        fontFamily: 'Inter (Sans-serif)',
        fontWeight: 'Normal (400)',
        purpose: 'Breaks down actionable delivery scopes compactly so layout remains sleek.'
      }
    ],
    interactionDetails: 'Mouse cursor tracking highlights on card backdrops. Border colors transition from charcoal to muted gold chamapgne when hovered. Accordion expansion on mobile viewports.',
    mobileAdaptation: 'Shifts from a 4-column flat grid into a 1-column responsive layout or interactive multi-tab slider to preserve vertical thumb clearance.'
  },
  {
    id: 'portfolio',
    num: '05',
    title: 'The Showcase: Selected Occasions',
    shortTitle: '05. Portfolio',
    heightEstimate: '800px to 1100px',
    rationale: 'Validates claims and manifests high-production value. Uses varying aspect ratios to mimic fine-art gallery books, keeping the layout active and rhythmic.',
    keyAesthetic: 'Staggered photography frames, extensive margins, luxury client/year metadata, high contrast text blocks.',
    gridSpec: {
      columns: '2-Column asymmetric grids with offset heights',
      gap: 'gap-16 (desktop) | gap-12 (tablet)',
      purpose: 'Intentionally avoids symmetrical grids to replicate physical art-book layouts, maximizing the high-end editorial focus.'
    },
    typography: [
      {
        element: 'Project Title',
        className: 'font-serif text-2xl tracking-normal text-stone-200 mt-4',
        fontSize: '24px / 1.5rem',
        fontFamily: 'Playfair Display / Serif',
        fontWeight: 'Light (300)',
        purpose: 'Conveys bespoke narrative names with elegant serif grace.'
      },
      {
        element: 'Project Context / Scope',
        className: 'font-mono text-xxs uppercase tracking-widest text-stone-500',
        fontSize: '10px / 0.625rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Regular (400)',
        purpose: 'Attributes geographical and aesthetic descriptors to the project (e.g. MONTE CARLO / OUTDOOR SCENE).'
      }
    ],
    interactionDetails: 'Filter tags filter portfolio items smoothly. Hovering over a card activates structural details, showing the project’s specific visual canvas resolution, dimensions and focus areas.',
    mobileAdaptation: 'Collapses asymmetrical offsets, stack files vertically into a single column, resizing frame heights to match natural mobile device heights.'
  },
  {
    id: 'process',
    num: '06',
    title: 'Choreography: Bespoke Planning Phase',
    shortTitle: '06. Process',
    heightEstimate: '500px to 700px',
    rationale: 'Removes the friction of "how we collaborate" and builds elite project trust. Outlines execution stages using visual sequences and blueprint milestones.',
    keyAesthetic: 'Split-view horizontal timelines or step trackers, custom numerical indices, connected axis lines.',
    gridSpec: {
      columns: '12-Column layout. Left sidebar holds section index and description (Span: 4). Right sidebar holds sequential phases (Span: 8).',
      gap: 'gap-12',
      purpose: 'Splits core thematic description from technical stepper stages, allowing user to scroll-scan sequentially.'
    },
    typography: [
      {
        element: 'Step Index Banner',
        className: 'font-mono text-3xl font-light text-stone-600 tracking-wider',
        fontSize: '30px / 1.875rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Light (300)',
        purpose: 'Highlights chronological sequence with high-contrast numbers.'
      },
      {
        element: 'Phase Name',
        className: 'font-sans text-lg font-medium tracking-tight text-stone-200',
        fontSize: '18px / 1.125rem',
        fontFamily: 'Inter (Sans-serif)',
        fontWeight: 'Regular (400)',
        purpose: 'Communicates execution milestones (e.g., Vision Discovery) with clarity.'
      }
    ],
    interactionDetails: 'Hovering over process triggers visual illumination highlights on connected pipeline graphics. Phase elements expand, displaying deliverables tags.',
    mobileAdaptation: 'Converts horizontal pipelines or split grids into a pure vertical stepper line with tactile expand triggers.'
  },
  {
    id: 'testimonials',
    num: '07',
    title: 'Client Notes: Editorial Reflection Notes',
    shortTitle: '07. Reflections',
    heightEstimate: '350px to 450px',
    rationale: 'Infuses social recognition while staying consistent with a high-end atelier tone. Testimonials are presented as personal reflections or handwritten and printed editorial notes.',
    keyAesthetic: 'Centered layout block, elegant serif typography, minimal signature label details, delicate star/emblem ratings.',
    gridSpec: {
      columns: 'Max-W-4xl Centered Block layout',
      gap: 'gap-8 inside content stack',
      purpose: 'Centers attention entirely on written stories and qualitative feedback.'
    },
    typography: [
      {
        element: 'Testimonial Quote Text',
        className: 'font-serif text-xl sm:text-2xl font-light text-stone-300 leading-relaxed italic text-center',
        fontSize: '20px to 24px / 1.25rem to 1.5rem',
        fontFamily: 'Playfair Display / Serif',
        fontWeight: 'Light (300)',
        purpose: 'Presents the client’s qualitative feedback with literary tone.'
      },
      {
        element: 'Client Byline Accent',
        className: 'font-mono text-stone-500 uppercase text-xs tracking-[0.25em] text-center mt-6 block',
        fontSize: '12px / 0.75rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Verifies source and credits the project (e.g., THE GRIMALDI WEDDING / AMALFI).'
      }
    ],
    interactionDetails: 'Left/right arrow ticks cycle slide reflections smoothly with high-fidelity fade transitions. Star or custom emblems light up softly.',
    mobileAdaptation: 'Maintains centered layout, adjusts font constraints to avoid overflow, and introduces thumb-friendly swipe controls.'
  },
  {
    id: 'footer',
    num: '08',
    title: 'Curated Consultation & Structural Footer',
    shortTitle: '08. Enquiry & Footer',
    heightEstimate: '450px to 600px',
    rationale: 'Closes the navigation layout with a clean inquiry funnel. Contains both primary inquiry form structures and deep hierarchical footer maps.',
    keyAesthetic: 'Asymmetric form input lanes alongside secondary vertical menus, copyright stamps, and top-return elements.',
    gridSpec: {
      columns: '12-Column layout. Left: Inquiries & social ties (Span: 5). Right: Grid form entries (Span: 7).',
      gap: 'gap-16 (desktop) | gap-12 (tablet)',
      purpose: 'Speeds up entry form conversions by grouping form files on the right, balanced by quiet, informative brand details on the left.'
    },
    typography: [
      {
        element: 'Form Fields Labels',
        className: 'font-mono text-xxs uppercase tracking-widest text-stone-400',
        fontSize: '10px / 0.625rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Regular (400)',
        purpose: 'Provides crisp instructions for high-end text fields.'
      },
      {
        element: 'Form Buttons Word',
        className: 'font-mono text-xs uppercase tracking-widest text-stone-900 bg-white font-medium',
        fontSize: '12px / 0.75rem',
        fontFamily: 'JetBrains Mono',
        fontWeight: 'Medium (500)',
        purpose: 'Indicates submit action on a large touch target, offering a sharp visual contrast to the dark page styling.'
      }
    ],
    interactionDetails: 'Inputs highlight with elegant bottom-only lines and gold markers when selected. Smooth scroll back to section headers via secondary site links.',
    mobileAdaptation: 'Collapses dual columns into single file stacks. Shifts contact information cards above form wrappers or simplifies input lanes.'
  }
];

export const NAVIGATION_ARCH_NOTES = {
  fixedTop: {
    title: "Sticky Top Header & Floating Menu Bar",
    details: "Pinned container configured with h-18 (72px) height, leveraging a frosted-glass glassmorphism background blur (backdrop-blur-md) and thin border outlines matching the luxury event layout."
  },
  scrollAnchors: {
    title: "Invisible Scroll Margins (scroll-mt-18)",
    details: "Ensures that when clicking links (Portfolio, Process, Contacts), browser jumps are padded with 18rem spacing, making sure sticky menus do not obstruct section titles."
  },
  fontHierarchy: {
    title: "Atmospheric Type Contrast",
    details: "Links use ultra-fine monospaced uppercase tracking (12px / JetBrains Mono) with 200ms spacing animations on hover, while logos rely on highly structured modern sans-serif fonts."
  },
  responsiveAdapt: {
    title: "Frictionless Mobile Drawer",
    details: "Collapses full navigation routes below 768px into a full-height interactive menu. Employs modular animations to slide links incrementally from bottom-left grids."
  }
};
