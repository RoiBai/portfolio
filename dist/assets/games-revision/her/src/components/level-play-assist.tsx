'use client';
/* eslint-disable @next/next/no-img-element -- the hint control uses a bundled transparent PNG */

import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';

export type LevelPlayAssistProps = {
  hints: readonly string[];
  slotLayouts?: readonly { x: number; y: number; w: number }[];
  promptLayout?: { x: number; y: number; w: number };
  undoDisabled: boolean;
  onUndo: () => void;
  onRestart: () => void;
  showHistoryControls?: boolean;
  complete?: boolean;
  completionCaptions?: readonly string[];
  onRevealAnswer?: () => void;
};

const HINT_ANSWER_FADE_OUT_MS = 520;
const HINT_ANSWER_FADE_IN_MS = 1500;
const REDUCED_HINT_ANSWER_FADE_OUT_MS = 140;
const REDUCED_HINT_ANSWER_FADE_IN_MS = 240;

/**
 * Gently fades the current scene away, keeps the solved artwork hidden while
 * React swaps it in, then reveals that answer across a second, slower fade. Both
 * the six regular levels and the final chapter share this transition.
 */
export function revealHintAnswerWithFade(
  board: HTMLElement | null,
  revealAnswer: () => void,
): Promise<void> {
  if (!board) {
    revealAnswer();
    return Promise.resolve();
  }

  board.classList.remove('is-hint-answer-preparing', 'is-hint-answer-revealing', 'is-hint-answer-transitioning');
  board.setAttribute('aria-busy', 'true');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || Boolean(board.closest('.motion-reduced'));
  const fadeOutMs = reducedMotion ? REDUCED_HINT_ANSWER_FADE_OUT_MS : HINT_ANSWER_FADE_OUT_MS;
  const fadeInMs = reducedMotion ? REDUCED_HINT_ANSWER_FADE_IN_MS : HINT_ANSWER_FADE_IN_MS;
  board.style.setProperty('--hint-answer-fade-out-duration', `${fadeOutMs}ms`);
  board.style.setProperty('--hint-answer-fade-in-duration', `${fadeInMs}ms`);
  board.classList.add('is-hint-answer-transitioning');
  // Establish the transition before changing opacity, otherwise the browser can
  // collapse both style changes into one paint and make the old image blink out.
  void board.offsetWidth;
  board.classList.add('is-hint-answer-preparing');

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        revealAnswer();

        // Give React a full paint boundary to commit the solved composition
        // while it remains invisible, then reveal it without a one-frame flash.
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            board.classList.remove('is-hint-answer-preparing');
            board.classList.add('is-hint-answer-revealing');

            window.setTimeout(() => {
              board.classList.remove('is-hint-answer-revealing');
              board.classList.remove('is-hint-answer-transitioning');
              board.style.removeProperty('--hint-answer-fade-out-duration');
              board.style.removeProperty('--hint-answer-fade-in-duration');
              board.removeAttribute('aria-busy');
              resolve();
            }, fadeInMs);
          });
        });
      }, fadeOutMs);
    });
  });
}

type ParticleStyle = CSSProperties & {
  '--particle-x': string;
  '--particle-y': string;
  '--particle-rotate': string;
  '--particle-delay': string;
};

const PARTICLE_OFFSETS: readonly (readonly [number, number])[] = [
  [-46, -28],
  [38, -34],
  [-24, 42],
  [51, 18],
  [-55, 8],
  [18, -48],
  [42, 39],
  [-37, 33],
  [7, 52],
  [57, -9],
  [-14, -54],
  [-49, -15],
];

const PARTICLE_ROTATIONS = [-17, 12, -8, 19, -13, 7, -20, 15, -5, 10, -11, 18] as const;

function particleStyle(characterIndex: number, hintIndex: number): ParticleStyle {
  const patternIndex = (characterIndex + hintIndex * 5) % PARTICLE_OFFSETS.length;
  const [x, y] = PARTICLE_OFFSETS[patternIndex];
  const rotation = PARTICLE_ROTATIONS[(characterIndex * 3 + hintIndex) % PARTICLE_ROTATIONS.length];
  const delay = characterIndex * 24 + (characterIndex % 4) * 7;

  return {
    '--particle-x': `${x}px`,
    '--particle-y': `${y}px`,
    '--particle-rotate': `${rotation}deg`,
    '--particle-delay': `${delay}ms`,
  };
}

