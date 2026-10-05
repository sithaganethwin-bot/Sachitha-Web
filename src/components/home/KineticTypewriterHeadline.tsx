import React, { useState, useEffect } from 'react';

interface PhraseConfig {
  lead: string;     // e.g. "ENTERPRISE"
  accent: string;   // e.g. "beyond the"
  trail: string;    // e.g. "THEORY."
}

interface KineticTypewriterHeadlineProps {
  phrases?: PhraseConfig[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  align?: 'center' | 'left';
}

const DEFAULT_PHRASES: PhraseConfig[] = [
  { lead: "ENTERPRISE", accent: "beyond the", trail: "THEORY." },
  { lead: "STRATEGY", accent: "beyond the", trail: "TEXTBOOK." },
  { lead: "EXCELLENCE", accent: "beyond the", trail: "RECITATION." },
  { lead: "ACUMEN", accent: "beyond the", trail: "MEMORIZATION." }
];

export const KineticTypewriterHeadline: React.FC<KineticTypewriterHeadlineProps> = ({
  phrases = DEFAULT_PHRASES,
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseDuration = 5000,
  className = "",
  align = "center"
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhrase = phrases[phraseIndex] || phrases[0];

  // Full representation: lead + " " + accent + " " + trail
  const fullText = `${currentPhrase.lead} ${currentPhrase.accent} ${currentPhrase.trail}`;
  const leadLength = currentPhrase.lead.length;
  const accentStart = leadLength + 1;
  const accentLength = currentPhrase.accent.length;
  const trailStart = accentStart + accentLength + 1;
  const totalLength = fullText.length;

  useEffect(() => {
    let timeout: any;

    if (isPaused) return;

    if (!isDeleting && charCount < totalLength) {
      // Typing forward
      const nextChar = fullText[charCount];
      const delay = (nextChar === ' ' || nextChar === '.') 
        ? typingSpeed + 45 
        : typingSpeed + Math.floor(Math.random() * 20 - 10);

      timeout = setTimeout(() => {
        setCharCount(prev => prev + 1);
      }, delay);
    } else if (!isDeleting && charCount === totalLength) {
      // Completed typing full phrase: hold
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charCount > 0) {
      // Backspacing
      timeout = setTimeout(() => {
        setCharCount(prev => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && charCount === 0) {
      // Finished deleting: switch to next phrase
      setIsDeleting(false);
      setPhraseIndex(prev => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charCount, isDeleting, isPaused, totalLength, fullText, phraseIndex, phrases.length, typingSpeed, deletingSpeed, pauseDuration]);

  // Compute slices for the 3 distinct styled segments
  const leadVisible = fullText.slice(0, Math.min(charCount, leadLength));
  const showFirstSpace = charCount > leadLength;
  
  const accentVisible = charCount >= accentStart
    ? fullText.slice(accentStart, Math.min(charCount, accentStart + accentLength))
    : "";
  const showSecondSpace = charCount > accentStart + accentLength;

  const trailVisible = charCount >= trailStart
    ? fullText.slice(trailStart, Math.min(charCount, totalLength))
    : "";

  const isLeft = align === 'left';

  return (
    <div className={`relative inline-block w-full ${isLeft ? 'text-center lg:text-left' : 'text-center'} ${className}`}>
      <h1 className={`${isLeft ? 'text-3xl sm:text-5xl lg:text-5xl xl:text-6xl justify-center lg:justify-start' : 'text-4xl sm:text-6xl md:text-7xl justify-center'} font-extrabold tracking-tight text-[#161618] dark:text-[#F7F5F0] leading-[1.08] font-syne uppercase min-h-[1.15em] sm:min-h-[1.8em] flex items-center flex-wrap`}>
        {/* Segment 1: Lead Word (e.g. ENTERPRISE) */}
        <span className="font-syne font-extrabold tracking-tight">
          {leadVisible}
        </span>

        {/* Space 1 */}
        {showFirstSpace && <span className="inline-block w-[0.25em]">&nbsp;</span>}

        {/* Segment 2: Stylized Accent (e.g. beyond the) */}
        {accentVisible && (
          <span className="font-serif-editorial italic font-normal text-[#4338CA] dark:text-cyan-400 lowercase transition-colors">
            {accentVisible}
          </span>
        )}

        {/* Space 2 */}
        {showSecondSpace && <span className="inline-block w-[0.25em]">&nbsp;</span>}

        {/* Segment 3: Trail Word (e.g. THEORY.) */}
        {trailVisible && (
          <span className="font-syne font-extrabold tracking-tight">
            {trailVisible}
          </span>
        )}

        {/* Blinking Kinetic Caret */}
        <span
          className="inline-block w-[3px] sm:w-[5px] h-[0.82em] align-middle ml-1.5 bg-[#4338CA] dark:bg-cyan-400 animate-pulse rounded-full shadow-[0_0_12px_rgba(67,56,202,0.8)] dark:shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          aria-hidden="true"
        />
      </h1>
    </div>
  );
};
