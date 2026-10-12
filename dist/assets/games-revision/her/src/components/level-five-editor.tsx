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
import type { LevelFiveConfig } from '@/lib/studio-types';
import { autoChoiceLayoutStyle } from '@/lib/choice-auto-layout';
import LevelPlayAssist from './level-play-assist';

const LEVEL_HINTS = [
  'Zhongzong dies.',
  'Waner and Taiping draft the final edict.',
  'Empress Wei, Li Chongmao, and Li Dan share power.',
];

const LEVEL_COMPLETION_CAPTIONS = [
  'Emperor Zhongzong dies.',
  'Waner and Taiping draft the final edict.',
  'They propose a balance between Wei, Chongmao, and Li Dan.',
];

type CharacterId = 'waner' | 'taiping' | 'chongmao' | 'zhongzong' | 'weihou' | 'lidan';
type ItemId = CharacterId | 'death' | 'balance' | 'edict';
type LayoutId =
  | 'prompt'
  | 'slot-0'
  | 'slot-1'
  | 'slot-2'
  | 'choice-waner'
  | 'choice-taiping'
  | 'choice-chongmao'
  | 'choice-zhongzong'
  | 'choice-weihou'
  | 'choice-lidan'
  | 'choice-death'
  | 'choice-balance'
  | 'choice-edict';

type SlotState = { items: ItemId[] };
type LayoutValue = { x: number; y: number; w: number };
type LayoutState = Record<LayoutId, LayoutValue>;
type LayerValue = { x: number; y: number; w: number; z: number };
type LayerOverrides = Record<string, LayerValue>;
type LayerKind = 'natural' | 'cover' | 'portrait';
type PresetCategoryId = 'death' | 'people' | 'pairs' | 'balance' | 'triple' | 'edict' | 'utility';
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
  filter?: string;
  clipPath?: string;
  interactive?: boolean;
};
type Selection =
  | { kind: 'layout'; id: LayoutId }
  | { kind: 'layer'; slot: number; key: string; label: string }
  | null;

const ROOT = '/assets/games-revision/her/game';
const LEVEL_ROOT = `${ROOT}/level-five`;
const NORMALIZED_CHOICE_ROOT = `${ROOT}/choice-normalized`;
const CHARACTER_IDS: CharacterId[] = ['waner', 'taiping', 'chongmao', 'zhongzong', 'weihou', 'lidan'];
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
    death: string;
    button: string;
    background: string;
    tripleBackground: string;
    sideWidth: number;
    generatedDeath?: boolean;
  }
> = {
  waner: {
    label: 'Waner',
    side: `${ROOT}/shangguan-waner-close-side.png`,
    death: `${ROOT}/death/shangguan-waner-death-avatar.png`,
    button: `${ROOT}/level-three/shangguan-waner-choice.png`,
    background: `${ROOT}/solid-scene-shangguan-waner.png`,
    tripleBackground: `${ROOT}/solid-scene-shangguan-waner.png`,
    sideWidth: 51.4,
  },
  taiping: {
    label: 'Taiping',
    side: `${ROOT}/princess-taiping-close-side.png`,
    death: `${ROOT}/death/princess-taiping-death-avatar.png`,
    button: `${ROOT}/level-three/princess-taiping-choice.png`,
    background: `${ROOT}/solid-scene-princess-taiping.png`,
    tripleBackground: `${ROOT}/solid-scene-princess-taiping.png`,
    sideWidth: 51.4,
  },
  chongmao: {
    label: 'Li Chongmao',
    side: `${ROOT}/li-chongmao-close-side.png`,
    death: `${ROOT}/death/li-chongmao-death-avatar.png`,
    button: `${LEVEL_ROOT}/li-chongmao-choice.png`,
    background: `${ROOT}/solid-scene-generic.png`,
    tripleBackground: `${ROOT}/solid-scene-shangguan-waner.png`,
    sideWidth: 51.4,
  },
  zhongzong: {
    label: 'Zhongzong',
    side: `${ROOT}/emperor-zhongzong-close-side.png`,
    death: `${ROOT}/death/emperor-zhongzong-death-avatar.png`,
    button: `${LEVEL_ROOT}/emperor-zhongzong-choice.png`,
    background: `${ROOT}/solid-scene-generic.png`,
    tripleBackground: `${ROOT}/solid-scene-generic.png`,
    sideWidth: 58.4,
  },
  weihou: {
    label: 'Empress Wei',
    side: `${LEVEL_ROOT}/empress-wei-close-side.png`,
    death: `${LEVEL_ROOT}/empress-wei-choice.png`,
    button: `${LEVEL_ROOT}/empress-wei-choice.png`,
    background: `${LEVEL_ROOT}/empress-wei-background.png`,
    tripleBackground: `${LEVEL_ROOT}/empress-wei-background.png`,
    sideWidth: 51.4,
    generatedDeath: true,
  },
  lidan: {
    label: 'Li Dan',
    side: `${LEVEL_ROOT}/li-dan-close-side.png`,
    death: `${LEVEL_ROOT}/li-dan-choice.png`,
    button: `${LEVEL_ROOT}/li-dan-choice.png`,
    background: `${ROOT}/solid-scene-generic.png`,
    tripleBackground: `${ROOT}/solid-scene-generic.png`,
    sideWidth: 51.4,
    generatedDeath: true,
  },
};