export function useCollisionFreePromptHint(promptSelector: string): readonly [
  RefObject<HTMLButtonElement | null>,
  CSSProperties,
] {
  const ref = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    const button = ref.current;
    const board = button?.parentElement;
    const prompt = board?.querySelector<HTMLElement>(promptSelector);
    if (!button || !board || !prompt) return;

    let frame = 0;
    const place = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const boardRect = board.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const contentNodes = [
          prompt.querySelector<HTMLElement>('.prompt-check-stack'),
          prompt.querySelector<HTMLElement>('strong'),
        ].filter((node): node is HTMLElement => Boolean(node));
        const rects = contentNodes.map((node) => node.getBoundingClientRect());
        const promptRect = prompt.getBoundingClientRect();
        const contentRect = rects.length
          ? {
              left: Math.min(...rects.map((rect) => rect.left)),
              right: Math.max(...rects.map((rect) => rect.right)),
              top: Math.min(...rects.map((rect) => rect.top)),
              bottom: Math.max(...rects.map((rect) => rect.bottom)),
            }
          : promptRect;
        const size = Math.max(1, buttonRect.width || 50);
        const gap = Math.max(7, Math.min(16, boardRect.width * 0.009));
        const edge = Math.max(6, gap * 0.75);
        const rightCandidate = contentRect.right - boardRect.left + gap;
        const leftCandidate = contentRect.left - boardRect.left - size - gap;
        let left = rightCandidate;
        let top = contentRect.top - boardRect.top + ((contentRect.bottom - contentRect.top) - size) / 2;

        if (rightCandidate + size > boardRect.width - edge) left = leftCandidate;
        if (left < edge) {
          left = Math.min(boardRect.width - size - edge, Math.max(edge, contentRect.right - boardRect.left - size));
          const below = contentRect.bottom - boardRect.top + gap;
          const above = contentRect.top - boardRect.top - size - gap;
          top = below + size <= boardRect.height - edge ? below : above;
        }

        left = Math.max(edge, Math.min(boardRect.width - size - edge, left));
        top = Math.max(edge, Math.min(boardRect.height - size - edge, top));
        setStyle({ left: `${left}px`, top: `${top}px`, right: 'auto', opacity: 1 });
      });
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(board);
    observer.observe(prompt);
    observer.observe(button);
    window.addEventListener('resize', place, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [promptSelector]);

  return [ref, style] as const;
}

