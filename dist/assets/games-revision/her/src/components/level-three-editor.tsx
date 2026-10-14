'use client';
/* eslint-disable @next/next/no-img-element -- user-uploaded/local layered PNG assets need raw sizing and transforms */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { LevelThreeConfig } from '@/lib/studio-types';
import { autoChoiceLayoutStyle } from '@/lib/choice-auto-layout';
import LevelPlayAssist from './level-play-assist';

const LEVEL_HINTS = [
  'The two women talk together beside the lake.',
  'The two women share a banquet.',
  'They leave poetry and memories.',
];

const LEVEL_COMPLETION_CAPTIONS = [
  'Waner and Taiping travel together to the Eastern Wall.',
  'Waner and Taiping share a banquet at the northern islet.',
  'Their poems preserve memories of time together.',
];

type CharacterId = 'waner' | 'taiping';
type SceneId = 'lake' | 'banquet' | 'poem';
type ItemId = CharacterId | SceneId;
type LayoutId =
  | 'prompt'
  | 'slot-0'
  | 'slot-1'
  | 'slot-2'
  | 'choice-waner'
  | 'choice-taiping'
  | 'choice-lake'
  | 'choice-banquet'
  | 'choice-poem'
  ;

type SlotState = { items: ItemId[] };
type LayoutValue = { x: number; y: number; w: number };
type LayoutState = Record<LayoutId, LayoutValue>;
type LayerValue = { x: number; y: number; w: number; z: number };
type LayerOverrides = Record<string, LayerValue>;
type LayerKind = 'natural' | 'cover' | 'portrait';
type PresetCategoryId = SceneId | 'people' | 'pairs' | 'utility';
type EditSurface = 'presets' | 'layout';
type PresetScenario = {
  id: string;
  category: PresetCategoryId;
  label: string;
  description: string;
  reuse: string;
  items: ItemId[];
  focusKey: string;
};
type LayerDescriptor = LayerValue & {
  key: string;
  label: string;
  src: string;
  kind: LayerKind;
  flip?: boolean;
  interactive?: boolean;
};
type Selection =
  | { kind: 'layout'; id: LayoutId }
  | { kind: 'layer'; slot: number; key: string; label: string }
  | null;

const ROOT = '/assets/games-revision/her/game';
const LEVEL_ROOT = `${ROOT}/level-three`;
const NORMALIZED_CHOICE_ROOT = `${ROOT}/choice-normalized`;
const LOCAL_STORAGE_KEY = 'wanping-level-three-editor-v1';
const CHARACTER_IDS: CharacterId[] = ['waner', 'taiping'];
const SCENE_IDS: SceneId[] = ['lake', 'banquet', 'poem'];
const FRAME_LAYER: LayerDescriptor = {
  key: 'frame',
  label: '格子外边框',
  src: `${ROOT}/slot-frame.png`,
  x: -1.5,
  y: -2.1,
  w: 103,
  z: 90,
  kind: 'natural',
  interactive: false,
};

const CHARACTER_META: Record<
  CharacterId,
  {
    label: string;
    side: string;
    background: string;
    sideWidth: number;
    sideY: number;
  }
> = {
  waner: {
    label: 'Waner',
    side: `${LEVEL_ROOT}/shangguan-waner-close-side-half.png`,
    background: `${ROOT}/solid-scene-shangguan-waner.png`,
    sideWidth: 49,
    sideY: 7.2,
  },
  taiping: {
    label: 'Taiping',
    side: `${LEVEL_ROOT}/princess-taiping-close-side-half.png`,
    background: `${ROOT}/solid-scene-princess-taiping.png`,
    sideWidth: 47,
    sideY: 0,
  },
};

const SCENE_META: Record<SceneId, { label: string; background: string; composite: string }> = {
  lake: {
    label: 'Lake',
    background: `${LEVEL_ROOT}/scene-lake-trip.png`,
    composite: `${LEVEL_ROOT}/lake-trip-shangguan-waner-taiping.png`,
  },
  banquet: {
    label: 'Banquet',
    background: `${LEVEL_ROOT}/scene-banquet.png`,
    composite: `${LEVEL_ROOT}/banquet-shangguan-waner-princess-taiping.png`,
  },
  poem: {
    label: 'Poetry',
    background: `${LEVEL_ROOT}/scene-poetry.png`,
    composite: `${LEVEL_ROOT}/poetry-shangguan-waner-princess-taiping-banquet.png`,
  },
};

const CHOICE_META: Record<ItemId, { label: string; src: string }> = {
  waner: { label: 'Waner', src: `${NORMALIZED_CHOICE_ROOT}/shangguan-waner.png` },
  taiping: { label: 'Taiping', src: `${NORMALIZED_CHOICE_ROOT}/princess-taiping.png` },
  lake: { label: 'Lake', src: `${NORMALIZED_CHOICE_ROOT}/lake-trip.png` },
  banquet: { label: 'Banquet', src: `${NORMALIZED_CHOICE_ROOT}/banquet.png` },
  poem: { label: 'Poetry', src: `${NORMALIZED_CHOICE_ROOT}/poetry-scene.png` },
};

const CHOICE_ORDER: ItemId[] = ['waner', 'taiping', 'lake', 'banquet', 'poem'];
const CHOICE_LAYOUT: Record<ItemId, LayoutId> = {
  waner: 'choice-waner',
  taiping: 'choice-taiping',
  lake: 'choice-lake',
  banquet: 'choice-banquet',
  poem: 'choice-poem',
};

const DEFAULT_LAYOUT: LayoutState = {
  prompt: { x: 35.76, y: 13.25, w: 35.02 },
  'slot-0': { x: 3.41, y: 22.74, w: 30.73 },
  'slot-1': { x: 34.66, y: 22.74, w: 30.73 },
  'slot-2': { x: 65.91, y: 22.74, w: 30.73 },
  'choice-waner': { x: 6, y: 69, w: 8.5 },
  'choice-taiping': { x: 26, y: 69, w: 8.5 },
  'choice-lake': { x: 46, y: 69, w: 8.5 },
  'choice-banquet': { x: 66, y: 69, w: 8.5 },
  'choice-poem': { x: 86, y: 69, w: 8.5 },
};

const SAMPLE_SLOTS: SlotState[] = [
  { items: ['lake', 'taiping', 'waner'] },
  { items: ['banquet', 'waner', 'taiping'] },
  { items: ['poem', 'waner', 'taiping'] },
];

const EMPTY_SLOTS = (): SlotState[] => [{ items: [] }, { items: [] }, { items: [] }];

const LAYOUT_LIST: { id: LayoutId; label: string; type: string }[] = [
  { id: 'prompt', label: '提示句', type: '文字' },
  { id: 'slot-0', label: 'Scene frame 1', type: '容器' },
  { id: 'slot-1', label: 'Scene frame 2', type: '容器' },
  { id: 'slot-2', label: 'Scene frame 3', type: '容器' },
  ...CHOICE_ORDER.map((item) => ({
    id: CHOICE_LAYOUT[item],
    label: CHOICE_META[item].label,
    type: '选择项',
  })),
];

