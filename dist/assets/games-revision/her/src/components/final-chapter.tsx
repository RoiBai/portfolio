'use client';
/* eslint-disable @next/next/no-img-element -- bundled historical artwork is rendered directly */

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { CausalLevelConfig } from '@/lib/studio-types';
import { autoChoiceLayoutStyle } from '@/lib/choice-auto-layout';
import { revealHintAnswerWithFade, useCollisionFreePromptHint } from './level-play-assist';

export const FINAL_CHAPTER_BLOCK_ID = 'story-final-chapter';

export type FinalChapterConfig = CausalLevelConfig;

export const FINAL_CHAPTER_LAYOUT_IDS = [
  'heading',
  'prompt',
  'slot-0',
  'slot-1',
  'slot-2',
  'caption-0',
  'caption-1',
  'caption-2',
  'instruction',
  'choice-frame',
  'choice-power',
] as const;

export type FinalChapterLayoutId = typeof FINAL_CHAPTER_LAYOUT_IDS[number];
export type FinalChapterLayoutValue = { x: number; y: number; w: number };
export type FinalChapterLayoutState = Record<FinalChapterLayoutId, FinalChapterLayoutValue>;

export const DEFAULT_FINAL_CHAPTER_LAYOUT: FinalChapterLayoutState = {
  heading: { x: 0, y: 3.5, w: 100 },
  prompt: { x: 20, y: 15.62, w: 60 },
  'slot-0': { x: 3.3, y: 22.61, w: 29.76 },
  'slot-1': { x: 35.12, y: 22.61, w: 29.76 },
  'slot-2': { x: 66.94, y: 22.61, w: 29.76 },
  'caption-0': { x: 3.3, y: 54.55, w: 29.76 },
  'caption-1': { x: 35.12, y: 54.55, w: 29.76 },
  'caption-2': { x: 66.94, y: 54.55, w: 29.76 },
  instruction: { x: 0, y: 65.2, w: 100 },
  'choice-frame': { x: 3.3, y: 69.1, w: 93.4 },
  'choice-power': { x: 45.5, y: 71.62, w: 9 },
};

const MOBILE_FINAL_CHAPTER_LAYOUT: FinalChapterLayoutState = {
  heading: { x: 0, y: 2.48, w: 100 },
  prompt: { x: 8, y: 8.03, w: 84 },
  'slot-0': { x: 5, y: 11.31, w: 90 },
  'slot-1': { x: 5, y: 34.09, w: 90 },
  'slot-2': { x: 5, y: 56.86, w: 90 },
  'caption-0': { x: 5, y: 29.35, w: 90 },
  'caption-1': { x: 5, y: 52.13, w: 90 },
  'caption-2': { x: 5, y: 74.89, w: 90 },
  instruction: { x: 8, y: 83.07, w: 84 },
  'choice-frame': { x: 5, y: 86.86, w: 90 },
  'choice-power': { x: 37.69, y: 88.1, w: 24.62 },
};

export const FINAL_CHAPTER_LAYOUT_LABELS: Record<FinalChapterLayoutId, { label: string; type: string }> = {
  heading: { label: 'Final Chapter标题', type: '文字' },
  prompt: { label: '提示句', type: '文字' },
  'slot-0': { label: '画面一', type: '画面' },
  'slot-1': { label: '画面二', type: '画面' },
  'slot-2': { label: '画面三', type: '画面' },
  'caption-0': { label: '画面一说明', type: '文字' },
  'caption-1': { label: '画面二说明', type: '文字' },
  'caption-2': { label: '画面三说明', type: '文字' },
  instruction: { label: '拖拽说明', type: '文字' },
  'choice-frame': { label: '选项半透明框', type: '容器' },
  'choice-power': { label: 'Agency选项', type: '选项' },
};

const INITIAL_IMAGES = [
  '/assets/games-revision/her/game/final-chapter/initial-1.png',
  '/assets/games-revision/her/game/final-chapter/initial-2.png',
  '/assets/games-revision/her/game/final-chapter/initial-3.png',
];

const RESOLVED_IMAGES = [
  '/assets/games-revision/her/game/final-chapter/resolved-1.png',
  '/assets/games-revision/her/game/final-chapter/resolved-2.png',
  '/assets/games-revision/her/game/final-chapter/resolved-3.png',
];

const SLOT_CAPTIONS = [
  'Waner drafts edicts and takes part in affairs of state.',
  'Taiping makes strategic decisions in a shifting court.',
  'They are companions and political allies who trust each other.',
];

const FINAL_CHAPTER_PROMPT = 'Follow the surviving evidence. Restore the agency hidden from view.';

