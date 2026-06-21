export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type ThemeMode = 'blueprint' | 'champagne' | 'geometric';

export interface TypographySpec {
  element: string;
  className: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  purpose: string;
}

export interface GridSpec {
  columns: string;
  rows?: string;
  gap: string;
  purpose: string;
}

export interface ArchitectureSection {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  heightEstimate: string;
  rationale: string;
  keyAesthetic: string;
  gridSpec: GridSpec;
  typography: TypographySpec[];
  interactionDetails: string;
  mobileAdaptation: string;
}

export interface WireframeSettings {
  viewport: ViewportMode;
  theme: ThemeMode;
  showGridLines: boolean;
  showPaddingInlay: boolean;
  showTypographyBadges: boolean;
  showLayoutRationale: boolean;
  interactiveInspecting: boolean;
}