const CHOICE_META: Record<ItemId, { label: string; src: string }> = {
  waner: { label: 'Waner', src: `${NORMALIZED_CHOICE_ROOT}/shangguan-waner.png` },
  taiping: { label: 'Taiping', src: `${NORMALIZED_CHOICE_ROOT}/princess-taiping.png` },
  chongmao: { label: 'Li Chongmao', src: `${NORMALIZED_CHOICE_ROOT}/li-chongmao.png` },
  zhongzong: { label: 'Zhongzong', src: `${NORMALIZED_CHOICE_ROOT}/emperor-zhongzong.png` },
  weihou: { label: 'Empress Wei', src: `${NORMALIZED_CHOICE_ROOT}/empress-wei.png` },
  lidan: { label: 'Li Dan', src: `${NORMALIZED_CHOICE_ROOT}/li-dan.png` },
  death: { label: 'Death', src: `${NORMALIZED_CHOICE_ROOT}/death.png` },
  balance: { label: 'Balance', src: `${NORMALIZED_CHOICE_ROOT}/balance.png` },
  edict: { label: 'Edict', src: `${NORMALIZED_CHOICE_ROOT}/edict.png` },
};

const CHOICE_ORDER: ItemId[] = ['waner', 'taiping', 'chongmao', 'zhongzong', 'weihou', 'lidan', 'death', 'balance', 'edict'];
const CHOICE_LAYOUT: Record<ItemId, LayoutId> = {
  waner: 'choice-waner',
  taiping: 'choice-taiping',
  chongmao: 'choice-chongmao',
  zhongzong: 'choice-zhongzong',
  weihou: 'choice-weihou',
  lidan: 'choice-lidan',
  death: 'choice-death',
  balance: 'choice-balance',
  edict: 'choice-edict',
};

const DEFAULT_LAYOUT: LayoutState = {
  prompt: { x: 23.67, y: 13.25, w: 52.6 },
  'slot-0': { x: 3.01, y: 22.74, w: 30.73 },
  'slot-1': { x: 34.49, y: 22.74, w: 30.73 },
  'slot-2': { x: 65.97, y: 22.74, w: 30.73 },
  'choice-waner': { x: 4, y: 69, w: 8.5 },
  'choice-taiping': { x: 14.5, y: 69, w: 8.5 },
  'choice-chongmao': { x: 25, y: 69, w: 8.5 },
  'choice-zhongzong': { x: 35.5, y: 69, w: 8.5 },
  'choice-weihou': { x: 46, y: 69, w: 8.5 },
  'choice-lidan': { x: 56.5, y: 69, w: 8.5 },
  'choice-death': { x: 67, y: 69, w: 8.5 },
  'choice-balance': { x: 77.5, y: 69, w: 8.5 },
  'choice-edict': { x: 88, y: 69, w: 8.5 },
};

function normalizeLayout(input?: Partial<LayoutState>): LayoutState {
  const normalized = {} as LayoutState;
  (Object.keys(DEFAULT_LAYOUT) as LayoutId[]).forEach((id) => {
    normalized[id] = { ...DEFAULT_LAYOUT[id], ...(input?.[id] ?? {}) };
  });
  return normalized;
}

const SAMPLE_SLOTS: SlotState[] = [
  { items: ['death', 'zhongzong'] },
  { items: ['waner', 'taiping', 'edict'] },
  { items: ['weihou', 'chongmao', 'lidan', 'balance'] },
];

const EMPTY_SLOTS = (): SlotState[] => [{ items: [] }, { items: [] }, { items: [] }];