export function resolveFinalChapterLayout(config?: FinalChapterConfig): FinalChapterLayoutState {
  const saved = config?.layout ?? {};
  return Object.fromEntries(
    FINAL_CHAPTER_LAYOUT_IDS.map((id) => [id, { ...DEFAULT_FINAL_CHAPTER_LAYOUT[id], ...saved[id] }]),
  ) as FinalChapterLayoutState;
}

export type FinalChapterProps = {
  previewOnly?: boolean;
  initialConfig?: FinalChapterConfig;
  initiallyComplete?: boolean;
  editorMode?: boolean;
  editorResolved?: boolean;
  selectedLayoutId?: FinalChapterLayoutId | null;
  onSelectLayout?: (id: FinalChapterLayoutId) => void;
  onLayoutPointerDown?: (id: FinalChapterLayoutId, event: ReactPointerEvent<HTMLElement>) => void;
  onCompletionChange?: (complete: boolean) => void;
};

export default function FinalChapter({
  previewOnly = false,
  initialConfig,
  initiallyComplete = false,
  editorMode = false,
  editorResolved = false,
  selectedLayoutId,
  onSelectLayout,
  onLayoutPointerDown,
  onCompletionChange,
}: FinalChapterProps) {
  const [resolved, setResolved] = useState<boolean[]>(() => (
    initiallyComplete ? [true, true, true] : [false, false, false]
  ));
  const [selected, setSelected] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [answerRevealPending, setAnswerRevealPending] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(false);
  const complete = resolved.every(Boolean);
  const displayComplete = editorMode ? editorResolved : complete;
  const displayResolved = editorMode && editorResolved ? [true, true, true] : resolved;
  const configuredLayout = useMemo(() => resolveFinalChapterLayout(initialConfig), [initialConfig]);
  const layout = mobileLayout && !editorMode ? MOBILE_FINAL_CHAPTER_LAYOUT : configuredLayout;
  const [hintButtonRef, hintButtonStyle] = useCollisionFreePromptHint('.final-chapter-prompt');

  useEffect(() => {
    onCompletionChange?.(complete);
  }, [complete, onCompletionChange]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px) and (orientation: portrait)');
    const update = () => setMobileLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const resolveSlot = (index: number) => {
    if (previewOnly || editorMode) return;
    setResolved((current) => current.map((value, slotIndex) => slotIndex === index ? true : value));
    setHoveredSlot(null);
  };

  const handleHintClick = () => {
    if (revealedHintCount < SLOT_CAPTIONS.length) {
      setRevealedHintCount(revealedHintCount + 1);
      return;
    }
    if (answerRevealPending) return;
    setAnswerRevealPending(true);
    void revealHintAnswerWithFade(
      hintButtonRef.current?.parentElement ?? null,
      () => {
        setResolved([true, true, true]);
        setSelected(false);
        setHoveredSlot(null);
      },
    ).finally(() => setAnswerRevealPending(false));
  };

  const elementProps = (id: FinalChapterLayoutId) => ({
    'data-final-layout-id': id,
    onPointerDown: editorMode
      ? (event: ReactPointerEvent<HTMLElement>) => {
          event.stopPropagation();
          onSelectLayout?.(id);
          onLayoutPointerDown?.(id, event);
        }
      : undefined,
    onClick: editorMode
      ? (event: ReactMouseEvent<HTMLElement>) => {
          event.stopPropagation();
          onSelectLayout?.(id);
        }
      : undefined,
  });

  const layoutStyle = (id: FinalChapterLayoutId, extra?: CSSProperties): CSSProperties => ({
    left: `${layout[id].x}%`,
    top: `${layout[id].y}%`,
    width: `${layout[id].w}%`,
    touchAction: editorMode ? 'none' : undefined,
    cursor: editorMode ? 'grab' : undefined,
    outline: editorMode && selectedLayoutId === id ? '1.5px solid #ad503d' : undefined,
    outlineOffset: editorMode && selectedLayoutId === id ? '4px' : undefined,
    ...extra,
  });

  return (
    <section className={`final-chapter ${previewOnly ? 'is-editor-preview' : ''} ${displayComplete ? 'is-complete' : ''}`} aria-label="Final Chapter A Thousand Years Later">
      <div className="final-chapter-board">
        <header
          className="final-chapter-heading"
          style={layoutStyle('heading', { pointerEvents: editorMode ? 'auto' : 'none' })}
          {...elementProps('heading')}
        >
          <span>Final Chapter</span>
          <strong>A Thousand Years Later</strong>
        </header>

        <p className="final-chapter-prompt" style={layoutStyle('prompt')} {...elementProps('prompt')}>
          <strong>{FINAL_CHAPTER_PROMPT}</strong>
        </p>

        {!previewOnly && !editorMode && (
          <button
            ref={hintButtonRef}
            className={`level-prompt-hint-button ${revealedHintCount > 0 ? 'is-active' : ''}`}
            style={hintButtonStyle}
            type="button"
            onClick={handleHintClick}
            aria-label={revealedHintCount >= SLOT_CAPTIONS.length
              ? 'Reveal the solution and continue'
              : `Show hint ${revealedHintCount + 1}`}
            aria-pressed={revealedHintCount > 0}
            disabled={complete || answerRevealPending}
          >
            <img src="/assets/games-revision/her/ui/hint-magnifier.png" alt="" draggable={false} />
          </button>
        )}

        <div className="final-chapter-slots" style={{ inset: 0, left: 0, top: 0, width: '100%', display: 'block' }}>
          {INITIAL_IMAGES.map((initial, index) => {
            const slotId = `slot-${index}` as FinalChapterLayoutId;
            const captionId = `caption-${index}` as FinalChapterLayoutId;
            return (
              <article
                className="final-chapter-slot-wrap"
                key={initial}
                style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}
              >
                <button
                  type="button"
                  className={`final-chapter-slot ${displayResolved[index] ? 'is-resolved' : ''} ${hoveredSlot === index ? 'is-drop-hover' : ''}`}
                  style={layoutStyle(slotId, { position: 'absolute', pointerEvents: 'auto' })}
                  onClick={(event) => {
                    if (editorMode) {
                      event.stopPropagation();
                      onSelectLayout?.(slotId);
                      return;
                    }
                    if (selected) resolveSlot(index);
                  }}
                  onPointerDown={editorMode ? (event) => {
                    event.stopPropagation();
                    onSelectLayout?.(slotId);
                    onLayoutPointerDown?.(slotId, event);
                  } : undefined}
                  onDragOver={(event) => {
                    if (previewOnly || editorMode) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setHoveredSlot(index);
                  }}
                  onDragLeave={() => setHoveredSlot(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (event.dataTransfer.getData('text/wanping-final-choice') === 'power') resolveSlot(index);
                  }}
                  data-final-layout-id={slotId}
                  aria-label={`Picture ${index + 1}${displayResolved[index] ? ', agency restored' : ', add agency here'}`}
                >
                  <img src={displayResolved[index] ? RESOLVED_IMAGES[index] : initial} alt="" />
                </button>
                <p
                  className={displayResolved[index] || revealedHintCount > index ? 'is-visible' : ''}
                  style={layoutStyle(captionId, { position: 'absolute', pointerEvents: editorMode ? 'auto' : 'none' })}
                  {...elementProps(captionId)}
                >
                  {SLOT_CAPTIONS[index]}
                </p>
              </article>
            );
          })}
        </div>

        {(!previewOnly || editorMode) && (
          <>
            <p className="final-chapter-instruction" style={layoutStyle('instruction')} {...elementProps('instruction')}>
              Choose an icon, then a frame. Reconstruct all three scenes to continue.
            </p>
            <img
              className="final-chapter-choice-frame"
              src="/assets/games-revision/her/game/choice-area-frame.png"
              alt=""
              aria-hidden="true"
              style={layoutStyle('choice-frame')}
              {...elementProps('choice-frame')}
            />
            <div
              className={`final-chapter-power-choice-cell ${editorMode ? 'is-editor-layout' : ''}`}
              style={editorMode
                ? layoutStyle('choice-power')
                : autoChoiceLayoutStyle(0, 1, layout['choice-power'].w, {
                    x: layout['choice-frame'].x,
                    y: layout['choice-frame'].y,
                    w: layout['choice-frame'].w,
                    h: mobileLayout ? 10.95 : 22.35,
                  })}
              data-final-layout-id="choice-power"
            >
              <button
                type="button"
                className={`final-chapter-power-choice ${selected ? 'is-selected' : ''}`}
                draggable={!previewOnly && !editorMode}
                onPointerDown={editorMode ? (event) => {
                  event.stopPropagation();
                  onSelectLayout?.('choice-power');
                  onLayoutPointerDown?.('choice-power', event);
                } : undefined}
                onDragStart={(event) => {
                  if (previewOnly || editorMode) return;
                  event.dataTransfer.setData('text/wanping-final-choice', 'power');
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onClick={(event) => {
                  if (editorMode) {
                    event.stopPropagation();
                    onSelectLayout?.('choice-power');
                    return;
                  }
                  setSelected((current) => !current);
                }}
                aria-pressed={selected}
                aria-label="Select POWER icon"
              >
                <img className="choice-artwork" src="/assets/games-revision/her/game/choice-normalized/power.png" alt="" />
                <span className="choice-caption">POWER</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