const PRESET_CATEGORIES: { id: PresetCategoryId; label: string; summary: string }[] = [
  { id: 'lake', label: 'Lake', summary: '空景、两种单人状态与双人完整画面' },
  { id: 'banquet', label: 'Banquet', summary: '空景、两种单人状态与双人完整画面' },
  { id: 'poem', label: 'Poetry', summary: '空景、两种单人状态与双人完整画面' },
  { id: 'people', label: '人物左／右', summary: '婉儿与太平各自的左右全局位置' },
  { id: 'pairs', label: '无场景双人', summary: '两种人物顺序，复用已设置的左右位置' },
  { id: 'utility', label: '背景与边框', summary: '空状态、纯色背景、分栏底色与外框' },
];

const rightPreviewItems = (character: CharacterId): ItemId[] => {
  const left = CHARACTER_IDS.find((candidate) => candidate !== character) ?? 'waner';
  return [left, character];
};

const PRESET_SCENARIOS: PresetScenario[] = [
  ...SCENE_IDS.flatMap((scene): PresetScenario[] => [
    {
      id: `${scene}-background`,
      category: scene,
      label: `${SCENE_META[scene].label} · 空场景`,
      description: `只放入“${SCENE_META[scene].label}”时显示空场景背景。`,
      reuse: `全部${SCENE_META[scene].label}状态共用`,
      items: [scene],
      focusKey: `scene-background-${scene}`,
    },
    ...CHARACTER_IDS.map((character): PresetScenario => ({
      id: `${scene}-single-${character}`,
      category: scene,
      label: `${SCENE_META[scene].label}＋${CHARACTER_META[character].label}`,
      description: '场景中只有一人时，显示空场景背景和该人物的近侧面半身。',
      reuse: '复用该场景背景与人物左侧位置',
      items: [scene, character],
      focusKey: `side-left-${character}`,
    })),
    {
      id: `${scene}-complete`,
      category: scene,
      label: `${SCENE_META[scene].label} · 双人完整画面`,
      description: '婉儿与太平都在场时，替换为素材中已经绘制好的完整双人画面；拖入顺序不影响结果。',
      reuse: `该${SCENE_META[scene].label}完整画面三个格子共用`,
      items: [scene, 'waner', 'taiping'],
      focusKey: `scene-composite-${scene}`,
    },
  ]),
  ...CHARACTER_IDS.flatMap((character): PresetScenario[] => [
    {
      id: `left-${character}`,
      category: 'people',
      label: `${CHARACTER_META[character].label} · 左侧`,
      description: '单人、无场景双人以及场景单人状态复用这个左侧位置。',
      reuse: '该人物所有左侧状态共用',
      items: [character],
      focusKey: `side-left-${character}`,
    },
    {
      id: `right-${character}`,
      category: 'people',
      label: `${CHARACTER_META[character].label} · 右侧`,
      description: '右侧人物自动镜像，所有无场景双人组合共用。',
      reuse: '该人物所有右侧状态共用',
      items: rightPreviewItems(character),
      focusKey: `side-right-${character}`,
    },
  ]),
  ...CHARACTER_IDS.flatMap((left): PresetScenario[] => CHARACTER_IDS
    .filter((right) => right !== left)
    .map((right): PresetScenario => ({
      id: `pair-${left}-${right}`,
      category: 'pairs',
      label: `${CHARACTER_META[left].label}（左）＋${CHARACTER_META[right].label}（右）`,
      description: '没有场景时，两人使用各自的半幅专属底色；右侧人物自动镜像并面向中间。',
      reuse: '复用人物左右位置与分栏底色',
      items: [left, right],
      focusKey: `side-left-${left}`,
    }))),
  {
    id: 'utility-empty',
    category: 'utility',
    label: '空场景占位符',
    description: '三个格子在没有放入任何素材时共用。',
    reuse: '三个格子共用',
    items: [],
    focusKey: 'empty',
  },
  ...CHARACTER_IDS.map((character): PresetScenario => ({
    id: `utility-full-background-${character}`,
    category: 'utility',
    label: `${CHARACTER_META[character].label} · 单人底色`,
    description: '单独放入人物时使用该人物的全幅专属背景色。',
    reuse: '两个人物共用全幅背景位置',
    items: [character],
    focusKey: `background-${character}`,
  })),
  ...CHARACTER_IDS.flatMap((character): PresetScenario[] => {
    const other = CHARACTER_IDS.find((candidate) => candidate !== character) ?? 'waner';
    return [
      {
        id: `utility-left-background-${character}`,
        category: 'utility',
        label: `${CHARACTER_META[character].label} · 左半底色`,
        description: '无场景双人组合中的左半幅人物专属背景。',
        reuse: '全部左半底色共用位置',
        items: [character, other],
        focusKey: `background-left-${character}`,
      },
      {
        id: `utility-right-background-${character}`,
        category: 'utility',
        label: `${CHARACTER_META[character].label} · 右半底色`,
        description: '无场景双人组合中的右半幅人物专属背景。',
        reuse: '全部右半底色共用位置',
        items: [other, character],
        focusKey: `background-right-${character}`,
      },
    ];
  }),
  {
    id: 'utility-frame',
    category: 'utility',
    label: '格子外边框',
    description: 'Scene frame与拖拽悬停共用这一外框。',
    reuse: '三个格子共用',
    items: ['waner'],
    focusKey: 'frame',
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isCharacter(item: ItemId): item is CharacterId {
  return CHARACTER_IDS.includes(item as CharacterId);
}

function getCharacters(slot: SlotState) {
  return slot.items.filter(isCharacter);
}

function getBackground(slot: SlotState): SceneId | null {
  return (slot.items.find((item) => SCENE_IDS.includes(item as SceneId)) as SceneId | undefined) ?? null;
}

function isWinning(slots: SlotState[]) {
  const expected: ItemId[][] = [
    ['lake', 'taiping', 'waner'],
    ['banquet', 'taiping', 'waner'],
    ['poem', 'taiping', 'waner'],
  ];
  return expected.every((answer, index) => {
    const actual = slots[index].items;
    return actual.length === answer.length && answer.every((item) => actual.includes(item));
  });
}

function placeItem(slots: SlotState[], targetIndex: number, item: ItemId): SlotState[] {
  if (slots[targetIndex].items.includes(item)) return slots;

  const next = slots.map((slot) => ({ items: [...slot.items] }));
  let targetItems = [...slots[targetIndex].items];

  if (isCharacter(item)) {
    const characters = targetItems.filter(isCharacter);
    if (characters.length >= 2) {
      const secondCharacter = characters[1];
      targetItems = targetItems.filter((current) => current !== secondCharacter);
    }
    targetItems.push(item);
  } else {
    targetItems = targetItems.filter((current) => !SCENE_IDS.includes(current as SceneId));
    targetItems.push(item);
  }

  next[targetIndex] = { items: targetItems };
  return next;
}

function appendPeopleLayers(layers: LayerDescriptor[], characters: CharacterId[]) {
  characters.forEach((characterId, index) => {
    const character = CHARACTER_META[characterId];
    const isRight = index === 1;
    layers.push({
      key: `side-${isRight ? 'right' : 'left'}-${characterId}`,
      label: `${isRight ? '右侧' : '左侧'}人物 · ${character.label}`,
      src: character.side,
      x: isRight ? 100 - character.sideWidth : 0,
      y: character.sideY,
      w: character.sideWidth,
      z: 30,
      kind: 'natural',
      flip: isRight,
    });
  });
}

function appendPlainBackgroundLayers(layers: LayerDescriptor[], characters: CharacterId[]) {
  if (characters.length === 2) {
    const left = CHARACTER_META[characters[0]];
    const right = CHARACTER_META[characters[1]];
    layers.push(
      {
        key: `background-left-${characters[0]}`,
        label: `左侧底色 · ${left.label}`,
        src: left.background,
        x: 0,
        y: 0,
        w: 50,
        z: 1,
        kind: 'cover',
      },
      {
        key: `background-right-${characters[1]}`,
        label: `右侧底色 · ${right.label}`,
        src: right.background,
        x: 50,
        y: 0,
        w: 50,
        z: 1,
        kind: 'cover',
      },
    );
    return;
  }

  const character = characters[0];
  layers.push({
    key: character ? `background-${character}` : 'background-generic',
    label: character ? `底色 · ${CHARACTER_META[character].label}` : '纯色场景 · 通用',
    src: character ? CHARACTER_META[character].background : `${ROOT}/solid-scene-generic.png`,
    x: 0,
    y: 0,
    w: 100,
    z: 1,
    kind: 'cover',
  });
}

function getSceneLayers(slot: SlotState): LayerDescriptor[] {
  if (!slot.items.length) {
    return [
      {
        key: 'empty',
        label: '格子空状态',
        src: `${ROOT}/slot-empty.png`,
        x: -1.5,
        y: -2.1,
        w: 103,
        z: 1,
        kind: 'natural',
        interactive: false,
      },
    ];
  }

  const characters = getCharacters(slot);
  const sceneId = getBackground(slot);
  const layers: LayerDescriptor[] = [];

  if (sceneId) {
    const scene = SCENE_META[sceneId];
    if (characters.length === 2) {
      layers.push({
        key: `scene-composite-${sceneId}`,
        label: `${scene.label} · 双人完整画面`,
        src: scene.composite,
        x: 0,
        y: 0,
        w: 100,
        z: 20,
        kind: 'cover',
      });
    } else {
      layers.push({
        key: `scene-background-${sceneId}`,
        label: `场景 · ${scene.label}`,
        src: scene.background,
        x: 0,
        y: 0,
        w: 100,
        z: 1,
        kind: 'cover',
      });
      appendPeopleLayers(layers, characters);
    }
  } else {
    appendPlainBackgroundLayers(layers, characters);
    appendPeopleLayers(layers, characters);
  }

  layers.push(FRAME_LAYER);
  return layers;
}

function canonicalLayerKey(rawKey: string) {
  const key = rawKey.replace(/^\d+:/, '');
  if (key.startsWith('l3.')) return key;
  if (key.startsWith('scene-background-')) return `l3.scene.${key.slice('scene-background-'.length)}.background`;
  if (key.startsWith('scene-composite-')) return `l3.scene.${key.slice('scene-composite-'.length)}.composite`;
  if (key.startsWith('side-left-')) return `l3.person.left.${key.slice('side-left-'.length)}`;
  if (key.startsWith('side-right-')) return `l3.person.right.${key.slice('side-right-'.length)}`;
  if (key === 'empty') return 'l3.slot.empty-placeholder';
  if (key === 'frame') return 'l3.slot.frame';
  if (key === 'background-generic' || /^background-(waner|taiping)$/.test(key)) return 'l3.plain.background.full';
  if (key.startsWith('background-left-')) return 'l3.plain.background.left-half';
  if (key.startsWith('background-right-')) return 'l3.plain.background.right-half';
  return key;
}

function migrateLayerOverrides(input: LayerOverrides | undefined): LayerOverrides {
  if (!input) return {};
  const migrated: LayerOverrides = {};
  const migrationPriority = (key: string) => {
    if (key.startsWith('l3.')) return 4;
    if (!/^\d+:/.test(key)) return 3;
    const slot = Number(key.split(':')[0]);
    return 2 - (Number.isFinite(slot) ? slot * 0.1 : 0);
  };
  const entries = Object.entries(input).sort(([left], [right]) => migrationPriority(left) - migrationPriority(right));
  entries.forEach(([key, value]) => {
    migrated[canonicalLayerKey(key)] = value;
  });
  return migrated;
}

function overrideKey(_slot: number, key: string) {
  return canonicalLayerKey(key);
}

function NumericControl({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="numeric-control">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isInteger(value) ? value : Number(value.toFixed(1))}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </label>
  );
}

function SceneLayer({
  descriptor,
  value,
  selected,
  mode,
  onPointerDown,
  allowPassive = false,
}: {
  descriptor: LayerDescriptor;
  value: LayerValue;
  selected: boolean;
  mode: 'edit' | 'play';
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  allowPassive?: boolean;
}) {
  const style: CSSProperties = {
    left: `${value.x}%`,
    top: `${value.y}%`,
    width: `${value.w}%`,
    zIndex: value.z,
  };
  const canInteract = mode === 'edit' && (allowPassive || descriptor.interactive !== false);

  return (
    <button
      type="button"
      className={`scene-layer ${descriptor.kind} ${selected ? 'is-selected' : ''} ${!canInteract ? 'is-passive' : ''}`}
      style={style}
      aria-hidden={mode === 'play'}
      aria-label={`Select artwork layer: ${descriptor.label}`}
      tabIndex={canInteract ? 0 : -1}
      onPointerDown={canInteract ? onPointerDown : undefined}
    >
      <img
        src={descriptor.src}
        alt=""
        draggable={false}
        style={descriptor.flip ? { transform: 'scaleX(-1)' } : undefined}
      />
    </button>
  );
}

export type LevelThreeEditorProps = {
  onBack?: () => void;
  onComplete?: () => void;
  onCompletionChange?: (complete: boolean) => void;
  onConfigChange?: (config: LevelThreeConfig) => void;
  onSave?: (config: LevelThreeConfig) => void | Promise<void>;
  initialConfig?: LevelThreeConfig;
  initiallyComplete?: boolean;
  persistLocal?: boolean;
  playOnly?: boolean;
  previewOnly?: boolean;
  portfolioGuided?: boolean;
};

export default function LevelThreeEditor({
  onBack,
  onComplete,
  onCompletionChange,
  onConfigChange,
  onSave,
  initialConfig,
  initiallyComplete = false,
  persistLocal = true,
  playOnly = false,
  previewOnly = false,
  portfolioGuided = false,
}: LevelThreeEditorProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<
    | {
        kind: 'layout';
        id: LayoutId;
        startX: number;
        startY: number;
        origin: LayoutValue;
        rect: DOMRect;
      }
    | {
        kind: 'layer';
        storageKey: string;
        startX: number;
        startY: number;
        origin: LayerValue;
        rect: DOMRect;
      }
    | null
  >(null);
  const editorSlotsRef = useRef<SlotState[] | null>(null);
  const previousCompleteRef = useRef(false);
  const saveLabelTimerRef = useRef<number | null>(null);

  const [mode, setMode] = useState<'edit' | 'play'>(playOnly ? 'play' : 'edit');
  const [editSurface, setEditSurface] = useState<EditSurface>('presets');
  const [presetCategory, setPresetCategory] = useState<PresetCategoryId>('lake');
  const [selectedPresetId, setSelectedPresetId] = useState('lake-complete');
  const [presetLayerKey, setPresetLayerKey] = useState('scene-composite-lake');
  const [layout, setLayout] = useState<LayoutState>(() => ({
    ...DEFAULT_LAYOUT,
    ...(initialConfig?.layout as Partial<LayoutState> | undefined),
  }));
  const [layerOverrides, setLayerOverrides] = useState<LayerOverrides>(() => migrateLayerOverrides(initialConfig?.layerOverrides));
  const [slots, setSlots] = useState<SlotState[]>(
    playOnly && !previewOnly && !initiallyComplete
      ? (portfolioGuided ? [{ items: ['lake', 'waner', 'taiping'] }, { items: ['banquet', 'waner'] }, { items: [] }] : EMPTY_SLOTS())
      : SAMPLE_SLOTS.map((slot) => ({ items: [...slot.items] })),
  );
  const [history, setHistory] = useState<SlotState[][]>([]);
  const [selection, setSelection] = useState<Selection>(
    playOnly ? null : { kind: 'layout', id: 'prompt' },
  );
  const [selectedChoice, setSelectedChoice] = useState<ItemId | null>(portfolioGuided ? 'taiping' : null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(() => Boolean(initialConfig || !persistLocal));
  const [saveLabel, setSaveLabel] = useState('已自动保存');
  const latestConfigRef = useRef<LevelThreeConfig>({ layout, layerOverrides });
  const onConfigChangeRef = useRef(onConfigChange);

  const complete = useMemo(() => isWinning(slots), [slots]);

  // Keep the portfolio's adjacent guide tied to the same scene state as the puzzle.
  useEffect(() => {
    if (!portfolioGuided || !boardRef.current) return;
    const answers: ItemId[][] = [
      ['lake', 'waner', 'taiping'],
      ['banquet', 'waner', 'taiping'],
      ['poem', 'waner', 'taiping'],
    ];
    const completedSteps = answers.map((answer, index) =>
      slots[index].items.length === answer.length && answer.every(item => slots[index].items.includes(item)),
    );
    const board = boardRef.current;
    const reportProgress = () => board.dispatchEvent(new CustomEvent('portfolio:her-progress', {
      bubbles: true,
      detail: { completedSteps, scenes: slots.map(slot => [...slot.items]) },
    }));
    reportProgress();
    const resizeObserver = new ResizeObserver(reportProgress);
    resizeObserver.observe(board);
    return () => resizeObserver.disconnect();
  }, [slots, portfolioGuided]);

  useEffect(() => {
    latestConfigRef.current = { layout, layerOverrides };
    onConfigChangeRef.current = onConfigChange;
  }, [layerOverrides, layout, onConfigChange]);

  useEffect(() => {
    if (initialConfig || !persistLocal) return;
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            layout?: Partial<LayoutState>;
            layerOverrides?: LayerOverrides;
            slots?: SlotState[];
          };
          if (saved.layout) setLayout({ ...DEFAULT_LAYOUT, ...saved.layout });
          if (saved.layerOverrides) setLayerOverrides(migrateLayerOverrides(saved.layerOverrides));
          if (!playOnly && Array.isArray(saved.slots) && saved.slots.length === 3) setSlots(saved.slots);
        }
      } catch {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialConfig, persistLocal, playOnly]);

  useEffect(() => {
    if (!hydrated || playOnly) return;
    const timer = window.setTimeout(() => {
      if (persistLocal) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ layout, layerOverrides }),
        );
      }
      onConfigChange?.({ layout, layerOverrides });
      setSaveLabel('已自动保存');
    }, 180);
    return () => window.clearTimeout(timer);
  }, [hydrated, layerOverrides, layout, onConfigChange, persistLocal, playOnly]);

  useEffect(() => () => {
    if (saveLabelTimerRef.current !== null) window.clearTimeout(saveLabelTimerRef.current);
    if (!playOnly) onConfigChangeRef.current?.(latestConfigRef.current);
  }, [playOnly]);

  useEffect(() => {
    const canComplete = mode === 'play' || playOnly;
    if (canComplete && complete && !previousCompleteRef.current) onComplete?.();
    if (canComplete && complete !== previousCompleteRef.current) onCompletionChange?.(complete);
    previousCompleteRef.current = canComplete && complete;
  }, [complete, mode, onComplete, onCompletionChange, playOnly]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = ((event.clientX - drag.startX) / drag.rect.width) * 100;
      const dy = ((event.clientY - drag.startY) / drag.rect.height) * 100;

      if (drag.kind === 'layout') {
        setLayout((current) => ({
          ...current,
          [drag.id]: {
            ...current[drag.id],
            x: clamp(drag.origin.x + dx, -5, 100),
            y: clamp(drag.origin.y + dy, -5, 100),
          },
        }));
      } else {
        setLayerOverrides((current) => ({
          ...current,
          [drag.storageKey]: {
            ...drag.origin,
            x: clamp(drag.origin.x + dx, -30, 130),
            y: clamp(drag.origin.y + dy, -30, 130),
          },
        }));
      }
    };
    const onPointerUp = () => {
      dragRef.current = null;
      document.body.classList.remove('is-dragging-layout');
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const getEffectiveLayer = (slotIndex: number, descriptor: LayerDescriptor): LayerValue =>
    layerOverrides[overrideKey(slotIndex, descriptor.key)] ?? {
      x: descriptor.x,
      y: descriptor.y,
      w: descriptor.w,
      z: descriptor.z,
    };

  const categoryScenarios = PRESET_SCENARIOS.filter((scenario) => scenario.category === presetCategory);
  const selectedPreset = PRESET_SCENARIOS.find((scenario) => scenario.id === selectedPresetId) ?? categoryScenarios[0] ?? PRESET_SCENARIOS[0];
  const presetLayers = getSceneLayers({ items: selectedPreset.items });
  const selectedPresetDescriptor = presetLayers.find((layer) => layer.key === presetLayerKey) ?? presetLayers.find((layer) => layer.key === selectedPreset.focusKey) ?? presetLayers[0] ?? null;
  const selectedPresetValue = selectedPresetDescriptor ? getEffectiveLayer(-1, selectedPresetDescriptor) : null;

  const selectPresetScenario = (scenario: PresetScenario) => {
    setSelectedPresetId(scenario.id);
    setPresetLayerKey(scenario.focusKey);
  };

  const beginPresetLayerDrag = (descriptor: LayerDescriptor, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (mode !== 'edit' || event.button !== 0) return;
    const viewport = event.currentTarget.parentElement;
    if (!viewport) return;
    event.preventDefault();
    event.stopPropagation();
    const storageKey = overrideKey(-1, descriptor.key);
    const origin = getEffectiveLayer(-1, descriptor);
    setPresetLayerKey(descriptor.key);
    dragRef.current = {
      kind: 'layer',
      storageKey,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      rect: viewport.getBoundingClientRect(),
    };
    document.body.classList.add('is-dragging-layout');
  };

  const beginLayoutDrag = (id: LayoutId, event: ReactPointerEvent<HTMLElement>) => {
    if (mode !== 'edit' || event.button !== 0 || !boardRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    setSelection({ kind: 'layout', id });
    dragRef.current = {
      kind: 'layout',
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...layout[id] },
      rect: boardRef.current.getBoundingClientRect(),
    };
    document.body.classList.add('is-dragging-layout');
  };

  const beginLayerDrag = (
    slotIndex: number,
    descriptor: LayerDescriptor,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (mode !== 'edit' || event.button !== 0) return;
    const viewport = event.currentTarget.parentElement;
    if (!viewport) return;
    event.preventDefault();
    event.stopPropagation();
    const storageKey = overrideKey(slotIndex, descriptor.key);
    const origin = getEffectiveLayer(slotIndex, descriptor);
    setSelection({ kind: 'layer', slot: slotIndex, key: descriptor.key, label: descriptor.label });
    dragRef.current = {
      kind: 'layer',
      storageKey,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      rect: viewport.getBoundingClientRect(),
    };
    document.body.classList.add('is-dragging-layout');
  };

  const commitSlots = (next: SlotState[]) => {
    if (next === slots) return;
    setHistory((current) => [...current.slice(-29), slots.map((slot) => ({ items: [...slot.items] }))]);
    setSlots(next);
  };

  const dropItem = (slotIndex: number, item: ItemId) => {
    if (portfolioGuided && slotIndex === 0) return;
    commitSlots(placeItem(slots, slotIndex, item));
    setSelectedChoice(null);
    setHoverSlot(null);
  };

  const handleDrop = (slotIndex: number, event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const item = event.dataTransfer.getData('text/plain') as ItemId;
    if (CHOICE_ORDER.includes(item)) dropItem(slotIndex, item);
  };

  const handleChoiceClick = (item: ItemId) => {
    if (mode !== 'play') {
      setSelection({ kind: 'layout', id: CHOICE_LAYOUT[item] });
      return;
    }

    setSelectedChoice(item);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setSlots(previous);
    setHistory((current) => current.slice(0, -1));
    setSelectedChoice(null);
  };

  const clearScenes = () => {
    if (slots.every((slot) => !slot.items.length)) return;
    commitSlots(portfolioGuided ? [{ items: ['lake', 'waner', 'taiping'] }, { items: ['banquet', 'waner'] }, { items: [] }] : EMPTY_SLOTS());
    setSelectedChoice(portfolioGuided ? 'taiping' : null);
  };

  const clearSlot = (slotIndex: number) => {
    if (!slots[slotIndex]?.items.length) return;
    const next = slots.map((slot, index) => (
      index === slotIndex ? { items: [] } : { items: [...slot.items] }
    ));
    commitSlots(next);
    setSelectedChoice(null);
    setHoverSlot(null);
  };

  const saveAll = async (message = '全部设置已保存', resetLabel = true) => {
    const config = { layout, layerOverrides };
    latestConfigRef.current = config;
    if (saveLabelTimerRef.current !== null) window.clearTimeout(saveLabelTimerRef.current);
    try {
      if (persistLocal) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      }
      onConfigChangeRef.current?.(config);
      await onSave?.(config);
    } catch {
      setSaveLabel('保存失败，请重试');
      return false;
    }
    setSaveLabel(message);
    if (resetLabel) {
      saveLabelTimerRef.current = window.setTimeout(() => {
        setSaveLabel('已自动保存');
        saveLabelTimerRef.current = null;
      }, 1400);
    }
    return true;
  };

  const enterPlay = async () => {
    await saveAll('已保存，进入试玩');
    editorSlotsRef.current = slots.map((slot) => ({ items: [...slot.items] }));
    previousCompleteRef.current = false;
    setMode('play');
    setSlots(EMPTY_SLOTS());
    setHistory([]);
    setSelection(null);
    setSelectedChoice(null);
  };

  const exitPlay = () => {
    setMode('edit');
    if (editorSlotsRef.current) setSlots(editorSlotsRef.current);
    editorSlotsRef.current = null;
    setSelection({ kind: 'layout', id: 'slot-0' });
    setSelectedChoice(null);
    setHoverSlot(null);
  };

  const resetEditor = () => {
    if (!window.confirm('恢复默认布局与图层设置？当前调整会被覆盖。')) return;
    setLayout({ ...DEFAULT_LAYOUT });
    setLayerOverrides({});
    setSlots(SAMPLE_SLOTS.map((slot) => ({ items: [...slot.items] })));
    setHistory([]);
    setSelection({ kind: 'layout', id: 'prompt' });
    setPresetCategory('lake');
    setSelectedPresetId('lake-complete');
    setPresetLayerKey('scene-composite-lake');
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const saveAndBack = async () => {
    await saveAll('已保存', false);
    onBack?.();
  };

  const selectedLayout = selection?.kind === 'layout' ? layout[selection.id] : null;
  const selectedLayerDescriptor =
    selection?.kind === 'layer'
      ? getSceneLayers(slots[selection.slot]).find((layer) => layer.key === selection.key) ?? null
      : null;
  const selectedLayerValue =
    selection?.kind === 'layer' && selectedLayerDescriptor
      ? getEffectiveLayer(selection.slot, selectedLayerDescriptor)
      : null;

  const activeSlot = (() => {
    if (selection?.kind === 'layer') return selection.slot;
    if (selection?.kind === 'layout' && selection.id.startsWith('slot-')) {
      return Number(selection.id.split('-')[1]);
    }
    return null;
  })();

  const updateLayoutValue = (field: keyof LayoutValue, value: number) => {
    if (selection?.kind !== 'layout') return;
    const next = field === 'w' ? clamp(value, 3, 110) : clamp(value, -20, 120);
    setLayout((current) => ({
      ...current,
      [selection.id]: { ...current[selection.id], [field]: next },
    }));
  };

  const updateLayerValue = (field: keyof LayerValue, value: number) => {
    if (selection?.kind !== 'layer' || !selectedLayerDescriptor || !selectedLayerValue) return;
    const next =
      field === 'w'
        ? clamp(value, 3, 160)
        : field === 'z'
          ? Math.round(clamp(value, 0, 200))
          : clamp(value, -50, 150);
    setLayerOverrides((current) => ({
      ...current,
      [overrideKey(selection.slot, selection.key)]: { ...selectedLayerValue, [field]: next },
    }));
  };

  const updatePresetLayerValue = (field: keyof LayerValue, value: number) => {
    if (!selectedPresetDescriptor || !selectedPresetValue) return;
    const next =
      field === 'w'
        ? clamp(value, 3, 160)
        : field === 'z'
          ? Math.round(clamp(value, 0, 200))
          : clamp(value, -50, 150);
    setLayerOverrides((current) => ({
      ...current,
      [overrideKey(-1, selectedPresetDescriptor.key)]: { ...selectedPresetValue, [field]: next },
    }));
  };

  const resetPresetLayer = () => {
    if (!selectedPresetDescriptor) return;
    const key = overrideKey(-1, selectedPresetDescriptor.key);
    setLayerOverrides((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const resetSelected = () => {
    if (selection?.kind === 'layout') {
      setLayout((current) => ({ ...current, [selection.id]: { ...DEFAULT_LAYOUT[selection.id] } }));
    } else if (selection?.kind === 'layer') {
      const key = overrideKey(selection.slot, selection.key);
      setLayerOverrides((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const layoutStyle = (id: LayoutId): CSSProperties => ({
    left: `${layout[id].x}%`,
    top: `${layout[id].y}%`,
    width: `${layout[id].w}%`,
  });

  const layoutIsActive = (id: LayoutId) => {
    if (mode !== 'edit') return false;
    if (selection?.kind === 'layout') return selection.id === id;
    if (selection?.kind === 'layer' && id.startsWith('slot-')) {
      return Number(id.split('-')[1]) === selection.slot;
    }
    return false;
  };

  return (
    <div className={`editor-shell level-five-editor level-three-editor mode-${mode} ${mode === 'play' && complete ? 'is-level-complete' : ''} ${mode === 'play' && complete && initiallyComplete ? 'is-restored-complete' : ''} ${playOnly ? 'level-five-play-only level-three-play-only' : ''} ${previewOnly ? 'level-embedded-preview' : ''}`}>
      {!playOnly && (
      <header className="app-bar">
        <div className="brand-block">
          {onBack && !playOnly && (
            <button className="back-to-story-button" type="button" onClick={saveAndBack} aria-label="保存并返回整站编辑器">←</button>
          )}
          <span className="brand-seal">婉</span>
          <div>
            <p className="eyebrow">第三关 · 共游同宴</p>
            <h1>{mode === 'edit' ? editSurface === 'presets' ? '全部场景预设' : '关卡页面布局' : '第三关试玩'}</h1>
          </div>
        </div>

        {mode === 'edit' ? (
          <div className="app-actions">
            <span className="save-state"><i /> {saveLabel}</span>
            <div className="level-edit-switch" aria-label="第三关编辑内容">
              <button className={editSurface === 'presets' ? 'is-active' : ''} type="button" onClick={() => setEditSurface('presets')}>场景预设</button>
              <button className={editSurface === 'layout' ? 'is-active' : ''} type="button" onClick={() => setEditSurface('layout')}>页面布局</button>
            </div>
            <button className="ghost-button save-all-presets" type="button" onClick={() => saveAll()}>保存全部设置</button>
            <button className="ghost-button" type="button" onClick={resetEditor}>还原默认</button>
            <button className="play-button" type="button" onClick={enterPlay}><span>▶</span> 试玩</button>
          </div>
        ) : (
          <div className="app-actions play-actions">
            <span className="play-status">试玩模式 · 双人加对应场景会显示完整画面</span>
            <button className="ghost-button" type="button" onClick={undo} disabled={!history.length}>撤销</button>
            <button className="ghost-button" type="button" onClick={clearScenes}>清空</button>
            <button className="play-button exit-button" type="button" onClick={exitPlay}>退出试玩</button>
          </div>
        )}
      </header>
      )}

      {mode === 'edit' && editSurface === 'presets' ? (
        <div className="preset-editor-workspace">
          <aside className="preset-browser">
            <p className="panel-kicker">无需进入试玩</p>
            <h2>所有场景可能性</h2>
            <div className="preset-category-list">
              {PRESET_CATEGORIES.map((category) => {
                const scenarios = PRESET_SCENARIOS.filter((scenario) => scenario.category === category.id);
                return (
                  <button
                    className={presetCategory === category.id ? 'is-active' : ''}
                    type="button"
                    key={category.id}
                    onClick={() => {
                      setPresetCategory(category.id);
                      if (scenarios[0]) selectPresetScenario(scenarios[0]);
                    }}
                  >
                    <span><b>{category.label}</b><small>{category.summary}</small></span>
                    <em>{scenarios.length}</em>
                  </button>
                );
              })}
            </div>
            <div className="preset-case-list">
              <div className="subpanel-title"><span>本分类全部预览</span><small>{categoryScenarios.length}</small></div>
              {categoryScenarios.map((scenario) => (
                <button
                  className={selectedPreset.id === scenario.id ? 'is-active' : ''}
                  type="button"
                  key={scenario.id}
                  onClick={() => selectPresetScenario(scenario)}
                >
                  <span>{scenario.label}</span>
                  <small>{scenario.reuse}</small>
                </button>
              ))}
            </div>
          </aside>

          <section className="preset-stage" aria-label="场景预设编辑画布">
            <div className="preset-stage-heading">
              <div>
                <small>{PRESET_CATEGORIES.find((category) => category.id === selectedPreset.category)?.label}</small>
                <h2>{selectedPreset.label}</h2>
                <p>{selectedPreset.description}</p>
              </div>
              <span>{selectedPreset.reuse}</span>
            </div>
            <div className="preset-preview-frame">
              <div className="preset-scene">
                <div className="scene-viewport">
                  <div className="scene-artwork-clip">
                    {presetLayers.filter((layer) => layer.key !== 'frame' && layer.key !== 'empty').map((layer) => (
                      <SceneLayer
                        key={layer.key}
                        descriptor={layer}
                        value={getEffectiveLayer(-1, layer)}
                        selected={selectedPresetDescriptor?.key === layer.key}
                        mode="edit"
                        allowPassive={layer.key === selectedPresetDescriptor?.key}
                        onPointerDown={(event) => beginPresetLayerDrag(layer, event)}
                      />
                    ))}
                  </div>
                  {presetLayers.filter((layer) => layer.key === 'frame' || layer.key === 'empty').map((layer) => (
                    <SceneLayer
                      key={layer.key}
                      descriptor={layer}
                      value={getEffectiveLayer(-1, layer)}
                      selected={selectedPresetDescriptor?.key === layer.key}
                      mode="edit"
                      allowPassive={layer.key === selectedPresetDescriptor?.key}
                      onPointerDown={(event) => beginPresetLayerDrag(layer, event)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="preset-layer-picker">
              <span>这张预览里的图层</span>
              <div>
                {presetLayers.slice().sort((a, b) => b.z - a.z).map((layer) => (
                  <button
                    type="button"
                    className={selectedPresetDescriptor?.key === layer.key ? 'is-active' : ''}
                    key={layer.key}
                    onClick={() => setPresetLayerKey(layer.key)}
                  >
                    <b>{layer.label}</b>
                    <small>层 {getEffectiveLayer(-1, layer).z}</small>
                  </button>
                ))}
              </div>
            </div>
            <p className="preset-stage-note">直接拖动画面中的图片调整位置；右侧可精确修改 X、Y、大小与层级。共享图层只保存一份，其他组合会立即同步。</p>
          </section>

          <aside className="preset-inspector">
            {selectedPresetDescriptor && selectedPresetValue ? (
              <>
                <div className="inspector-title">
                  <span>{selectedPresetDescriptor.label}</span>
                  <span className="inspector-badge">全局共享</span>
                </div>
                <div className="preset-impact-note">
                  <b>影响范围</b>
                  <p>{selectedPreset.reuse}。同一语义图片不需要在其他组合中重新调整。</p>
                </div>
                <section className="control-section">
                  <h3>位置</h3>
                  <div className="control-grid">
                    <NumericControl label="X" value={selectedPresetValue.x} onChange={(value) => updatePresetLayerValue('x', value)} />
                    <NumericControl label="Y" value={selectedPresetValue.y} onChange={(value) => updatePresetLayerValue('y', value)} />
                  </div>
                  <button className="text-control-button" type="button" onClick={() => updatePresetLayerValue('x', (100 - selectedPresetValue.w) / 2)}>水平居中</button>
                </section>
                <section className="control-section">
                  <h3>展示大小</h3>
                  <NumericControl label="宽度 %" value={selectedPresetValue.w} onChange={(value) => updatePresetLayerValue('w', value)} />
                  <input
                    className="size-slider"
                    type="range"
                    min="3"
                    max="160"
                    step="0.1"
                    value={selectedPresetValue.w}
                    onChange={(event) => updatePresetLayerValue('w', Number(event.target.value))}
                    aria-label="预设图层宽度"
                  />
                </section>
                <section className="control-section">
                  <h3>图层顺序</h3>
                  <NumericControl label="层级" value={selectedPresetValue.z} step={1} onChange={(value) => updatePresetLayerValue('z', value)} />
                  <div className="layer-buttons">
                    <button type="button" onClick={() => updatePresetLayerValue('z', selectedPresetValue.z + 1)}>移到上一层</button>
                    <button type="button" onClick={() => updatePresetLayerValue('z', selectedPresetValue.z - 1)}>移到下一层</button>
                  </div>
                </section>
                <section className="control-section">
                  <button className="wide-control-button" type="button" onClick={resetPresetLayer}>恢复这个共享预设</button>
                  <button className="wide-control-button preset-save-button" type="button" onClick={() => saveAll()}>保存全部设置</button>
                </section>
                <div className="preset-count-note">当前项目已保存 {Object.keys(layerOverrides).length} 项全局图层预设</div>
              </>
            ) : (
              <div className="empty-inspector"><span>⌖</span><h3>选择一个图层</h3><p>点击中间画面中的图片开始调整。</p></div>
            )}
          </aside>
        </div>
      ) : (
      <div className="workspace">
        {mode === 'edit' && (
          <aside className="left-panel">
            <p className="panel-kicker">页面元素</p>
            <h2>布局与图层</h2>
            <div className="layout-list">
              {LAYOUT_LIST.map((item) => (
                <button
                  className={`layer-row ${selection?.kind === 'layout' && selection.id === item.id ? 'is-active' : ''}`}
                  type="button"
                  key={item.id}
                  onClick={() => setSelection({ kind: 'layout', id: item.id })}
                >
                  <span className="layer-icon">{item.type === '文字' ? '文' : item.type === '容器' ? '景' : '选'}</span>
                  <span><b>{item.label}</b><small>{item.type}</small></span>
                  <em>⌖</em>
                </button>
              ))}
            </div>

            {activeSlot !== null && (
              <div className="scene-layer-list">
                <div className="subpanel-title">
                  <span>全局图层预设 · 当前格 {activeSlot + 1}</span>
                  <small>{getSceneLayers(slots[activeSlot]).length}</small>
                </div>
                {getSceneLayers(slots[activeSlot])
                  .slice()
                  .sort((a, b) => b.z - a.z)
                  .map((layer) => (
                    <button
                      type="button"
                      key={layer.key}
                      className={`inner-layer-row ${selection?.kind === 'layer' && selection.slot === activeSlot && selection.key === layer.key ? 'is-active' : ''}`}
                      onClick={() => setSelection({ kind: 'layer', slot: activeSlot, key: layer.key, label: layer.label })}
                    >
                      <span className="visibility-dot">●</span>
                      <span>{layer.label}</span>
                      <small>{getEffectiveLayer(activeSlot, layer).z}</small>
                    </button>
                  ))}
              </div>
            )}

            <div className="panel-note">
              <b>编辑方式</b>
              <p>拖动页面元素或场景内图片；右侧可精确调整位置、大小和图层。设置会保存在当前浏览器。</p>
            </div>
          </aside>
        )}

        <section className="canvas-wrap" aria-label={mode === 'edit' ? '关卡编辑画布' : 'Puzzle board'}>
          <div className="canvas-topline">
            <span>{mode === 'edit' ? '编辑画布' : '试玩画布'}</span>
            <span>1728 × 1117</span>
            <span className="zoom-pill">自适应</span>
          </div>
          <div className="board-frame">
            <div
              className="game-board"
              ref={boardRef}
              data-choice-count={CHOICE_ORDER.length}
              onPointerDown={() => mode === 'edit' && setSelection(null)}
            >
              <div className="level-chapter-heading" aria-label="Chapter 3：Journeys Together">
                <span>Chapter 3</span>
                <strong>Journeys Together</strong>
              </div>
              <div
                className={`prompt-object layout-object ${layoutIsActive('prompt') ? 'is-selected' : ''}`}
                style={layoutStyle('prompt')}
                onPointerDown={(event) => beginLayoutDrag('prompt', event)}
              >
                <strong><span className="her-name her-name-waner">Waner</span> and <span className="her-name her-name-taiping">Taiping</span> share journeys, banquets, and poetry.</strong>
              </div>

              {slots.map((slot, slotIndex) => {
                const layoutId = `slot-${slotIndex}` as LayoutId;
                const layers = getSceneLayers(slot);
                const slotSelected = layoutIsActive(layoutId);
                return (
                  <div
                    className={`scene-object layout-object ${slotSelected ? 'is-selected' : ''} ${hoverSlot === slotIndex ? 'is-drop-hover' : ''}`}
                    style={layoutStyle(layoutId)}
                    key={layoutId}
                    data-slot-index={slotIndex}
                    role="button"
                    tabIndex={mode === 'play' && !(portfolioGuided && slotIndex === 0) ? 0 : -1}
                    aria-disabled={portfolioGuided && slotIndex === 0 ? true : undefined}
                    aria-label={portfolioGuided && slotIndex === 0 ? 'Scene frame 1, completed example' : `Scene frame ${slotIndex + 1}${mode === 'play' && !selectedChoice && slot.items.length ? ', tap to clear' : ''}`}
                    onClick={() => {
                      if (mode === 'play') {
                        if (portfolioGuided && slotIndex === 0) return;
                        if (selectedChoice) dropItem(slotIndex, selectedChoice);
                        else clearSlot(slotIndex);
                      } else if (mode === 'edit') {
                        setSelection({ kind: 'layout', id: layoutId });
                      }
                    }}
                    onKeyDown={(event) => {
                      if (mode === 'play' && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        if (portfolioGuided && slotIndex === 0) return;
                        if (selectedChoice) dropItem(slotIndex, selectedChoice);
                        else clearSlot(slotIndex);
                      }
                    }}
                    onDragOver={(event) => {
                      if (mode !== 'play' || (portfolioGuided && slotIndex === 0)) return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                      setHoverSlot(slotIndex);
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverSlot(null);
                    }}
                    onDrop={(event) => { if (!(portfolioGuided && slotIndex === 0)) handleDrop(slotIndex, event); }}
                  >
                    <div className="scene-viewport">
                      <div className="scene-artwork-clip">
                        {layers.filter((layer) => layer.key !== 'frame' && layer.key !== 'empty').map((layer) => (
                          <SceneLayer
                            key={layer.key}
                            descriptor={layer}
                            value={getEffectiveLayer(slotIndex, layer)}
                            selected={selection?.kind === 'layer' && selection.slot === slotIndex && selection.key === layer.key}
                            mode={mode}
                            onPointerDown={(event) => beginLayerDrag(slotIndex, layer, event)}
                          />
                        ))}
                      </div>
                      {layers.filter((layer) => layer.key === 'frame' || layer.key === 'empty').map((layer) => (
                        <SceneLayer
                          key={layer.key}
                          descriptor={layer}
                          value={getEffectiveLayer(slotIndex, layer)}
                          selected={selection?.kind === 'layer' && selection.slot === slotIndex && selection.key === layer.key}
                          mode={mode}
                          onPointerDown={(event) => beginLayerDrag(slotIndex, layer, event)}
                        />
                      ))}
                    </div>
                    {mode === 'edit' && (
                      <button
                        type="button"
                        className="layout-drag-handle"
                        aria-label={`Move frame ${slotIndex + 1}`}
                        onPointerDown={(event) => beginLayoutDrag(layoutId, event)}
                      >
                        {slotIndex + 1}
                      </button>
                    )}
                    {mode === 'play' && selectedChoice && !(portfolioGuided && slotIndex === 0) && (
                      <span className="click-drop-label">Place here</span>
                    )}
                    {mode === 'play' && !selectedChoice && slot.items.length > 0 && !(portfolioGuided && slotIndex === 0) && (
                      <span className="click-drop-label clear-slot-label">Tap to clear</span>
                    )}
                  </div>
                );
              })}

              <p className="level-choice-instruction">{portfolioGuided ? 'Add Taiping to the banquet. Then build the poetry scene.' : 'Choose an icon, then a frame. Reconstruct all three scenes to continue.'}</p>
              <img className="level-choice-frame" src={`${ROOT}/choice-area-frame.png`} alt="" draggable={false} />

              {CHOICE_ORDER.map((item, choiceIndex) => {
                const layoutId = CHOICE_LAYOUT[item];
                const isChoiceSelected = selectedChoice === item;
                return (
                  <div
                    className={`choice-object layout-object ${layoutIsActive(layoutId) ? 'is-selected' : ''}`}
                    style={mode === 'play'
                      ? autoChoiceLayoutStyle(choiceIndex, CHOICE_ORDER.length, layout[layoutId].w)
                      : layoutStyle(layoutId)}
                    key={item}
                    data-choice-index={choiceIndex}
                    onPointerDown={mode === 'edit' ? (event) => beginLayoutDrag(layoutId, event) : undefined}
                  >
                    <button
                      type="button"
                      className={`choice-button ${isChoiceSelected ? 'is-choice-selected' : ''}`}
                      disabled={mode === 'play' && complete}
                      draggable={mode === 'play' && !complete}
                      onClick={() => handleChoiceClick(item)}
                      onDragStart={(event) => {
                        if (mode !== 'play') return;
                        event.dataTransfer.setData('text/plain', item);
                        event.dataTransfer.effectAllowed = 'move';
                        setSelectedChoice(item);
                      }}
                      onDragEnd={() => setHoverSlot(null)}
                      aria-label={`${CHOICE_META[item].label}; reusable in each frame`}
                    >
                      <img className="choice-artwork" src={CHOICE_META[item].src} alt={CHOICE_META[item].label} draggable={false} />
                      <span className="choice-caption">
                        {CHOICE_META[item].label}
                      </span>
                    </button>
                  </div>
                );
              })}

              {mode === 'play' && (
                <LevelPlayAssist
                  hints={LEVEL_HINTS}
                  slotLayouts={[layout['slot-0'], layout['slot-1'], layout['slot-2']]}
                  promptLayout={layout.prompt}
                  undoDisabled={!history.length}
                  onUndo={undo}
                  onRestart={clearScenes}
                  showHistoryControls={playOnly}
                  complete={complete}
                  completionCaptions={LEVEL_COMPLETION_CAPTIONS}
                  onRevealAnswer={() => {
                    setSlots(SAMPLE_SLOTS.map((slot) => ({ items: [...slot.items] })));
                    setHistory([]);
                    setSelectedChoice(null);
                    setHoverSlot(null);
                  }}
                />
              )}
            </div>
          </div>
          <p className="canvas-hint">
            {mode === 'edit'
              ? '选中并拖动元素；场景图片也可以直接拖动，右侧支持精确数值调整'
              : 'Complete all three scenes to unlock the next part.'}
          </p>
        </section>

        {mode === 'edit' && (
          <aside className="right-panel">
            {selection?.kind === 'layout' && selectedLayout ? (
              <>
                <div className="inspector-title">
                  <span>{LAYOUT_LIST.find((item) => item.id === selection.id)?.label}</span>
                  <span className="inspector-badge">页面元素</span>
                </div>
                <section className="control-section">
                  <h3>位置</h3>
                  <div className="control-grid">
                    <NumericControl label="X" value={selectedLayout.x} onChange={(value) => updateLayoutValue('x', value)} />
                    <NumericControl label="Y" value={selectedLayout.y} onChange={(value) => updateLayoutValue('y', value)} />
                  </div>
                </section>
                <section className="control-section">
                  <h3>展示大小</h3>
                  <NumericControl label="宽度 %" value={selectedLayout.w} onChange={(value) => updateLayoutValue('w', value)} />
                  <input
                    className="size-slider"
                    type="range"
                    min="3"
                    max="100"
                    step="0.1"
                    value={selectedLayout.w}
                    onChange={(event) => updateLayoutValue('w', Number(event.target.value))}
                    aria-label="展示宽度"
                  />
                </section>
                <section className="control-section">
                  <button className="wide-control-button" type="button" onClick={resetSelected}>恢复这个元素</button>
                </section>
              </>
            ) : selection?.kind === 'layer' && selectedLayerValue ? (
              <>
                <div className="inspector-title">
                  <span>{selection.label}</span>
                  <span className="inspector-badge">全局图层预设</span>
                </div>
                <section className="control-section">
                  <h3>位置</h3>
                  <div className="control-grid">
                    <NumericControl label="X" value={selectedLayerValue.x} onChange={(value) => updateLayerValue('x', value)} />
                    <NumericControl label="Y" value={selectedLayerValue.y} onChange={(value) => updateLayerValue('y', value)} />
                  </div>
                  <button
                    className="text-control-button"
                    type="button"
                    onClick={() => updateLayerValue('x', (100 - selectedLayerValue.w) / 2)}
                  >
                    水平居中
                  </button>
                </section>
                <section className="control-section">
                  <h3>展示大小</h3>
                  <NumericControl label="宽度 %" value={selectedLayerValue.w} onChange={(value) => updateLayerValue('w', value)} />
                  <input
                    className="size-slider"
                    type="range"
                    min="3"
                    max="150"
                    step="0.1"
                    value={selectedLayerValue.w}
                    onChange={(event) => updateLayerValue('w', Number(event.target.value))}
                    aria-label="图层宽度"
                  />
                </section>
                <section className="control-section">
                  <h3>图层顺序</h3>
                  <NumericControl label="层级" value={selectedLayerValue.z} step={1} onChange={(value) => updateLayerValue('z', value)} />
                  <div className="layer-buttons">
                    <button type="button" onClick={() => updateLayerValue('z', selectedLayerValue.z + 1)}>移到上一层</button>
                    <button type="button" onClick={() => updateLayerValue('z', selectedLayerValue.z - 1)}>移到下一层</button>
                  </div>
                </section>
                <section className="control-section">
                  <button className="wide-control-button" type="button" onClick={resetSelected}>恢复这个图层</button>
                </section>
              </>
            ) : (
              <div className="empty-inspector">
                <span>⌖</span>
                <h3>选择一个元素</h3>
                <p>点击画布、左侧列表或场景中的图片，即可调整它的位置、大小与层级。</p>
              </div>
            )}
          </aside>
        )}
      </div>
      )}
    </div>
  );
}