function normalizeSavedSlot(slot: SlotState): SlotState {
  const rawItems = Array.isArray(slot?.items)
    ? slot.items.filter((item): item is ItemId => CHOICE_ORDER.includes(item as ItemId))
    : [];
  let items = [...new Set(rawItems)];

  if (items.includes('balance') && items.includes('edict')) {
    const keep = rawItems.lastIndexOf('edict') > rawItems.lastIndexOf('balance') ? 'edict' : 'balance';
    items = items.filter((item) => item !== (keep === 'edict' ? 'balance' : 'edict'));
  }

  const characterLimit = items.includes('death') ? 1 : 3;
  let seenCharacters = 0;
  items = items.filter((item) => {
    if (!isCharacter(item)) return true;
    seenCharacters += 1;
    return seenCharacters <= characterLimit;
  });
  return { items };
}

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
  { id: 'death', label: 'Death场景', summary: '共用背景与气泡，六个角色分别检查' },
  { id: 'people', label: '人物左／右', summary: '六个人各有左侧与右侧两个全局位置' },
  { id: 'pairs', label: '普通双人', summary: '全部有方向双人组合，共用左右位置' },
  { id: 'balance', label: '双人Balance', summary: 'Balance大图标与全部双人背对背组合' },
  { id: 'triple', label: '三人三分', summary: '顺时针头像、三分背景、分隔线与中央道具' },
  { id: 'edict', label: 'Edict', summary: '普通画面的大Edict与三人画面的小Edict' },
  { id: 'utility', label: '背景与边框', summary: '空状态、单双人纯色背景与外框' },
];

const rightPreviewItems = (character: CharacterId): ItemId[] => {
  const left = CHARACTER_IDS.find((candidate) => candidate !== character) ?? 'waner';
  return [left, character];
};