export default function LevelPlayAssist({
  hints,
  slotLayouts,
  complete = false,
  completionCaptions,
  onRevealAnswer,
}: LevelPlayAssistProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [answerRevealPending, setAnswerRevealPending] = useState(false);
  const visibleHints = hints.slice(0, 3);
  const shownCount = Math.min(revealedCount, visibleHints.length);
  const revealed = shownCount > 0;
  const defaultLayouts = [
    { x: 2.4, y: 30.6, w: 31.2 },
    { x: 34.4, y: 30.6, w: 31.2 },
    { x: 66.4, y: 30.6, w: 31.2 },
  ];
  const sceneHeightRatio = (1728 / 1117) * (369 / 547);
  const displayedHints = complete && completionCaptions?.length
    ? completionCaptions.slice(0, 3)
    : visibleHints.slice(0, shownCount);
  const [hintButtonRef, hintButtonStyle] = useCollisionFreePromptHint('.prompt-object');
  const captionLayoutKey = JSON.stringify([displayedHints, slotLayouts]);

  useLayoutEffect(() => {
    const board = hintButtonRef.current?.parentElement;
    const boardFrame = board?.closest<HTMLElement>('.board-frame');
    if (!board || !boardFrame) return;

    const captions = Array.from(board.querySelectorAll<HTMLElement>('.level-clue-slot'));
    const canvasLayout = window.matchMedia('(min-width: 761px), (orientation: landscape)');
    const phoneLandscape = window.matchMedia(
      '(orientation: landscape) and (max-width: 900px), (orientation: landscape) and (max-height: 600px)',
    );
    let frame = 0;
    let disposed = false;

    const measure = () => {
      for (const caption of captions) {
        // Start from the responsive CSS size again when the viewport or font changes.
        caption.style.removeProperty('font-size');
        if (!complete || !phoneLandscape.matches || !board.closest('.player-level-section')) continue;
        const style = window.getComputedStyle(caption);
        let fontSize = parseFloat(style.fontSize);
        const lineHeightRatio = parseFloat(style.lineHeight) / fontSize;
        // Keep short captions at their normal size; fit longer ones to two rows.
        // An unusually narrow custom layout may use more rows instead of tiny text.
        while (fontSize > 12 && caption.offsetHeight > fontSize * lineHeightRatio * 2 + 1) {
          fontSize = Math.max(12, fontSize - 0.25);
          caption.style.fontSize = `${fontSize}px`;
        }
      }

      if (!complete || !canvasLayout.matches || !captions.length) {
        boardFrame.style.removeProperty('--level-caption-min-height');
        return;
      }
      // The board keeps its authored dimensions while its wrapper crops away the
      // choices. Measure layout boxes, unaffected by the character animations.
      const bottom = Math.max(...captions.map((caption) => caption.offsetTop + caption.offsetHeight));
      boardFrame.style.setProperty('--level-caption-min-height', `${Math.ceil(bottom + 8)}px`);
    };
    const scheduleMeasure = () => {
      if (disposed) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(board);
    captions.forEach((caption) => observer.observe(caption));
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    void document.fonts.ready.then(scheduleMeasure);
    document.fonts.addEventListener('loadingdone', scheduleMeasure);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      document.fonts.removeEventListener('loadingdone', scheduleMeasure);
      captions.forEach((caption) => caption.style.removeProperty('font-size'));
      boardFrame.style.removeProperty('--level-caption-min-height');
    };
  }, [captionLayoutKey, complete, hintButtonRef]);

  const handleHintClick = () => {
    if (shownCount < visibleHints.length) {
      setRevealedCount(shownCount + 1);
      return;
    }
    if (!onRevealAnswer || answerRevealPending) return;
    setAnswerRevealPending(true);
    void revealHintAnswerWithFade(
      hintButtonRef.current?.parentElement ?? null,
      onRevealAnswer,
    ).finally(() => setAnswerRevealPending(false));
  };

  return (
    <>
      <button
        ref={hintButtonRef}
        className={`level-prompt-hint-button ${revealed ? 'is-active' : ''}`}
        style={hintButtonStyle}
        type="button"
        onClick={handleHintClick}
        aria-label={shownCount === visibleHints.length && visibleHints.length
          ? 'Reveal the solution and continue'
          : `Show hint ${shownCount + 1}`}
        aria-pressed={revealed}
        disabled={!hints.length || complete || answerRevealPending}
      >
        <img src="/assets/games-revision/her/ui/hint-magnifier.png" alt="" draggable={false} />
      </button>

      {displayedHints.map((hint, hintIndex) => {
        const slot = slotLayouts?.[hintIndex] ?? defaultLayouts[hintIndex];
        const top = Math.min(95, slot.y + slot.w * sceneHeightRatio + 0.8);
        return (
          <p
            className={`level-clue-reveal level-clue-slot ${complete ? 'is-completion-caption' : ''}`}
            key={`hint-${hintIndex}`}
            data-hint-index={hintIndex}
            style={{ left: `${slot.x}%`, top: `${top}%`, width: `${slot.w}%` }}
            aria-hidden="true"
          >
            {Array.from(hint).map((character, characterIndex) => (
              <span
                className="level-clue-particle"
                key={`${hintIndex}-${characterIndex}`}
                style={particleStyle(characterIndex, hintIndex)}
              >
                {character === ' ' ? '\u00a0' : character}
              </span>
            ))}
          </p>
        );
      })}
      <span className="level-clue-screenreader" aria-live="polite" aria-atomic="true">
        {displayedHints.join('；')}
      </span>
    </>
  );
}