const CORRECT_TRIPLE: CharacterId[] = ['weihou', 'chongmao', 'lidan'];

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'death-background',
    category: 'death',
    label: 'Death场景背景',
    description: '前两个格子的Death场景保持原来的画面与层级。',
    reuse: '全部Death组合共用',
    items: ['death'],
    focusKey: 'background-death',
  },
  {
    id: 'death-bubble',
    category: 'death',
    label: 'Death气泡',
    description: '调整一次，会同步到所有角色的Death场景。',
    reuse: '全部Death组合共用',
    items: ['death', 'zhongzong'],
    focusKey: 'death-bubble',
  },
  ...CHARACTER_IDS.map((character): PresetScenario => ({
    id: `death-${character}`,
    category: 'death',
    label: `${CHARACTER_META[character].label} · Death头像`,
    description: CHARACTER_META[character].generatedDeath
      ? '目前没有专用灰色头像，暂以按键头像自动灰度化显示。'
      : '使用已有的专用灰色Death头像。',
    reuse: '所有格子共用',
    items: ['death', character],
    focusKey: `death-portrait-${character}`,
  })),
  ...CHARACTER_IDS.flatMap((character): PresetScenario[] => ([
    {
      id: `left-${character}`,
      category: 'people',
      label: `${CHARACTER_META[character].label} · 左侧`,
      description: '单人画面和所有普通双人组合的左侧都复用这里。',
      reuse: '单人＋全部左侧组合',
      items: [character],
      focusKey: `side-left-${character}`,
    },
    {
      id: `right-${character}`,
      category: 'people',
      label: `${CHARACTER_META[character].label} · 右侧`,
      description: '右侧自动镜像，全部双人组合复用同一位置。',
      reuse: '全部右侧组合',
      items: rightPreviewItems(character),
      focusKey: `side-right-${character}`,
    },
  ])),
  ...CHARACTER_IDS.flatMap((left): PresetScenario[] => CHARACTER_IDS
    .filter((right) => right !== left)
    .map((right): PresetScenario => ({
      id: `pair-${left}-${right}`,
      category: 'pairs',
      label: `${CHARACTER_META[left].label}（左）＋${CHARACTER_META[right].label}（右）`,
      description: '第一个人物在左，第二个人物在右并镜像，两个人面对面。',
      reuse: '复用人物左右位置与左右半背景',
      items: [left, right],
      focusKey: `side-left-${left}`,
    }))),
  {
    id: 'balance-icon',
    category: 'balance',
    label: 'Balance · 双人中央大图标',
    description: '一人或两人时复用第四关的大Balance图标，人物保持在图标上层。',
    reuse: '全部一人／双人Balance组合共用',
    items: ['balance'],
    focusKey: 'balance-large',
  },
  ...CHARACTER_IDS.flatMap((left): PresetScenario[] => CHARACTER_IDS
    .filter((right) => right !== left)
    .map((right): PresetScenario => ({
      id: `balance-pair-${left}-${right}`,
      category: 'balance',
      label: `${CHARACTER_META[left].label}＋${CHARACTER_META[right].label}＋Balance`,
      description: '任意两个人加入Balance后都会背对背：左侧镜像、右侧保持原向，中央显示Balance大图标。',
      reuse: '复用人物左右位置、分栏背景与Balance图标',
      items: [left, right, 'balance'],
      focusKey: `side-left-${left}`,
    }))),
  {
    id: 'triple-correct',
    category: 'triple',
    label: 'Empress Wei → Li Chongmao → Li Dan＋Balance',
    description: '正确第三格：第一人上方、第二人右下、第三人左下，按拖入顺序顺时针排列。',
    reuse: '三人位置与三分背景全局共享',
    items: [...CORRECT_TRIPLE, 'balance'],
    focusKey: 'triple-avatar-top',
  },
  {
    id: 'triple-rotated',
    category: 'triple',
    label: '顺序轮换检查',
    description: '更换拖入顺序后，人物与对应背景一起沿上方、右下、左下顺时针轮换。',
    reuse: '不会建立第二套位置',
    items: ['chongmao', 'lidan', 'weihou', 'balance'],
    focusKey: 'triple-avatar-top',
  },
  ...(['top', 'right', 'left'] as const).map((position): PresetScenario => ({
    id: `triple-avatar-${position}`,
    category: 'triple',
    label: `三人头像 · ${position === 'top' ? '上方' : position === 'right' ? '右下' : '左下'}`,
    description: '三人画面使用按键头像；这里只调整这个顺时针位置，不按角色重复设置。',
    reuse: '所有三人顺序共用',
    items: [...CORRECT_TRIPLE, 'balance'],
    focusKey: `triple-avatar-${position}`,
  })),
  ...(['top', 'right', 'left'] as const).map((position): PresetScenario => ({
    id: `triple-background-${position}`,
    category: 'triple',
    label: `三分背景 · ${position === 'top' ? '上方' : position === 'right' ? '右下' : '左下'}`,
    description: '背景颜色跟随这个位置的人物一起轮换。',
    reuse: '所有三人顺序共用',
    items: [...CORRECT_TRIPLE, 'balance'],
    focusKey: `triple-background-${position}`,
  })),
  {
    id: 'triple-dividers',
    category: 'triple',
    label: '三分分隔线',
    description: '使用左上、右上和中线三张透明素材拼成共同交点。',
    reuse: '全部三人画面共用',
    items: [...CORRECT_TRIPLE, 'balance'],
    focusKey: 'triple-divider-left',
  },
  {
    id: 'triple-balance',
    category: 'triple',
    label: '三人Balance · 中线偏下',
    description: '三人状态下使用较小的Balance图标，位于三线交点下方。',
    reuse: '全部三人Balance组合共用',
    items: [...CORRECT_TRIPLE, 'balance'],
    focusKey: 'triple-balance',
  },
  {
    id: 'edict-plain',
    category: 'edict',
    label: 'Edict · 单人／双人画面',
    description: '前两个格子的Edict位置保持不变，位于背景之上、人物之后。',
    reuse: '全部少于三人的Edict画面共用',
    items: ['waner', 'taiping', 'edict'],
    focusKey: 'edict-large',
  },
  {
    id: 'edict-triple',
    category: 'edict',
    label: '三人＋Edict',
    description: '三人画面把Edict放在Balance的位置。',
    reuse: '全部三人Edict画面共用',
    items: [...CORRECT_TRIPLE, 'edict'],
    focusKey: 'triple-edict',
  },
  {
    id: 'utility-empty',
    category: 'utility',
    label: '空场景占位符',
    description: '三个格子空白时共用。',
    reuse: '三个格子共用',
    items: [],
    focusKey: 'empty',
  },
  ...CHARACTER_IDS.map((character): PresetScenario => ({
    id: `utility-full-background-${character}`,
    category: 'utility',
    label: `${CHARACTER_META[character].label} · 单人底色`,
    description: '图片按人物变化，但全幅背景位置只保存一份。',
    reuse: '六个人物单人底色共享位置',
    items: [character],
    focusKey: `background-${character}`,
  })),
  {
    id: 'utility-left-background',
    category: 'utility',
    label: '双人左半背景',
    description: '所有左半背景只设置一次。',
    reuse: '全部双人组合共用',
    items: ['waner', 'taiping'],
    focusKey: 'background-left-waner',
  },
  {
    id: 'utility-right-background',
    category: 'utility',
    label: '双人右半背景',
    description: '所有右半背景只设置一次。',
    reuse: '全部双人组合共用',
    items: ['waner', 'taiping'],
    focusKey: 'background-right-taiping',
  },
  {
    id: 'utility-frame',
    category: 'utility',
    label: '格子外边框',
    description: 'Scene frame与拖拽 hover 提示共用这一外框位置。',
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

function isWinning(slots: SlotState[]) {
  const expected: ItemId[][] = [
    ['death', 'zhongzong'],
    ['waner', 'taiping', 'edict'],
    ['weihou', 'chongmao', 'lidan', 'balance'],
  ];
  return expected.every((answer, index) => {
    const actual = slots[index].items;
    return actual.length === answer.length && answer.every((item) => actual.includes(item));
  });
}

function placeItem(slots: SlotState[], targetIndex: number, item: ItemId): SlotState[] {
  const next = slots.map((slot) => ({ items: [...slot.items] }));
  let targetItems = [...slots[targetIndex].items];

  if (item === 'balance' || item === 'edict') {
    const counterpart: ItemId = item === 'balance' ? 'edict' : 'balance';
    const alreadySelected = targetItems.includes(item);
    const hadCounterpart = targetItems.includes(counterpart);
    if (alreadySelected && !hadCounterpart) return slots;
    targetItems = targetItems.filter((current) => current !== counterpart);
    if (!alreadySelected) targetItems.push(item);
    next[targetIndex] = { items: targetItems };
    return next;
  }

  if (targetItems.includes(item)) return slots;

  if (isCharacter(item)) {
    const capacity = targetItems.includes('death') ? 1 : 3;
    const characters = targetItems.filter(isCharacter);

    if (capacity === 1 && characters.length) {
      targetItems = targetItems.filter((current) => !isCharacter(current));
    } else if (capacity === 3 && characters.length >= 3) {
      const thirdCharacter = characters[2];
      targetItems = targetItems.filter((current) => current !== thirdCharacter);
    }
    targetItems.push(item);
  } else if (item === 'death') {
    const characters = targetItems.filter(isCharacter);
    if (characters.length > 1) {
      const keep = characters[0];
      targetItems = targetItems.filter((current) => !isCharacter(current) || current === keep);
    }
    targetItems.push(item);
  } else {
    targetItems.push(item);
  }

  next[targetIndex] = { items: targetItems };
  return next;
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

function appendSidePeopleLayers(layers: LayerDescriptor[], characters: CharacterId[], backToBack = false) {
  characters.forEach((characterId, index) => {
    const character = CHARACTER_META[characterId];
    const isRight = index === 1;
    layers.push({
      key: `side-${isRight ? 'right' : 'left'}-${characterId}`,
      label: `${isRight ? '右侧' : '左侧'}人物 · ${character.label}`,
      src: character.side,
      x: isRight ? 100 - character.sideWidth : 0,
      y: 0,
      w: character.sideWidth,
      z: 30,
      kind: 'natural',
      flip: characters.length === 2 && backToBack ? !isRight : isRight,
    });
  });
}

function appendTripleLayers(layers: LayerDescriptor[], characters: CharacterId[]) {
  const positions = [
    { id: 'top', label: '上方', clipPath: 'polygon(0 0, 100% 0, 50% 63%)', x: 35, y: 4, w: 30 },
    { id: 'right', label: '右下', clipPath: 'polygon(100% 0, 50% 63%, 50% 100%, 100% 100%)', x: 71, y: 58, w: 25 },
    { id: 'left', label: '左下', clipPath: 'polygon(0 0, 50% 63%, 50% 100%, 0 100%)', x: 4, y: 58, w: 25 },
  ] as const;

  characters.slice(0, 3).forEach((characterId, index) => {
    const character = CHARACTER_META[characterId];
    const position = positions[index];
    layers.push({
      key: `triple-background-${position.id}`,
      label: `三分背景 · ${position.label} · ${character.label}`,
      src: character.tripleBackground,
      x: 0,
      y: 0,
      w: 100,
      z: 1,
      kind: 'cover',
      clipPath: position.clipPath,
    });
  });

  layers.push(
    {
      key: 'triple-divider-left',
      label: '三分线 · 左上',
      src: `${LEVEL_ROOT}/top-left.png`,
      x: 0,
      y: 0,
      w: 49.9,
      z: 8,
      kind: 'natural',
    },
    {
      key: 'triple-divider-right',
      label: '三分线 · 右上',
      src: `${LEVEL_ROOT}/top-right.png`,
      x: 48.8,
      y: 0,
      w: 51.2,
      z: 8,
      kind: 'natural',
    },
    {
      key: 'triple-divider-center',
      label: '三分线 · 中线',
      src: `${LEVEL_ROOT}/center-line.png`,
      x: 49.6,
      y: 61.9,
      w: 0.8,
      z: 8,
      kind: 'natural',
    },
  );

  characters.slice(0, 3).forEach((characterId, index) => {
    const character = CHARACTER_META[characterId];
    const position = positions[index];
    layers.push({
      key: `triple-avatar-${position.id}`,
      label: `三人头像 · ${position.label} · ${character.label}`,
      src: character.button,
      x: position.x,
      y: position.y,
      w: position.w,
      z: 30,
      kind: 'natural',
    });
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
  const hasDeath = slot.items.includes('death');
  const hasBalance = slot.items.includes('balance');
  const hasEdict = slot.items.includes('edict');
  const isTriple = !hasDeath && characters.length === 3;
  const layers: LayerDescriptor[] = [];

  if (hasDeath) {
    layers.push({
      key: 'background-death',
      label: '场景 · 皇族Death',
      src: `${ROOT}/scene-royal-deaths.png`,
      x: 0,
      y: 0,
      w: 100,
      z: 1,
      kind: 'cover',
    });
  } else if (isTriple) {
    appendTripleLayers(layers, characters);
  } else {
    appendPlainBackgroundLayers(layers, characters);
    appendSidePeopleLayers(layers, characters, hasBalance);
  }

  if (isTriple) {
    if (hasEdict) {
      layers.push({
        key: 'triple-edict',
        label: '三人画面 · Edict',
        src: `${ROOT}/edict-large.png`,
        x: 45,
        y: 61,
        w: 10,
        z: 20,
        kind: 'natural',
      });
    } else if (hasBalance) {
      layers.push({
        key: 'triple-balance',
        label: '三人画面 · Balance',
        src: `${ROOT}/level-four/balance-large-icon.png`,
        x: 38,
        y: 61.5,
        w: 24,
        z: 20,
        kind: 'natural',
      });
    }
  } else if (hasEdict) {
    layers.push({
      key: 'edict-large',
      label: 'Edict · 大图',
      src: `${ROOT}/edict-large.png`,
      x: 24.3,
      y: 0,
      w: 51.4,
      z: 12,
      kind: 'natural',
    });
  } else if (hasBalance) {
    layers.push({
      key: 'balance-large',
      label: 'Balance · 大图标',
      src: `${ROOT}/level-four/balance-large-icon.png`,
      x: 18,
      y: 26,
      w: 64,
      z: 20,
      kind: 'natural',
    });
  }

  if (hasDeath && characters[0]) {
    const character = CHARACTER_META[characters[0]];
    layers.push(
      {
        key: 'death-bubble',
        label: 'Death气泡',
        src: `${ROOT}/bubble.png`,
        x: 57,
        y: 7,
        w: 31.8,
        z: 28,
        kind: 'natural',
      },
      {
        key: `death-portrait-${characters[0]}`,
        label: `灰色头像 · ${character.label}`,
        src: character.death,
        x: 62.4,
        y: 8.8,
        w: 20.5,
        z: 29,
        kind: 'portrait',
        filter: character.generatedDeath ? 'grayscale(1)' : undefined,
      },
    );
  }

  layers.push(FRAME_LAYER);
  return layers;
}

function canonicalLayerKey(rawKey: string) {
  const key = rawKey.replace(/^\d+:/, '');
  if (key.startsWith('v2.') || key.startsWith('v3.')) return key;
  if (key === 'background-death') return 'v2.death.background';
  if (key === 'death-bubble') return 'v2.death.bubble';
  if (key.startsWith('death-portrait-')) return `v2.death.portrait.${key.slice('death-portrait-'.length)}`;
  if (key.startsWith('side-left-')) return `v2.plain.person.left.${key.slice('side-left-'.length)}`;
  if (key.startsWith('side-right-')) return `v2.plain.person.right.${key.slice('side-right-'.length)}`;
  if (key === 'edict-large') return 'v2.prop.edict';
  if (key === 'balance-large') return 'v3.prop.balance.large';
  if (key.startsWith('triple-background-')) return `v3.triple.background.${key.slice('triple-background-'.length)}`;
  if (key.startsWith('triple-avatar-')) return `v3.triple.avatar.${key.slice('triple-avatar-'.length)}`;
  if (key.startsWith('triple-divider-')) return `v3.triple.divider.${key.slice('triple-divider-'.length)}`;
  if (key === 'triple-balance') return 'v3.triple.prop.balance';
  if (key === 'triple-edict') return 'v3.triple.prop.edict';
  if (key === 'empty') return 'v2.slot.empty-placeholder';
  if (key === 'frame') return 'v2.slot.frame';
  if (key === 'background-generic' || /^background-(waner|taiping|chongmao|zhongzong|weihou|lidan)$/.test(key)) return 'v2.plain.background.full';
  if (key.startsWith('background-left-')) return 'v2.plain.background.left-half';
  if (key.startsWith('background-right-')) return 'v2.plain.background.right-half';
  return key;
}

function migrateLayerOverrides(input: LayerOverrides | undefined): LayerOverrides {
  if (!input) return {};
  const migrated: LayerOverrides = {};
  const migrationPriority = (key: string) => {
    if (key.startsWith('v2.') || key.startsWith('v3.')) return 4;
    if (!/^\d+:/.test(key)) return 3;
    const slot = Number(key.split(':')[0]);
    return 2 - (Number.isFinite(slot) ? slot * 0.1 : 0);
  };
  const entries = Object.entries(input).sort(([left], [right]) => migrationPriority(left) - migrationPriority(right));
  entries.forEach(([key, value]) => {
    const canonical = canonicalLayerKey(key);
    if (canonical.startsWith('v2.throne.') || canonical === 'background-power' || canonical.startsWith('throne-')) return;
    migrated[canonical] = value;
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
    clipPath: descriptor.clipPath,
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
        style={descriptor.flip || descriptor.filter ? {
          transform: descriptor.flip ? 'scaleX(-1)' : undefined,
          filter: descriptor.filter,
        } : undefined}
      />
    </button>
  );
}

export type LevelFiveEditorProps = {
  onBack?: () => void;
  onComplete?: () => void;
  onCompletionChange?: (complete: boolean) => void;
  onConfigChange?: (config: LevelFiveConfig) => void;
  onSave?: (config: LevelFiveConfig) => void | Promise<void>;
  initialConfig?: LevelFiveConfig;
  initiallyComplete?: boolean;
  persistLocal?: boolean;
  playOnly?: boolean;
  previewOnly?: boolean;
};

export default function LevelFiveEditor({
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
}: LevelFiveEditorProps) {
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
  const [presetCategory, setPresetCategory] = useState<PresetCategoryId>('death');
  const [selectedPresetId, setSelectedPresetId] = useState('death-bubble');
  const [presetLayerKey, setPresetLayerKey] = useState('death-bubble');
  const [layout, setLayout] = useState<LayoutState>(() => normalizeLayout(initialConfig?.layout as Partial<LayoutState> | undefined));
  const [layerOverrides, setLayerOverrides] = useState<LayerOverrides>(() => migrateLayerOverrides(initialConfig?.layerOverrides));
  const [slots, setSlots] = useState<SlotState[]>(
    playOnly && !previewOnly && !initiallyComplete
      ? EMPTY_SLOTS()
      : SAMPLE_SLOTS.map((slot) => ({ items: [...slot.items] })),
  );
  const [history, setHistory] = useState<SlotState[][]>([]);
  const [selection, setSelection] = useState<Selection>(
    playOnly ? null : { kind: 'layout', id: 'prompt' },
  );
  const [selectedChoice, setSelectedChoice] = useState<ItemId | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(() => Boolean(initialConfig || !persistLocal));
  const [saveLabel, setSaveLabel] = useState('已自动保存');
  const latestConfigRef = useRef<LevelFiveConfig>({ layout, layerOverrides });
  const onConfigChangeRef = useRef(onConfigChange);

  const complete = useMemo(() => isWinning(slots), [slots]);

  useEffect(() => {
    latestConfigRef.current = { layout, layerOverrides };
    onConfigChangeRef.current = onConfigChange;
  }, [layerOverrides, layout, onConfigChange]);

  useEffect(() => {
    if (initialConfig || !persistLocal) return;
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem('wanping-level-editor-v1');
        if (raw) {
          const saved = JSON.parse(raw) as {
            layout?: Partial<LayoutState>;
            layerOverrides?: LayerOverrides;
            slots?: SlotState[];
          };
          if (saved.layout) setLayout(normalizeLayout(saved.layout));
          if (saved.layerOverrides) setLayerOverrides(migrateLayerOverrides(saved.layerOverrides));
          if (!playOnly && Array.isArray(saved.slots) && saved.slots.length === 3) {
            setSlots(saved.slots.map(normalizeSavedSlot));
          }
        }
      } catch {
        window.localStorage.removeItem('wanping-level-editor-v1');
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
          'wanping-level-editor-v1',
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
    commitSlots(EMPTY_SLOTS());
    setSelectedChoice(null);
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
        window.localStorage.setItem('wanping-level-editor-v1', JSON.stringify(config));
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
    setPresetCategory('death');
    setSelectedPresetId('death-bubble');
    setPresetLayerKey('death-bubble');
    window.localStorage.removeItem('wanping-level-editor-v1');
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
    <div className={`editor-shell level-five-editor mode-${mode} ${mode === 'play' && complete ? 'is-level-complete' : ''} ${mode === 'play' && complete && initiallyComplete ? 'is-restored-complete' : ''} ${playOnly ? 'level-five-play-only' : ''} ${previewOnly ? 'level-embedded-preview' : ''}`}>
      {!playOnly && (
      <header className="app-bar">
        <div className="brand-block">
          {onBack && !playOnly && (
            <button className="back-to-story-button" type="button" onClick={saveAndBack} aria-label="保存并返回整站编辑器">←</button>
          )}
          <span className="brand-seal">婉</span>
          <div>
            <p className="eyebrow">第五关 · 婉平之交</p>
            <h1>{mode === 'edit' ? editSurface === 'presets' ? '全部场景预设' : '关卡页面布局' : '第五关试玩'}</h1>
          </div>
        </div>

        {mode === 'edit' ? (
          <div className="app-actions">
            <span className="save-state"><i /> {saveLabel}</span>
            <div className="level-edit-switch" aria-label="第五关编辑内容">
              <button className={editSurface === 'presets' ? 'is-active' : ''} type="button" onClick={() => setEditSurface('presets')}>场景预设</button>
              <button className={editSurface === 'layout' ? 'is-active' : ''} type="button" onClick={() => setEditSurface('layout')}>页面布局</button>
            </div>
            <button className="ghost-button save-all-presets" type="button" onClick={() => saveAll()}>保存全部设置</button>
            <button className="ghost-button" type="button" onClick={resetEditor}>还原默认</button>
            <button className="play-button" type="button" onClick={enterPlay}><span>▶</span> 试玩</button>
          </div>
        ) : (
          <div className="app-actions play-actions">
            <span className="play-status">试玩模式 · 错误组合不会提示</span>
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
              <div className="level-chapter-heading" aria-label="Chapter 5：The Final Edict">
                <span>Chapter 5</span>
                <strong>The Final Edict</strong>
              </div>
              <div
                className={`prompt-object layout-object ${layoutIsActive('prompt') ? 'is-selected' : ''}`}
                style={layoutStyle('prompt')}
                onPointerDown={(event) => beginLayoutDrag('prompt', event)}
              >
                <strong>After Zhongzong dies, Waner and Taiping draft a balance of power.</strong>
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
                    tabIndex={mode === 'play' ? 0 : -1}
                    aria-label={`Scene frame ${slotIndex + 1}${mode === 'play' && !selectedChoice && slot.items.length ? '，Tap to clear' : ''}`}
                    onClick={() => {
                      if (mode === 'play') {
                        if (selectedChoice) dropItem(slotIndex, selectedChoice);
                        else clearSlot(slotIndex);
                      } else if (mode === 'edit') {
                        setSelection({ kind: 'layout', id: layoutId });
                      }
                    }}
                    onKeyDown={(event) => {
                      if (mode === 'play' && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        if (selectedChoice) dropItem(slotIndex, selectedChoice);
                        else clearSlot(slotIndex);
                      }
                    }}
                    onDragOver={(event) => {
                      if (mode !== 'play') return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                      setHoverSlot(slotIndex);
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverSlot(null);
                    }}
                    onDrop={(event) => handleDrop(slotIndex, event)}
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
                    {mode === 'play' && selectedChoice && (
                      <span className="click-drop-label">Place here</span>
                    )}
                    {mode === 'play' && !selectedChoice && slot.items.length > 0 && (
                      <span className="click-drop-label clear-slot-label">Tap to clear</span>
                    )}
                  </div>
                );
              })}

              <p className="level-choice-instruction">Choose an icon, then a frame. Reconstruct all three scenes to continue.</p>
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
                      <span className="choice-caption">{CHOICE_META[item].label}</span>
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
              : 'Complete all three scenes. Continue down the page to explore how the story is erased.'}
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
