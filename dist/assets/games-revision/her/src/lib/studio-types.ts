export type AssetKind = 'image' | 'audio' | 'bubble';
export type MotionPreset = 'none' | 'fade' | 'left' | 'right' | 'up' | 'down' | 'soft-scale' | 'particle-gather' | 'particle-scatter' | 'bubble-pop';
export type MotionPlayback = 'once' | 'reenter';
export type MotionDuration = 320 | 600 | 900;
export type ParallaxDepth = 'far' | 'main' | 'near';
export type PanelLayout = 'image-left' | 'image-right' | 'full-image' | 'text-only';
export type BubbleStyle = 'none' | 'paper' | 'ink' | 'scroll' | 'custom';
export type CanvasAspect = '16:9' | '4:3' | '3:4' | '9:16';
export type StickySide = 'left' | 'right';

export const OPENING_BLOCK_ID = 'story-opening';
export const OPENING_PAGE_VERSION = 2;

export interface MotionConfig {
  enter: MotionPreset;
  exit: MotionPreset;
  playback: MotionPlayback;
  duration: MotionDuration;
  delay: number;
  parallax: ParallaxDepth;
}

export interface EditableHeadingStyle {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  fontSize: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  verticalText: boolean;
  rotation: number;
  opacity: number;
  motion: MotionConfig;
}

export type EditableHeadingStyleOverrides = Omit<Partial<EditableHeadingStyle>, 'motion'> & {
  motion?: Partial<MotionConfig>;
};

export interface StudioAsset {
  id: string;
  name: string;
  kind: AssetKind;
  mimeType: string;
  byteLength: number;
  url: string;
  builtIn?: boolean;
}

export interface StoryLayerBase {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  rotation: number;
  opacity: number;
  motion: MotionConfig;
  mobile?: StoryLayerMobileOverride;
}

export interface StoryLayerMobileOverride {
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

export interface StoryCanvasConfig {
  mode: 'continuous';
  designWidth: number;
  designHeight: number;
  mobileDesignWidth: number;
  mobileDesignHeight: number;
  source?: 'figma' | 'editor';
}

export interface StoryImageLayer extends StoryLayerBase {
  kind: 'image';
  assetId: string;
  fit: 'contain' | 'cover';
  cropZoom: number;
  cropX: number;
  cropY: number;
  flipX: boolean;
  flipY: boolean;
}

export interface TextBoldRange {
  start: number;
  end: number;
}

export interface StoryTextLayer extends StoryLayerBase {
  kind: 'text';
  text: string;
  boldRanges: TextBoldRange[];
  fontSize: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  verticalText: boolean;
  bubbleStyle: BubbleStyle;
  bubbleAssetId?: string;
  padding: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

export type StoryLayer = StoryImageLayer | StoryTextLayer;

export interface StoryPanel {
  id: string;
  name: string;
  assetId?: string;
  text: string;
  caption?: string;
  layout: PanelLayout;
  imageScale: number;
  bubbleStyle: BubbleStyle;
  bubbleAssetId?: string;
  textSize: number;
  textAlign: 'left' | 'center' | 'right';
  verticalText: boolean;
  motion: MotionConfig;
  canvasAspect: CanvasAspect;
  canvas?: StoryCanvasConfig;
  layers: StoryLayer[];
  stickySide?: StickySide;
}

export interface StoryStickyFocusConfig {
  enabled: boolean;
  assetId?: string;
  sizePercent: number;
  xPercent: number;
  topVh: number;
  stepHeightVh: number;
}

export interface StoryAudioCue {
  assetId?: string;
  trigger: 'none' | 'section-enter' | 'click';
  loop: boolean;
  volume: number;
  fadeOut: boolean;
}

export interface CausalLevelConfig {
  layout?: Record<string, { x: number; y: number; w: number }>;
  layerOverrides?: Record<string, { x: number; y: number; w: number; z: number }>;
}

export type LevelOneConfig = CausalLevelConfig;
export type LevelTwoConfig = CausalLevelConfig;
export type LevelThreeConfig = CausalLevelConfig;
export type LevelFourConfig = CausalLevelConfig;
export type LevelFiveConfig = CausalLevelConfig;
export type LevelSixConfig = CausalLevelConfig;
export type FinalChapterConfig = CausalLevelConfig;
export type LevelTemplate = 'level-one' | 'level-two' | 'level-three' | 'level-four' | 'level-five' | 'level-six' | 'placeholder';

export interface StoryBlock {
  id: string;
  kind: 'story';
  title: string;
  enabled: boolean;
  panels: StoryPanel[];
  audio: StoryAudioCue;
  stickyFocus?: StoryStickyFocusConfig;
  finalChapterConfig?: FinalChapterConfig;
}

export interface LevelBlock {
  id: string;
  kind: 'level';
  title: string;
  enabled: boolean;
  displayNumber: number;
  template: LevelTemplate;
  configured: boolean;
  requiredToContinue: boolean;
  levelOneConfig?: LevelOneConfig;
  levelTwoConfig?: LevelTwoConfig;
  levelThreeConfig?: LevelThreeConfig;
  levelFourConfig?: LevelFourConfig;
  levelFiveConfig?: LevelFiveConfig;
  levelSixConfig?: LevelSixConfig;
}

export type TimelineBlock = StoryBlock | LevelBlock;

export interface ProjectDocument {
  schema: 'wanping-project';
  version: 1;
  projectId: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  meta: {
    title: string;
    titleStyle: EditableHeadingStyle;
    description: string;
    locale: 'zh-CN';
  };
  theme: {
    fontFamily: 'historical-serif';
    backgroundAssetId: string;
    backgroundParallax: number;
    ink: string;
    paper: string;
    accent: string;
  };
  assets: Record<string, StudioAsset>;
  blocks: TimelineBlock[];
  settings: {
    initialMuted: true;
    motionPreference: 'system' | 'reduced' | 'full';
    levelFourSeeded?: boolean;
    levelSixSeeded?: boolean;
    figmaLayoutSeedVersion?: number;
    choiceLayoutVersion?: number;
    completionFlowVersion?: number;
    openingPageVersion?: number;
  };
}

export interface ProjectBundle {
  bundle: 'wanping-project-bundle';
  bundleVersion: 1;
  exportedAt: string;
  appVersion: string;
  document: ProjectDocument;
}

export function newId(prefix: string) {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

const DEFAULT_MOTION: MotionConfig = {
  enter: 'left',
  exit: 'fade',
  playback: 'reenter',
  duration: 600,
  delay: 0,
  parallax: 'main',
};

export function makeStoryStickyFocusConfig(
  overrides: Partial<StoryStickyFocusConfig> = {},
): StoryStickyFocusConfig {
  return {
    enabled: false,
    sizePercent: 52,
    xPercent: 50,
    topVh: 10,
    stepHeightVh: 88,
    ...overrides,
  };
}

export function makeEditableHeadingStyle(overrides: EditableHeadingStyleOverrides = {}): EditableHeadingStyle {
  const { motion, ...values } = overrides;
  return {
    x: 10,
    y: 25,
    w: 80,
    h: 40,
    z: 100,
    fontSize: 96,
    color: '#312d29',
    textAlign: 'center',
    verticalText: false,
    rotation: 0,
    opacity: 1,
    ...values,
    motion: {
      ...DEFAULT_MOTION,
      enter: 'fade',
      playback: 'once',
      ...(motion ?? {}),
    },
  };
}

export function makeStoryPanel(overrides: Partial<StoryPanel> = {}): StoryPanel {
  const panel: StoryPanel = {
    id: newId('panel'),
    name: '',
    text: '',
    layout: 'image-left',
    imageScale: 82,
    bubbleStyle: 'paper',
    textSize: 28,
    textAlign: 'left',
    verticalText: false,
    canvasAspect: '16:9',
    layers: [],
    stickySide: 'left',
    ...overrides,
    motion: { ...DEFAULT_MOTION, ...(overrides.motion ?? {}) },
  };
  panel.layers = overrides.layers ?? legacyLayersForPanel(panel);
  return panel;
}

export function makeImageLayer(assetId: string, overrides: Partial<StoryImageLayer> = {}): StoryImageLayer {
  const { motion, ...values } = overrides;
  return {
    id: newId('image-layer'),
    kind: 'image',
    name: '漫画图片',
    assetId,
    x: 8,
    y: 10,
    w: 42,
    h: 76,
    z: 10,
    rotation: 0,
    opacity: 1,
    fit: 'contain',
    cropZoom: 1,
    cropX: 0,
    cropY: 0,
    flipX: false,
    flipY: false,
    ...values,
    motion: { ...DEFAULT_MOTION, ...(motion ?? {}) },
  };
}

export function storyImageTransform(layer: Pick<StoryImageLayer, 'cropX' | 'cropY' | 'cropZoom' | 'flipX' | 'flipY'>): string {
  const mirrorX = layer.flipX ? -1 : 1;
  const mirrorY = layer.flipY ? -1 : 1;
  return `translate(${layer.cropX}%, ${layer.cropY}%) scale(${layer.cropZoom}) scale(${mirrorX}, ${mirrorY})`;
}

export function makeTextLayer(overrides: Partial<StoryTextLayer> = {}): StoryTextLayer {
  const { motion, ...values } = overrides;
  return {
    id: newId('text-layer'),
    kind: 'text',
    name: '旁白文字',
    text: '',
    boldRanges: [],
    x: 54,
    y: 23,
    w: 37,
    h: 48,
    z: 20,
    rotation: 0,
    opacity: 1,
    fontSize: 30,
    color: '#3f3731',
    textAlign: 'left',
    verticalText: false,
    bubbleStyle: 'none',
    padding: 18,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    ...values,
    motion: { ...DEFAULT_MOTION, enter: 'right', ...(motion ?? {}) },
  };
}

function legacyLayersForPanel(panel: Pick<StoryPanel, 'assetId' | 'text' | 'caption' | 'layout' | 'bubbleStyle' | 'bubbleAssetId' | 'textSize' | 'textAlign' | 'verticalText' | 'motion'>) {
  const layers: StoryLayer[] = [];
  const imageOnRight = panel.layout === 'image-right';
  if (panel.assetId && panel.layout !== 'text-only') {
    layers.push(makeImageLayer(panel.assetId, {
      name: panel.caption || '漫画图片',
      x: panel.layout === 'full-image' ? 3 : imageOnRight ? 53 : 5,
      y: panel.layout === 'full-image' ? 3 : 9,
      w: panel.layout === 'full-image' ? 94 : 43,
      h: panel.layout === 'full-image' ? 94 : 82,
      motion: panel.motion,
    }));
  }
  if (panel.text) {
    layers.push(makeTextLayer({
      text: panel.text,
      x: panel.layout === 'text-only' ? 18 : panel.layout === 'full-image' ? 28 : imageOnRight ? 7 : 53,
      y: panel.layout === 'full-image' ? 29 : 24,
      w: panel.layout === 'text-only' ? 64 : panel.layout === 'full-image' ? 44 : 40,
      h: panel.layout === 'text-only' ? 52 : 48,
      z: panel.layout === 'full-image' ? 30 : 20,
      fontSize: panel.textSize,
      textAlign: panel.textAlign,
      verticalText: panel.verticalText,
      bubbleStyle: panel.bubbleStyle,
      bubbleAssetId: panel.bubbleAssetId,
      motion: { ...panel.motion, enter: imageOnRight ? 'left' : 'right' },
    }));
  }
  return layers;
}

export function makeStoryBlock(title = ''): StoryBlock {
  return {
    id: newId('story'),
    kind: 'story',
    title,
    enabled: true,
    panels: [makeStoryPanel()],
    stickyFocus: makeStoryStickyFocusConfig(),
    audio: {
      trigger: 'none',
      loop: false,
      volume: 0.65,
      fadeOut: true,
    },
  };
}

export function makeLevelBlock(displayNumber: number): LevelBlock {
  const isLevelOne = displayNumber === 1;
  const isLevelTwo = displayNumber === 2;
  const isLevelThree = displayNumber === 3;
  const isLevelFour = displayNumber === 4;
  const isLevelFive = displayNumber === 5;
  const isLevelSix = displayNumber === 6;
  return {
    id: newId('level'),
    kind: 'level',
    title: `第${displayNumber}关`,
    enabled: true,
    displayNumber,
    template: isLevelOne
      ? 'level-one'
      : isLevelTwo
        ? 'level-two'
        : isLevelThree
          ? 'level-three'
          : isLevelFour
            ? 'level-four'
            : isLevelFive
              ? 'level-five'
              : isLevelSix
                ? 'level-six'
                : 'placeholder',
    configured: isLevelOne || isLevelTwo || isLevelThree || isLevelFour || isLevelFive || isLevelSix,
    requiredToContinue: true,
    ...(isLevelOne ? { levelOneConfig: {} } : {}),
    ...(isLevelTwo ? { levelTwoConfig: {} } : {}),
    ...(isLevelThree ? { levelThreeConfig: {} } : {}),
    ...(isLevelFour ? { levelFourConfig: {} } : {}),
    ...(isLevelFive ? { levelFiveConfig: {} } : {}),
    ...(isLevelSix ? { levelSixConfig: {} } : {}),
  };
}

const FIGMA_LAYOUT_SEED_VERSION = 8;
const CHOICE_LAYOUT_VERSION = 1;

type ChoiceLayout = NonNullable<CausalLevelConfig['layout']>;

const FIVE_CHOICE_X = [6, 26, 46, 66, 86] as const;
const SIX_CHOICE_X = [5, 21.5, 38, 54.5, 71, 87.5] as const;
const NINE_CHOICE_X = [4, 14.5, 25, 35.5, 46, 56.5, 67, 77.5, 88] as const;

function makeChoiceLayout(ids: readonly string[], xValues: readonly number[]): ChoiceLayout {
  return Object.fromEntries(ids.map((id, index) => [id, { x: xValues[index], y: 69, w: 8.5 }]));
}

const LEVEL_CHOICE_LAYOUTS = {
  'level-one': makeChoiceLayout([
    'choice-shangguanyi',
    'choice-waner',
    'choice-wuzetian',
    'choice-death',
    'choice-edict',
    'choice-poem',
  ], SIX_CHOICE_X),
  'level-two': makeChoiceLayout([
    'choice-taiping',
    'choice-lizhi',
    'choice-wuzetian',
    'choice-marriage',
    'choice-poem',
    'choice-power',
  ], SIX_CHOICE_X),
  'level-three': makeChoiceLayout([
    'choice-waner',
    'choice-taiping',
    'choice-lake',
    'choice-banquet',
    'choice-poem',
  ], FIVE_CHOICE_X),
  'level-four': makeChoiceLayout([
    'choice-taiping',
    'choice-waner',
    'choice-anle',
    'choice-power',
    'choice-balance',
    'choice-edict',
  ], SIX_CHOICE_X),
  'level-five': makeChoiceLayout([
    'choice-waner',
    'choice-taiping',
    'choice-chongmao',
    'choice-zhongzong',
    'choice-weihou',
    'choice-lidan',
    'choice-death',
    'choice-balance',
    'choice-edict',
  ], NINE_CHOICE_X),
  'level-six': makeChoiceLayout([
    'choice-waner',
    'choice-taiping',
    'choice-longji',
    'choice-power',
    'choice-death',
    'choice-memorial',
  ], SIX_CHOICE_X),
} satisfies Record<Exclude<LevelTemplate, 'placeholder'>, ChoiceLayout>;

function replaceChoiceLayout(
  config: CausalLevelConfig | undefined,
  choiceLayout: ChoiceLayout,
): CausalLevelConfig {
  const safeConfig: CausalLevelConfig = isRecord(config) ? config as CausalLevelConfig : {};
  const savedLayout: ChoiceLayout = isRecord(safeConfig.layout) ? safeConfig.layout as ChoiceLayout : {};

  return {
    ...safeConfig,
    layout: {
      ...choiceLayout,
      ...savedLayout,
    },
  };
}

function applyChoiceLayoutMigration(project: ProjectDocument): ProjectDocument {
  const currentVersion = project.settings.choiceLayoutVersion;
  if (typeof currentVersion === 'number' && currentVersion >= CHOICE_LAYOUT_VERSION) return project;

  // Version 1 intentionally replaces only choice-* geometry. Prompt, scene-slot and
  // layer edits remain untouched; the version gate preserves later user adjustments.
  project.blocks.forEach((block) => {
    if (block.kind !== 'level') return;
    if (block.template === 'level-one') {
      block.levelOneConfig = replaceChoiceLayout(block.levelOneConfig, LEVEL_CHOICE_LAYOUTS['level-one']);
    } else if (block.template === 'level-two') {
      block.levelTwoConfig = replaceChoiceLayout(block.levelTwoConfig, LEVEL_CHOICE_LAYOUTS['level-two']);
    } else if (block.template === 'level-three') {
      block.levelThreeConfig = replaceChoiceLayout(block.levelThreeConfig, LEVEL_CHOICE_LAYOUTS['level-three']);
    } else if (block.template === 'level-four') {
      block.levelFourConfig = replaceChoiceLayout(block.levelFourConfig, LEVEL_CHOICE_LAYOUTS['level-four']);
    } else if (block.template === 'level-five') {
      block.levelFiveConfig = replaceChoiceLayout(block.levelFiveConfig, LEVEL_CHOICE_LAYOUTS['level-five']);
    } else if (block.template === 'level-six') {
      block.levelSixConfig = replaceChoiceLayout(block.levelSixConfig, LEVEL_CHOICE_LAYOUTS['level-six']);
    }
  });
  project.settings.choiceLayoutVersion = CHOICE_LAYOUT_VERSION;
  return project;
}

const FIGMA_STORY_ASSET_ROOT = '/assets/story/wanping-export';

const CANONICAL_CORE_ASSET_URLS: Record<string, string> = {
  'builtin-paper': '/assets/game/paper-background.png',
  'builtin-waner': '/assets/game/shangguan-waner-close-side.png',
  'builtin-taiping': '/assets/game/princess-taiping-close-side.png',
  'builtin-edict': '/assets/game/edict-large.png',
};

function figmaStoryAsset(id: string, name: string, fileName: string, kind: StudioAsset['kind'] = 'image'): StudioAsset {
  return { id, name, kind, mimeType: 'image/png', byteLength: 0, url: `${FIGMA_STORY_ASSET_ROOT}/${fileName}`, builtIn: true };
}

function openingStoryAsset(id: string, name: string, fileName: string): StudioAsset {
  return { id, name, kind: 'image', mimeType: 'image/png', byteLength: 0, url: `/assets/story/opening/${fileName}`, builtIn: true };
}

const FIGMA_STORY_ASSETS: Record<string, StudioAsset> = {
  'opening-cloud-back': openingStoryAsset('opening-cloud-back', '开场 · 后层云', 'opening-cloud-back.png'),
  'opening-cloud-front': openingStoryAsset('opening-cloud-front', '开场 · 前层云', 'opening-cloud-front.png'),
  'opening-cloud-accent': openingStoryAsset('opening-cloud-accent', '开场 · 远层点云', 'opening-cloud-accent.png'),
  'opening-title': openingStoryAsset('opening-title', '开场 · 颂声起题字', 'opening-title.png'),
  'opening-palace': openingStoryAsset('opening-palace', '开场 · 宫城与两人', 'opening-palace.png'),
  'figma-0-0': figmaStoryAsset('figma-0-0', '商议废后', '0-0.png'),
  'figma-0-1': figmaStoryAsset('figma-0-1', '消息传入宫中', '0-1.png'),
  'figma-0-2': figmaStoryAsset('figma-0-2', '武则天问罪', '0-2.png'),
  'figma-0-3': figmaStoryAsset('figma-0-3', '问罪气泡', '0-3.png', 'bubble'),
  'figma-0-4': figmaStoryAsset('figma-0-4', '襁褓中的上官婉儿', '0-4.png'),
  'figma-1-1': figmaStoryAsset('figma-1-1', '婉儿与母亲', '1-1.png'),
  'figma-1-2': figmaStoryAsset('figma-1-2', '太平公主一家', '1-2.png'),
  'figma-2-1': figmaStoryAsset('figma-2-1', '母女望向宫城', '2-1.png'),
  'figma-2-2': figmaStoryAsset('figma-2-2', '宫城', '2-2.png'),
  'figma-3-1': figmaStoryAsset('figma-3-1', '太平公主受封赏', '3-1.png'),
  'figma-3-2': figmaStoryAsset('figma-3-2', '婉儿掌管诏命', '3-2.png'),
  'figma-3-3': figmaStoryAsset('figma-3-3', '武则天去世', '3-3.png'),
  'figma-3-4': figmaStoryAsset('figma-3-4', '宫廷', '3-4.png'),
  'figma-5-1': figmaStoryAsset('figma-5-1', '遗诏中的权力制衡', '5-1.png'),
  'figma-5-2': figmaStoryAsset('figma-5-2', '韦皇后临朝', '5-2.png'),
  'figma-5-3': figmaStoryAsset('figma-5-3', '太平公主与李隆基', '5-3.png'),
  'figma-5-4': figmaStoryAsset('figma-5-4', '驾马气泡', '5-4.png', 'bubble'),
  'figma-5-5': figmaStoryAsset('figma-5-5', '上官婉儿持烛迎接李隆基', '5-5.png'),
  'figma-scroll-arrow': figmaStoryAsset('figma-scroll-arrow', '下滑箭头', 'scroll-arrow.png'),
  'figma-portrait-waner': figmaStoryAsset('figma-portrait-waner', '上官婉儿', 'shangguan-waner-avatar.png'),
  'figma-portrait-taiping': figmaStoryAsset('figma-portrait-taiping', '太平公主', 'princess-taiping-avatar.png'),
  'figma-portrait-anle': figmaStoryAsset('figma-portrait-anle', '安乐公主', 'princess-anle-avatar.png'),
  'figma-portrait-lidan': figmaStoryAsset('figma-portrait-lidan', '相王李旦', 'li-dan-avatar.png'),
  'figma-portrait-wei': figmaStoryAsset('figma-portrait-wei', '韦皇后', 'empress-wei-avatar.png'),
  'figma-post6-misread-waner': {
    id: 'figma-post6-misread-waner',
    name: '史书误写·上官婉儿',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/initial-1.png',
    builtIn: true,
  },
  'figma-post6-misread-taiping': {
    id: 'figma-post6-misread-taiping',
    name: '史书误写·太平公主',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/initial-2.png',
    builtIn: true,
  },
  'figma-post6-misread-rivalry': {
    id: 'figma-post6-misread-rivalry',
    name: '史书误写·政敌与情敌',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/initial-3.png',
    builtIn: true,
  },
  'figma-epilogue-monument': {
    id: 'figma-epilogue-monument',
    name: '尾声·墓碑',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/epilogue-monument.png',
    builtIn: true,
  },
  'figma-epilogue-tombstone': {
    id: 'figma-epilogue-tombstone',
    name: '尾声·墓志',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/epilogue-tombstone.png',
    builtIn: true,
  },
  'figma-epilogue-reader': {
    id: 'figma-epilogue-reader',
    name: '尾声·翻检史书',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/epilogue-reader.png',
    builtIn: true,
  },
  'figma-epilogue-women': {
    id: 'figma-epilogue-women',
    name: '尾声·婉儿与太平',
    kind: 'image',
    mimeType: 'image/png',
    byteLength: 0,
    url: '/assets/game/final-chapter/epilogue-women.png',
    builtIn: true,
  },
};

type FigmaRect = { x: number; y: number; w: number; h: number };

function percentRect(rect: FigmaRect, canvasHeight: number, baseY = 0): FigmaRect {
  return {
    x: (rect.x / 1728) * 100,
    y: ((rect.y - baseY) / canvasHeight) * 100,
    w: (rect.w / 1728) * 100,
    h: (rect.h / canvasHeight) * 100,
  };
}

function mobileRect(rect: FigmaRect, canvasHeight: number): StoryLayerMobileOverride {
  return {
    x: (rect.x / 390) * 100,
    y: (rect.y / canvasHeight) * 100,
    w: (rect.w / 390) * 100,
    h: (rect.h / canvasHeight) * 100,
  };
}

function boldRangesFor(text: string, terms: string[]): TextBoldRange[] {
  const ranges: TextBoldRange[] = [];
  terms.forEach((term) => {
    let offset = 0;
    while (offset < text.length) {
      const start = text.indexOf(term, offset);
      if (start < 0) break;
      ranges.push({ start, end: start + term.length });
      offset = start + term.length;
    }
  });
  return ranges.sort((a, b) => a.start - b.start);
}

function figmaMotion(enter: MotionPreset, delay = 0): MotionConfig {
  return { ...DEFAULT_MOTION, enter, exit: enter === 'left' || enter === 'right' ? enter : 'fade', delay, playback: 'reenter' };
}

function figmaImage(
  id: string,
  assetId: string,
  desktop: FigmaRect,
  mobile: FigmaRect,
  canvasHeight: number,
  mobileHeight: number,
  baseY: number,
  enter: MotionPreset,
  z = 10,
  delay = 0,
): StoryImageLayer {
  return makeImageLayer(assetId, {
    id,
    name: FIGMA_STORY_ASSETS[assetId]?.name ?? 'Figma 图片',
    ...percentRect(desktop, canvasHeight, baseY),
    z,
    fit: 'contain',
    motion: figmaMotion(enter, delay),
    mobile: mobileRect(mobile, mobileHeight),
  });
}

function figmaText(
  id: string,
  text: string,
  desktop: FigmaRect,
  mobile: FigmaRect,
  canvasHeight: number,
  mobileHeight: number,
  baseY: number,
  enter: MotionPreset,
  options: { bold?: string[]; fontSize?: number; mobileFontSize?: number; align?: StoryTextLayer['textAlign']; z?: number; delay?: number } = {},
): StoryTextLayer {
  return makeTextLayer({
    id,
    name: text.slice(0, 18),
    text,
    boldRanges: boldRangesFor(text, options.bold ?? []),
    ...percentRect(desktop, canvasHeight, baseY),
    z: options.z ?? 20,
    fontSize: options.fontSize ?? 22,
    textAlign: options.align ?? 'left',
    bubbleStyle: 'none',
    padding: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    motion: figmaMotion(enter, options.delay ?? 0),
    mobile: {
      ...mobileRect(mobile, mobileHeight),
      fontSize: options.mobileFontSize ?? 18,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    },
  });
}

function makeFigmaStoryBlock(
  id: string,
  title: string,
  canvasHeight: number,
  mobileHeight: number,
  layers: StoryLayer[],
): StoryBlock {
  return {
    id,
    kind: 'story',
    title,
    enabled: true,
    panels: [makeStoryPanel({
      id: `${id}-panel`,
      name: title,
      canvasAspect: '9:16',
      canvas: {
        mode: 'continuous',
        designWidth: 1728,
        designHeight: canvasHeight,
        mobileDesignWidth: 390,
        mobileDesignHeight: mobileHeight,
        source: 'figma',
      },
      layers,
      motion: { ...DEFAULT_MOTION, enter: 'fade', exit: 'fade' },
    })],
    stickyFocus: makeStoryStickyFocusConfig(),
    audio: { trigger: 'none', loop: false, volume: 0.65, fadeOut: true },
  };
}

export function makeOpeningPage(): StoryBlock {
  const image = (
    id: string,
    assetId: string,
    geometry: Pick<StoryImageLayer, 'x' | 'y' | 'w' | 'h'>,
    z: number,
  ) => makeImageLayer(assetId, {
    id,
    name: FIGMA_STORY_ASSETS[assetId]?.name ?? '开场图片',
    ...geometry,
    z,
    fit: 'contain',
    motion: { ...DEFAULT_MOTION, enter: 'none', exit: 'none', playback: 'once', parallax: 'main' },
    mobile: { ...geometry },
  });

  return makeFigmaStoryBlock(OPENING_BLOCK_ID, '开场首页', 1117, 546, [
    image('opening-cloud-accent-layer', 'opening-cloud-accent', { x: 0, y: 0, w: 33.738, h: 29.454 }, 0),
    image('opening-cloud-back-layer', 'opening-cloud-back', { x: -3.414, y: 0, w: 106.829, h: 57.117 }, 1),
    image('opening-cloud-front-layer', 'opening-cloud-front', { x: 15.278, y: 3, w: 69.444, h: 45.927 }, 2),
    image('opening-title-layer', 'opening-title', { x: 32.755, y: 14.593, w: 32.292, h: 22.739 }, 3),
    image('opening-palace-layer', 'opening-palace', { x: 35.648, y: 41.45, w: 28.704, h: 26.231 }, 4),
    makeTextLayer({
      id: 'opening-start-copy',
      name: '开场 · 加载与开始提示',
      text: '点击任意位置开始游戏',
      x: 35,
      y: 87.8,
      w: 30,
      h: 5,
      z: 5,
      fontSize: 24,
      color: '#3f3731',
      textAlign: 'center',
      bubbleStyle: 'none',
      padding: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      motion: { ...DEFAULT_MOTION, enter: 'none', exit: 'none', playback: 'once', parallax: 'main' },
      mobile: {
        x: 30,
        y: 87.8,
        w: 40,
        h: 5,
        fontSize: 18,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      },
    }),
  ]);
}

export function ensureOpeningPage(project: ProjectDocument): ProjectDocument {
  ['opening-cloud-back', 'opening-cloud-front', 'opening-cloud-accent', 'opening-title', 'opening-palace'].forEach((assetId) => {
    project.assets[assetId] = FIGMA_STORY_ASSETS[assetId];
  });
  const openingIndex = project.blocks.findIndex((block) => block.id === OPENING_BLOCK_ID);
  if (openingIndex < 0) {
    project.blocks.unshift(makeOpeningPage());
  } else if (openingIndex > 0) {
    const [opening] = project.blocks.splice(openingIndex, 1);
    project.blocks.unshift(opening);
  }
  const opening = project.blocks.find(
    (block): block is StoryBlock => block.kind === 'story' && block.id === OPENING_BLOCK_ID,
  );
  const openingPanel = opening?.panels[0];
  if (openingPanel && !openingPanel.layers.some((layer) => layer.id === 'opening-cloud-accent-layer')) {
    const accent = makeOpeningPage().panels[0]?.layers.find(
      (layer) => layer.id === 'opening-cloud-accent-layer',
    );
    if (accent) openingPanel.layers.unshift(accent);
  }
  project.settings.openingPageVersion = OPENING_PAGE_VERSION;
  return project;
}

function makeFigmaIntro(): StoryBlock {
  const h = 1680;
  const mh = 1480;
  const introText = '公元664年。\n唐高宗李治一度想废掉皇后武则天，\n于是召来宰相上官仪商议，\n上官仪赞成废后，并奉命起草诏书。';
  const trialText = '不久，上官仪以谋反罪被处死，\n他的儿子上官庭芝也一同获罪被杀。';
  const babyText = '但上官庭芝还留下了一个尚在襁褓中的女儿。\n她的名字是……上官婉儿。';
  return makeFigmaStoryBlock('story-figma-intro', '序章', h, mh, [
    figmaImage('figma-intro-council-layer', 'figma-0-0', { x: 329, y: 132, w: 697, h: 331 }, { x: 20, y: 35, w: 350, h: 168 }, h, mh, 0, 'left'),
    figmaText('figma-intro-copy', introText, { x: 1070, y: 208, w: 376, h: 156 }, { x: 24, y: 235, w: 342, h: 245 }, h, mh, 0, 'right', { bold: ['李治', '武则天', '上官仪'], mobileFontSize: 18 }),
    figmaImage('figma-intro-message-layer', 'figma-0-1', { x: 659, y: 526, w: 347, h: 240 }, { x: 78, y: 510, w: 234, h: 172 }, h, mh, 0, 'fade'),
    figmaText('figma-intro-message-caption', '消息很快传到武则天耳中。', { x: 729, y: 782, w: 300, h: 38 }, { x: 35, y: 695, w: 320, h: 42 }, h, mh, 0, 'fade', { align: 'center', mobileFontSize: 17 }),
    figmaImage('figma-intro-trial-layer', 'figma-0-2', { x: 329, y: 912, w: 697, h: 331 }, { x: 20, y: 770, w: 350, h: 168 }, h, mh, 0, 'left'),
    figmaImage('figma-intro-bubble-layer', 'figma-0-3', { x: 716, y: 922, w: 354, h: 69 }, { x: 130, y: 785, w: 225, h: 44 }, h, mh, 0, 'bubble-pop', 30, 650),
    figmaText('figma-intro-dialogue', '你们可知该当何罪！', { x: 872, y: 941, w: 198, h: 32 }, { x: 216, y: 796, w: 134, h: 28 }, h, mh, 0, 'bubble-pop', { z: 40, delay: 650, mobileFontSize: 14, align: 'center' }),
    figmaText('figma-intro-trial-copy', trialText, { x: 1070, y: 1055, w: 390, h: 80 }, { x: 24, y: 960, w: 342, h: 130 }, h, mh, 0, 'right', { bold: ['上官庭芝'], mobileFontSize: 18 }),
    figmaText('figma-intro-baby-copy', babyText, { x: 644, y: 1328, w: 440, h: 70 }, { x: 24, y: 1120, w: 342, h: 110 }, h, mh, 0, 'fade', { bold: ['上官婉儿'], align: 'center', mobileFontSize: 18 }),
    figmaImage('figma-intro-baby-layer', 'figma-0-4', { x: 683, y: 1386, w: 358, h: 268 }, { x: 58, y: 1250, w: 274, h: 205 }, h, mh, 0, 'fade'),
  ]);
}

function makeFigmaAfterOne(): StoryBlock {
  const base = 2400;
  const h = 820;
  const mh = 1050;
  const taipingText = '而就在同一座宫城里，还有另一个女孩。\n她不需要靠才华换来进入宫廷的机会，\n因为她生来便是贵族。\n\n她的父亲，是唐高宗李治。\n而她的母亲，是后来成为皇帝的武则天。\n\n她是皇帝最宠爱的女儿之一，\n也是大唐最尊贵的公主之一。\n\n她叫……太平公主。';
  return makeFigmaStoryBlock('story-figma-after-one', '第一关之后', h, mh, [
    figmaImage('figma-after1-mother-layer', 'figma-1-1', { x: 479, y: 2426, w: 378, h: 178 }, { x: 30, y: 30, w: 330, h: 155 }, h, mh, base, 'left'),
    figmaText('figma-after1-mother-copy', '从此，婉儿摆脱在掖庭的生活，\n就这样渐渐进入唐宫的权力中心。', { x: 893, y: 2470, w: 360, h: 90 }, { x: 25, y: 210, w: 340, h: 130 }, h, mh, base, 'right', { mobileFontSize: 18 }),
    figmaText('figma-after1-complete', '下滑让故事继续', { x: 685, y: 2673, w: 374, h: 36 }, { x: 35, y: 365, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-after1-scroll-arrow', 'figma-scroll-arrow', { x: 856, y: 2712, w: 17, h: 32 }, { x: 188, y: 410, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaImage('figma-after1-family-layer', 'figma-1-2', { x: 405, y: 2817, w: 527, h: 354 }, { x: 25, y: 465, w: 340, h: 229 }, h, mh, base, 'left'),
    figmaText('figma-after1-taiping-copy', taipingText, { x: 978, y: 2816, w: 420, h: 340 }, { x: 25, y: 720, w: 340, h: 300 }, h, mh, base, 'right', { bold: ['李治', '武则天', '太平公主'], mobileFontSize: 17 }),
  ]);
}

function makeFigmaAfterTwo(): StoryBlock {
  const base = 3900;
  const h = 850;
  const mh = 1260;
  const relationText = '上官婉儿和太平公主。\n\n一个是皇后亲手提拔的罪臣之女。\n一个是皇后最宠爱的女儿。\n\n她们年龄相近，长期生活在同一座宫廷，\n一个掌文字，一个近权谋，自然少不了相见的时候。\n\n再加上两人都擅长诗文，在一次次宫宴、游赏与唱和之间，也渐渐熟识起来。';
  return makeFigmaStoryBlock('story-figma-after-two', '第二关之后', h, mh, [
    figmaImage('figma-after2-overlook-layer', 'figma-2-1', { x: 479, y: 3950, w: 384, h: 186 }, { x: 35, y: 30, w: 320, h: 158 }, h, mh, base, 'left'),
    figmaText('figma-after2-overlook-copy', '后来一些重要的事情，武则天会让太平参与商议。\n太平公主开始真正走进朝廷的谋议之中。', { x: 892, y: 4011, w: 500, h: 86 }, { x: 25, y: 215, w: 340, h: 110 }, h, mh, base, 'right', { bold: ['武则天', '太平公主'], mobileFontSize: 18 }),
    figmaText('figma-after2-complete', '下滑让故事继续', { x: 693, y: 4193, w: 374, h: 36 }, { x: 35, y: 350, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-after2-scroll-arrow', 'figma-scroll-arrow', { x: 856, y: 4232, w: 17, h: 32 }, { x: 188, y: 395, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaImage('figma-after2-palace-layer', 'figma-2-2', { x: 419, y: 4396, w: 414, h: 316 }, { x: 45, y: 540, w: 300, h: 230 }, h, mh, base, 'left', 8),
    figmaText('figma-after2-relation-copy', relationText, { x: 1026, y: 4394, w: 410, h: 320 }, { x: 25, y: 805, w: 340, h: 390 }, h, mh, base, 'right', { bold: ['上官婉儿', '太平公主'], mobileFontSize: 17 }),
  ]);
}

function makeFigmaAfterThree(): StoryBlock {
  const base = 5550;
  const h = 1450;
  const mh = 2300;
  const historyText = '公元705年，张柬之等大臣发动神龙政变。\n武则天被迫退位，将皇位交还给儿子李显。\n李显重新登基，是为唐中宗。武周结束，唐朝恢复。';
  const politicsText = '韦皇后、安乐公主、太平公主、相王李旦和掌管诏命的上官婉儿，各自拥有不同的立场。\n到了中宗统治后期，皇位应当由谁继承，成为所有矛盾的中心。';
  return makeFigmaStoryBlock('story-figma-after-three', '第三关之后', h, mh, [
    figmaText('figma-after3-complete', '下滑让故事继续', { x: 677, y: 5587, w: 374, h: 36 }, { x: 35, y: 30, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-after3-scroll-arrow', 'figma-scroll-arrow', { x: 856, y: 5626, w: 17, h: 32 }, { x: 188, y: 75, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaText('figma-after3-history-copy', historyText, { x: 622, y: 5793, w: 520, h: 108 }, { x: 25, y: 130, w: 340, h: 180 }, h, mh, base, 'fade', { bold: ['神龙政变', '李显'], mobileFontSize: 17 }),
    figmaImage('figma-after3-taiping-layer', 'figma-3-1', { x: 75, y: 5943, w: 514, h: 261 }, { x: 20, y: 360, w: 350, h: 180 }, h, mh, base, 'left'),
    figmaText('figma-after3-taiping-caption', '太平公主因参与政变受到封赏。', { x: 75, y: 6225, w: 360, h: 40 }, { x: 25, y: 550, w: 340, h: 50 }, h, mh, base, 'left', { mobileFontSize: 16 }),
    figmaImage('figma-after3-waner-layer', 'figma-3-2', { x: 599, y: 5943, w: 514, h: 261 }, { x: 20, y: 640, w: 350, h: 180 }, h, mh, base, 'fade'),
    figmaText('figma-after3-waner-caption', '上官婉儿继续留在宫中掌管诏命，不久被封为昭容。', { x: 597, y: 6225, w: 520, h: 40 }, { x: 25, y: 830, w: 340, h: 65 }, h, mh, base, 'fade', { mobileFontSize: 16 }),
    figmaImage('figma-after3-throne-layer', 'figma-3-3', { x: 1123, y: 5943, w: 508, h: 261 }, { x: 20, y: 920, w: 350, h: 180 }, h, mh, base, 'right'),
    figmaText('figma-after3-throne-caption', '同年冬天，武则天在上阳宫去世。', { x: 1128, y: 6225, w: 380, h: 40 }, { x: 25, y: 1110, w: 340, h: 50 }, h, mh, base, 'right', { mobileFontSize: 16 }),
    figmaImage('figma-after3-palace-layer', 'figma-3-4', { x: 409, y: 6329, w: 458, h: 245 }, { x: 20, y: 1200, w: 350, h: 187 }, h, mh, base, 'left'),
    figmaText('figma-after3-palace-copy', '宫廷仍在运转，所有人要在新的皇帝身边重新寻找自己的位置。', { x: 887, y: 6404, w: 430, h: 108 }, { x: 25, y: 1410, w: 340, h: 140 }, h, mh, base, 'right', { mobileFontSize: 18 }),
    figmaImage('figma-after3-anle-layer', 'figma-portrait-anle', { x: 392, y: 6639, w: 200, h: 200 }, { x: 25, y: 1600, w: 100, h: 100 }, h, mh, base, 'left', 10, 0),
    figmaImage('figma-after3-wei-layer', 'figma-portrait-wei', { x: 577, y: 6639, w: 200, h: 200 }, { x: 145, y: 1600, w: 100, h: 100 }, h, mh, base, 'left', 10, 80),
    figmaImage('figma-after3-taiping-portrait-layer', 'figma-portrait-taiping', { x: 762, y: 6639, w: 200, h: 200 }, { x: 265, y: 1600, w: 100, h: 100 }, h, mh, base, 'fade', 10, 160),
    figmaImage('figma-after3-lidan-layer', 'figma-portrait-lidan', { x: 947, y: 6639, w: 200, h: 200 }, { x: 85, y: 1730, w: 100, h: 100 }, h, mh, base, 'right', 10, 240),
    figmaImage('figma-after3-waner-portrait-layer', 'figma-portrait-waner', { x: 1132, y: 6639, w: 200, h: 200 }, { x: 205, y: 1730, w: 100, h: 100 }, h, mh, base, 'right', 10, 320),
    figmaText('figma-after3-politics-copy', politicsText, { x: 453, y: 6839, w: 858, h: 110 }, { x: 25, y: 1880, w: 340, h: 300 }, h, mh, base, 'fade', { bold: ['韦皇后', '安乐公主', '太平公主', '李旦', '上官婉儿'], align: 'center', mobileFontSize: 17 }),
  ]);
}

function makeFigmaAfterFour(): StoryBlock {
  const base = 7800;
  const h = 360;
  const mh = 360;
  const text = '公元710年，唐中宗李显突然去世，\n原本勉强维持的平衡也随之被打破。';
  return makeFigmaStoryBlock('story-figma-after-four', '第四关之后', h, mh, [
    figmaText('figma-after4-scroll', '下滑让故事继续', { x: 677, y: 7819, w: 374, h: 36 }, { x: 35, y: 22, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-after4-scroll-arrow', 'figma-scroll-arrow', { x: 856, y: 7858, w: 17, h: 32 }, { x: 188, y: 67, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaText('figma-after4-copy', text, { x: 688, y: 8002, w: 352, h: 70 }, { x: 25, y: 150, w: 340, h: 140 }, h, mh, base, 'fade', { bold: ['唐中宗李显'], align: 'center', mobileFontSize: 18 }),
  ]);
}

function makeFigmaAfterFive(): StoryBlock {
  const base = 8850;
  const h = 1500;
  const mh = 1910;
  const testament = '她们最终拟定的遗诏，以中宗之子李重茂继位，由韦皇后临朝，相王李旦参预政事。\n年幼的新帝、韦皇后、李旦，相互制衡。';
  const coup = '不久，太平公主与李隆基共同发动唐隆政变。\n韦皇后和安乐公主被杀，李重茂也失去了皇位。';
  const candle = '上官婉儿没有逃走。\n兵刃相接的宫城里，她手持蜡烛，带领宫人迎接李隆基。';
  return makeFigmaStoryBlock('story-figma-after-five', '第五关之后', h, mh, [
    figmaImage('figma-after5-balance', 'figma-5-1', { x: 321, y: 8875, w: 394, h: 182 }, { x: 30, y: 25, w: 330, h: 155 }, h, mh, base, 'left'),
    figmaText('figma-after5-testament', testament, { x: 740, y: 8934, w: 825, h: 75 }, { x: 25, y: 205, w: 340, h: 180 }, h, mh, base, 'right', { bold: ['李重茂', '韦皇后', '李旦'], mobileFontSize: 17 }),
    figmaText('figma-after5-scroll', '下滑让故事继续', { x: 677, y: 9091, w: 374, h: 36 }, { x: 35, y: 400, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-after5-scroll-arrow', 'figma-scroll-arrow', { x: 856, y: 9130, w: 17, h: 32 }, { x: 188, y: 445, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaImage('figma-after5-wei-court', 'figma-5-2', { x: 441, y: 9244, w: 275, h: 219 }, { x: 55, y: 500, w: 280, h: 225 }, h, mh, base, 'left'),
    figmaImage('figma-after5-riders', 'figma-5-3', { x: 293, y: 9556, w: 571, h: 430 }, { x: 10, y: 780, w: 370, h: 279 }, h, mh, base, 'left'),
    figmaImage('figma-after5-riders-bubble', 'figma-5-4', { x: 770, y: 9593, w: 251, h: 99 }, { x: 205, y: 810, w: 170, h: 69 }, h, mh, base, 'bubble-pop', 30, 650),
    figmaText('figma-after5-coup', coup, { x: 864, y: 9723, w: 462, h: 80 }, { x: 25, y: 1090, w: 340, h: 170 }, h, mh, base, 'right', { bold: ['唐隆政变'], mobileFontSize: 18 }),
    figmaImage('figma-after5-wei', 'figma-5-5', { x: 846, y: 9825, w: 341, h: 512 }, { x: 65, y: 1320, w: 260, h: 389 }, h, mh, base, 'right'),
    figmaText('figma-after5-candle-copy', candle, { x: 360, y: 9980, w: 450, h: 150 }, { x: 25, y: 1730, w: 340, h: 160 }, h, mh, base, 'left', { bold: ['带领宫人迎接李隆基'], mobileFontSize: 17 }),
  ]);
}

function makeFigmaAfterSix(): StoryBlock {
  const base = 11100;
  const h = 650;
  const mh = 720;
  const text = '上官婉儿死后，睿宗朝恢复了她的昭容名位。太平公主随后请求朝廷收集她散失的诗文。\n\n然而，太平与李隆基的同盟没有维持多久。 公元713年，李隆基诛杀太平公主的党羽。太平逃入山寺，三日后返回府中，被赐死于家。\n\n此后不久，上官婉儿的墓遭到人为的大规模破坏。 墓室被毁，随葬之物散失，许多曾经存在过的痕迹也被一并抹去……';
  return makeFigmaStoryBlock('story-figma-after-six', '尾声', h, mh, [
    figmaText('figma-after6-copy', text, { x: 427, y: 11152, w: 871, h: 300 }, { x: 25, y: 58, w: 340, h: 500 }, h, mh, base, 'fade', { bold: ['上官婉儿', '太平公主', '李隆基'], align: 'left', mobileFontSize: 17 }),
  ]);
}

function makeFigmaPostGalleryNarrative(): StoryBlock {
  const h = 1550;
  const mh = 1700;
  const wanerText = '上官婉儿被归入韦皇后与武三思一方，成了淫乱失德、依附权势、扰乱朝政的内廷女官。 《旧唐书》写：“婉儿既与武三思淫乱。” 《新唐书》又写：“婉儿与近嬖至皆营外宅，邪人秽夫争候门下，肆狎昵，因以求剧职要官。与崔湜乱，遂引知政事。”';
  const taipingText = '太平公主则被写成贪恋权位、意图夺权，最终败亡的公主。 《资治通鉴》说她轻视年轻的李隆基，想要：“更择暗弱者立之，以久其权。” 两人共同拟诏也被解释为婉儿临危时的政治投机。';
  const rivalryText = '到了后世的通俗讲述里，婉儿与崔湜的往来、崔湜后来依附太平的政治纠葛， 又被拼接成两名女性争夺同一个男人的故事。 她们就这样被误写成了彼此争权、争人的政敌与情敌。';

  return makeFigmaStoryBlock('story-figma-post-gallery', '史书中的误写', h, mh, [
    figmaImage('figma-post-gallery-waner-image', 'figma-post6-misread-waner', { x: 172, y: 265, w: 531, h: 354 }, { x: 25, y: 25, w: 340, h: 227 }, h, mh, 0, 'left'),
    figmaText('figma-post-gallery-waner-copy', wanerText, { x: 739, y: 370, w: 918, h: 128 }, { x: 25, y: 275, w: 340, h: 315 }, h, mh, 0, 'right', { mobileFontSize: 17 }),
    figmaImage('figma-post-gallery-taiping-image', 'figma-post6-misread-taiping', { x: 979, y: 724, w: 531, h: 354 }, { x: 25, y: 630, w: 340, h: 227 }, h, mh, 0, 'right'),
    figmaText('figma-post-gallery-taiping-copy', taipingText, { x: 172, y: 853, w: 770, h: 96 }, { x: 25, y: 885, w: 340, h: 245 }, h, mh, 0, 'left', { mobileFontSize: 17 }),
    figmaImage('figma-post-gallery-rivalry-image', 'figma-post6-misread-rivalry', { x: 172, y: 1157, w: 531, h: 354 }, { x: 25, y: 1170, w: 340, h: 227 }, h, mh, 0, 'left'),
    figmaText('figma-post-gallery-rivalry-copy', rivalryText, { x: 771, y: 1286, w: 886, h: 96 }, { x: 25, y: 1425, w: 340, h: 240 }, h, mh, 0, 'right', { mobileFontSize: 17 }),
  ]);
}

function makeSpecialExperienceBlock(id: string, title: string): StoryBlock {
  const block = makeStoryBlock(title);
  block.id = id;
  block.panels[0].name = title;
  block.stickyFocus = { ...makeStoryStickyFocusConfig(), enabled: false };
  return block;
}

function makeWindGalleryBlock(): StoryBlock {
  return makeSpecialExperienceBlock('story-wind-dissolve-gallery', '十八格风化画廊');
}

function makeFinalChapterBlock(): StoryBlock {
  const block = makeSpecialExperienceBlock('story-final-chapter', '最终章 · 千载昭明');
  block.finalChapterConfig = {};
  return block;
}

function makeFigmaEpilogue(): StoryBlock {
  const base = 14582;
  const h = 1720;
  const mh = 2500;
  const opening = '一千三百零三年后。 2013年，考古人员在陕西咸阳发掘了一座唐墓。';
  const bodyOne = '墓葬早已被毁，棺椁与遗骨不存，只剩甬道中的一方墓志。 志盖上刻着九个篆字：大唐故昭容上官氏铭。 墓主人正是上官婉儿。 随着墓志上的文字被逐字释读，研究者们又看见了另一个熟悉的名字，太平公主。';
  const bodyTwo = '墓志写道： “太平公主哀伤，赙赠绢五百匹，遣使吊祭，词旨绸缪。” “绸缪”，本有缠绵、情意深厚之意。';
  const bodyThree = '可在传统史书中，她们常被放在对立的位置。 既然如此，太平公主为何会在婉儿死后如此哀伤，又为何留下这样一场郑重的吊祭？';
  const bodyFour = '于是，人们开始重新翻检史书。 越来越多研究者发现，原本被写成敌对双方的两个人，关系并没有那么简单。';
  const bodyFive = '史书更多记下的是党争、立场与胜负，可这一方墓志，却留下了另一种声音。 写她的离去，如潇湘断流，如山岳倾覆，写她的才华，如明珠沉没，如连城之玉破碎。';
  const bodySix = '仿佛有人在很久以前便已知道，这样一个人的一生，也许有一天会被误解、被改写、被遗忘。 所以要把她的名字刻下来。';
  const closing = '愿她的名字不随尘土埋没。 愿她的才华不随毁誉消散。 愿后世仍有人记得，仍有人传颂。 千年万岁，椒花颂声。';

  return makeFigmaStoryBlock('story-figma-epilogue', '千载昭明 · 尾声', h, mh, [
    figmaText('figma-epilogue-scroll', '下滑让故事继续', { x: 789, y: base, w: 154, h: 32 }, { x: 35, y: 20, w: 320, h: 45 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 16 }),
    figmaImage('figma-epilogue-scroll-arrow', 'figma-scroll-arrow', { x: 859, y: base + 46, w: 15, h: 29 }, { x: 188, y: 67, w: 14, h: 26 }, h, mh, base, 'fade', 20),
    figmaImage('figma-epilogue-monument-image', 'figma-epilogue-monument', { x: 509, y: base + 154, w: 118, h: 229 }, { x: 144, y: 120, w: 102, h: 198 }, h, mh, base, 'left'),
    figmaText('figma-epilogue-opening', opening, { x: 656, y: base + 238, w: 466, h: 74 }, { x: 25, y: 340, w: 340, h: 110 }, h, mh, base, 'right', { bold: ['2013年'], mobileFontSize: 18 }),
    figmaText('figma-epilogue-body-one', bodyOne, { x: 449, y: base + 424, w: 792, h: 128 }, { x: 25, y: 480, w: 340, h: 250 }, h, mh, base, 'fade', { bold: ['大唐故昭容上官氏铭', '上官婉儿', '太平公主'], mobileFontSize: 17 }),
    figmaImage('figma-epilogue-tombstone-image', 'figma-epilogue-tombstone', { x: 449, y: base + 552, w: 346, h: 167 }, { x: 25, y: 760, w: 340, h: 164 }, h, mh, base, 'left'),
    figmaText('figma-epilogue-body-two', bodyTwo, { x: 765, y: base + 655, w: 682, h: 64 }, { x: 25, y: 955, w: 340, h: 160 }, h, mh, base, 'right', { bold: ['太平公主', '绸缪'], mobileFontSize: 17 }),
    figmaText('figma-epilogue-body-three', bodyThree, { x: 438, y: base + 785, w: 814, h: 64 }, { x: 25, y: 1140, w: 340, h: 170 }, h, mh, base, 'fade', { bold: ['太平公主', '婉儿'], mobileFontSize: 17 }),
    figmaImage('figma-epilogue-reader-image', 'figma-epilogue-reader', { x: 991, y: base + 868, w: 194, h: 164 }, { x: 98, y: 1330, w: 194, h: 164 }, h, mh, base, 'right'),
    figmaText('figma-epilogue-body-four', bodyFour, { x: 438, y: base + 924, w: 536, h: 96 }, { x: 25, y: 1520, w: 340, h: 180 }, h, mh, base, 'left', { mobileFontSize: 17 }),
    figmaText('figma-epilogue-body-five', bodyFive, { x: 438, y: base + 1088, w: 836, h: 64 }, { x: 25, y: 1730, w: 340, h: 180 }, h, mh, base, 'fade', { mobileFontSize: 17 }),
    figmaText('figma-epilogue-body-six', bodySix, { x: 438, y: base + 1172, w: 902, h: 64 }, { x: 25, y: 1940, w: 340, h: 170 }, h, mh, base, 'fade', { mobileFontSize: 17 }),
    figmaImage('figma-epilogue-women-image', 'figma-epilogue-women', { x: 509, y: base + 1291, w: 185, h: 252 }, { x: 25, y: 2140, w: 160, h: 218 }, h, mh, base, 'left'),
    figmaText('figma-epilogue-closing', closing, { x: 735, y: base + 1373, w: 330, h: 128 }, { x: 205, y: 2130, w: 160, h: 220 }, h, mh, base, 'right', { mobileFontSize: 17 }),
    figmaText('figma-epilogue-end', '- 完 -', { x: 789, y: base + 1638, w: 150, h: 42 }, { x: 145, y: 2425, w: 100, h: 42 }, h, mh, base, 'fade', { align: 'center', fontSize: 20, mobileFontSize: 18 }),
  ]);
}

function applyFigmaContentRepairs(project: ProjectDocument): ProjectDocument {
  const intro = project.blocks.find((block): block is StoryBlock => block.kind === 'story' && block.id === 'story-figma-intro');
  const introPanel = intro?.panels[0];
  const bubble = introPanel?.layers.find((layer) => layer.id === 'figma-intro-bubble-layer');
  if (bubble?.mobile) Object.assign(bubble.mobile, mobileRect({ x: 130, y: 785, w: 225, h: 44 }, 1480));
  const dialogue = introPanel?.layers.find((layer): layer is StoryTextLayer => layer.kind === 'text' && layer.id === 'figma-intro-dialogue');
  if (dialogue?.mobile) {
    Object.assign(dialogue.mobile, mobileRect({ x: 216, y: 796, w: 134, h: 28 }, 1480), { fontSize: 14 });
    dialogue.textAlign = 'center';
  }

  const afterFive = project.blocks.find((block): block is StoryBlock => block.kind === 'story' && block.id === 'story-figma-after-five');
  const afterFivePanel = afterFive?.panels[0];
  if (afterFivePanel) {
    const candleImage = afterFivePanel.layers.find((layer) => layer.id === 'figma-after5-wei');
    if (candleImage) {
      candleImage.name = '上官婉儿持烛迎接李隆基';
      if (candleImage.y > 67) candleImage.y = 65;
    }
    if (!afterFivePanel.layers.some((layer) => layer.id === 'figma-after5-candle-copy')) {
      const seeded = makeFigmaAfterFive().panels[0].layers.find((layer) => layer.id === 'figma-after5-candle-copy');
      if (seeded) afterFivePanel.layers.push(seeded);
    }
  }

  const afterSix = project.blocks.find((block): block is StoryBlock => block.kind === 'story' && block.id === 'story-figma-after-six');
  const afterSixCopy = afterSix?.panels[0]?.layers.find((layer) => layer.id === 'figma-after6-copy');
  if (afterSixCopy && afterSixCopy.h < 40) afterSixCopy.h = (300 / 650) * 100;

  const epilogue = project.blocks.find((block): block is StoryBlock => block.kind === 'story' && block.id === 'story-figma-epilogue');
  const end = epilogue?.panels[0]?.layers.find((layer) => layer.id === 'figma-epilogue-end');
  if (end && end.w < 5) Object.assign(end, percentRect({ x: 789, y: 14582 + 1638, w: 150, h: 42 }, 1720, 14582));
  return project;
}

function applyFigmaLayoutSeed(project: ProjectDocument): ProjectDocument {
  Object.assign(project.assets, FIGMA_STORY_ASSETS);
  const currentSeedVersion = project.settings.figmaLayoutSeedVersion ?? 0;
  if (currentSeedVersion >= FIGMA_LAYOUT_SEED_VERSION) return project;

  // Version 8 backfills the editable Figma epilogue after the final chapter. Preserve every user-created
  // block while replacing only the seeded tail and its special experience markers.
  if (currentSeedVersion >= 3) {
    const previousFinalChapterConfig = project.blocks.find(
      (block): block is StoryBlock => block.kind === 'story' && block.id === 'story-final-chapter',
    )?.finalChapterConfig;
    const retained = project.blocks.filter(
      (block) => block.id !== 'story-figma-after-six'
        && block.id !== 'story-wind-dissolve-gallery'
        && block.id !== 'story-figma-post-gallery'
        && block.id !== 'story-final-chapter'
        && block.id !== 'story-figma-epilogue',
    );
    const levelSixIndex = retained.findIndex(
      (block) => block.id === 'level-six' || (block.kind === 'level' && block.displayNumber === 6),
    );
    const insertionIndex = levelSixIndex >= 0 ? levelSixIndex + 1 : retained.length;
    const finalChapter = makeFinalChapterBlock();
    if (previousFinalChapterConfig) {
      finalChapter.finalChapterConfig = {
        layout: previousFinalChapterConfig.layout
          ? Object.fromEntries(Object.entries(previousFinalChapterConfig.layout).map(([id, value]) => [id, { ...value }]))
          : undefined,
        layerOverrides: previousFinalChapterConfig.layerOverrides
          ? Object.fromEntries(Object.entries(previousFinalChapterConfig.layerOverrides).map(([id, value]) => [id, { ...value }]))
          : undefined,
      };
    }
    retained.splice(
      insertionIndex,
      0,
      makeFigmaAfterSix(),
      makeWindGalleryBlock(),
      makeFigmaPostGalleryNarrative(),
      finalChapter,
      makeFigmaEpilogue(),
    );
    project.blocks = retained;
    project.settings.figmaLayoutSeedVersion = FIGMA_LAYOUT_SEED_VERSION;
    return project;
  }

  const levels = new Map<number, LevelBlock>();
  project.blocks.forEach((block) => {
    if (block.kind === 'level' && !levels.has(block.displayNumber)) levels.set(block.displayNumber, block);
  });
  const levelOne = levels.get(1) ?? makeLevelBlock(1);
  const levelTwo = levels.get(2) ?? makeLevelBlock(2);
  const levelThree = levels.get(3) ?? makeLevelBlock(3);
  const levelFour = levels.get(4) ?? makeLevelBlock(4);
  const levelFive = levels.get(5) ?? makeLevelBlock(5);
  const levelSix = levels.get(6) ?? makeLevelBlock(6);
  levelOne.id = 'level-one';
  levelTwo.id = 'level-two';
  levelThree.id = 'level-three';
  levelFour.id = 'level-four';
  levelFive.id = 'level-five';
  levelSix.id = 'level-six';
  levelOne.title = '罪臣之女';
  levelTwo.title = '帝王之女';
  levelThree.title = '同游共宴';
  levelFour.title = '政局相逢';
  levelFive.title = '共拟遗诏';
  levelSix.title = '太平吊祭';

  const figmaLayout = {
    prompt: { x: 35.76, y: 13.25, w: 35.02 },
    'slot-0': { x: 3.41, y: 22.74, w: 30.73 },
    'slot-1': { x: 34.66, y: 22.74, w: 30.73 },
    'slot-2': { x: 65.91, y: 22.74, w: 30.73 },
  };
  levelOne.levelOneConfig = { ...(levelOne.levelOneConfig ?? {}), layout: { ...(levelOne.levelOneConfig?.layout ?? {}), ...figmaLayout } };
  levelTwo.levelTwoConfig = { ...(levelTwo.levelTwoConfig ?? {}), layout: { ...(levelTwo.levelTwoConfig?.layout ?? {}), ...figmaLayout } };
  levelThree.levelThreeConfig = { ...(levelThree.levelThreeConfig ?? {}), layout: { ...(levelThree.levelThreeConfig?.layout ?? {}), ...figmaLayout } };
  const wideFigmaLayout = {
    prompt: { x: 23.67, y: 13.25, w: 52.6 },
    'slot-0': { x: 3.01, y: 22.74, w: 30.73 },
    'slot-1': { x: 34.49, y: 22.74, w: 30.73 },
    'slot-2': { x: 65.97, y: 22.74, w: 30.73 },
  };
  levelFour.levelFourConfig = { ...(levelFour.levelFourConfig ?? {}), layout: { ...(levelFour.levelFourConfig?.layout ?? {}), ...wideFigmaLayout } };
  levelFive.levelFiveConfig = { ...(levelFive.levelFiveConfig ?? {}), layout: { ...(levelFive.levelFiveConfig?.layout ?? {}), ...wideFigmaLayout } };
  levelSix.levelSixConfig = { ...(levelSix.levelSixConfig ?? {}), layout: { ...(levelSix.levelSixConfig?.layout ?? {}), ...wideFigmaLayout } };

  project.blocks = [
    makeFigmaIntro(),
    levelOne,
    makeFigmaAfterOne(),
    levelTwo,
    makeFigmaAfterTwo(),
    levelThree,
    makeFigmaAfterThree(),
    levelFour,
    makeFigmaAfterFour(),
    levelFive,
    makeFigmaAfterFive(),
    levelSix,
    makeFigmaAfterSix(),
    makeWindGalleryBlock(),
    makeFigmaPostGalleryNarrative(),
    makeFinalChapterBlock(),
    makeFigmaEpilogue(),
  ];
  project.meta.title = '';
  project.meta.description = '';
  project.settings.figmaLayoutSeedVersion = FIGMA_LAYOUT_SEED_VERSION;
  return project;
}

export function makeDefaultProject(): ProjectDocument {
  const now = new Date().toISOString();
  const assets: Record<string, StudioAsset> = {
    'builtin-paper': {
      id: 'builtin-paper',
      name: '婉平之交纸张背景',
      kind: 'image',
      mimeType: 'image/png',
      byteLength: 0,
      url: CANONICAL_CORE_ASSET_URLS['builtin-paper'],
      builtIn: true,
    },
    'builtin-waner': {
      id: 'builtin-waner',
      name: '示例 · 上官婉儿',
      kind: 'image',
      mimeType: 'image/png',
      byteLength: 0,
      url: CANONICAL_CORE_ASSET_URLS['builtin-waner'],
      builtIn: true,
    },
    'builtin-taiping': {
      id: 'builtin-taiping',
      name: '示例 · 太平公主',
      kind: 'image',
      mimeType: 'image/png',
      byteLength: 0,
      url: CANONICAL_CORE_ASSET_URLS['builtin-taiping'],
      builtIn: true,
    },
    'builtin-edict': {
      id: 'builtin-edict',
      name: '示例 · 诏令',
      kind: 'image',
      mimeType: 'image/png',
      byteLength: 0,
      url: CANONICAL_CORE_ASSET_URLS['builtin-edict'],
      builtIn: true,
    },
    ...FIGMA_STORY_ASSETS,
  };

  const intro: StoryBlock = {
    id: 'story-prologue',
    kind: 'story',
    title: '序章 · 六关之前',
    enabled: true,
    panels: [
      makeStoryPanel({
        id: 'panel-prologue-1',
        name: '时代背景',
        assetId: 'builtin-waner',
        text: '',
        layout: 'image-left',
        bubbleStyle: 'paper',
        stickySide: 'left',
        motion: { ...DEFAULT_MOTION, enter: 'left', exit: 'left', parallax: 'main' },
      }),
      makeStoryPanel({
        id: 'panel-prologue-2',
        name: '人物交错',
        assetId: 'builtin-taiping',
        text: '',
        layout: 'image-right',
        bubbleStyle: 'ink',
        stickySide: 'right',
        motion: { ...DEFAULT_MOTION, enter: 'right', exit: 'right', parallax: 'near', delay: 100 },
      }),
    ],
    stickyFocus: makeStoryStickyFocusConfig(),
    audio: { trigger: 'none', loop: false, volume: 0.65, fadeOut: true },
  };

  const levelOne = makeLevelBlock(1);
  levelOne.id = 'level-one';
  levelOne.title = '第一关 · 才华初显';

  const levelTwo = makeLevelBlock(2);
  levelTwo.id = 'level-two';
  levelTwo.title = '第二关 · 才华得宠';

  const levelThree = makeLevelBlock(3);
  levelThree.id = 'level-three';
  levelThree.title = '第三关 · 共游同宴';

  const levelFive: LevelBlock = {
    id: 'level-five',
    kind: 'level',
    title: '第五关 · 婉平之交',
    enabled: true,
    displayNumber: 5,
    template: 'level-five',
    configured: true,
    requiredToContinue: true,
    levelFiveConfig: {},
  };

  const levelSix: LevelBlock = {
    id: 'level-six',
    kind: 'level',
    title: '第六关 · 吊祭婉儿',
    enabled: true,
    displayNumber: 6,
    template: 'level-six',
    configured: true,
    requiredToContinue: true,
    levelSixConfig: {},
  };

  const levelFour: LevelBlock = {
    id: 'level-four',
    kind: 'level',
    title: '第四关 · 政治立场',
    enabled: true,
    displayNumber: 4,
    template: 'level-four',
    configured: true,
    requiredToContinue: true,
    levelFourConfig: {},
  };

  const aftermath: StoryBlock = {
    id: 'story-after-five',
    kind: 'story',
    title: '第五关之后 · 过场',
    enabled: true,
    panels: [
      makeStoryPanel({
        id: 'panel-after-five-1',
        name: '通关后的过场',
        assetId: 'builtin-edict',
        text: '',
        layout: 'image-left',
        bubbleStyle: 'scroll',
        motion: { ...DEFAULT_MOTION, enter: 'up', exit: 'fade', parallax: 'far' },
      }),
    ],
    stickyFocus: makeStoryStickyFocusConfig(),
    audio: { trigger: 'none', loop: false, volume: 0.65, fadeOut: true },
  };

  const project: ProjectDocument = {
    schema: 'wanping-project',
    version: 1,
    projectId: 'wanping-main',
    revision: 1,
    createdAt: now,
    updatedAt: now,
    meta: {
      title: '婉平之交',
      titleStyle: makeEditableHeadingStyle(),
      description: '',
      locale: 'zh-CN',
    },
    theme: {
      fontFamily: 'historical-serif',
      backgroundAssetId: 'builtin-paper',
      backgroundParallax: 0.28,
      ink: '#312d29',
      paper: '#f3eee4',
      accent: '#a84431',
    },
    assets,
    blocks: [intro, levelOne, levelTwo, levelThree, levelFour, levelFive, aftermath, levelSix],
    settings: {
      initialMuted: true,
      motionPreference: 'system',
      levelFourSeeded: true,
      levelSixSeeded: true,
      completionFlowVersion: 1,
    },
  };
  return applyChoiceLayoutMigration(applyFigmaContentRepairs(ensureOpeningPage(applyFigmaLayoutSeed(project))));
}

const CANVAS_ASPECTS: readonly CanvasAspect[] = ['16:9', '4:3', '3:4', '9:16'];
const MOTION_PRESETS: readonly MotionPreset[] = ['none', 'fade', 'left', 'right', 'up', 'down', 'soft-scale', 'particle-gather', 'particle-scatter', 'bubble-pop'];
const MOTION_PLAYBACKS: readonly MotionPlayback[] = ['once', 'reenter'];
const MOTION_DURATIONS: readonly MotionDuration[] = [320, 600, 900];
const PARALLAX_DEPTHS: readonly ParallaxDepth[] = ['far', 'main', 'near'];
const TEXT_ALIGNS: readonly StoryTextLayer['textAlign'][] = ['left', 'center', 'right'];
const BUBBLE_STYLES: readonly BubbleStyle[] = ['none', 'paper', 'ink', 'scroll', 'custom'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isOneOf<T extends string | number>(value: unknown, allowed: readonly T[]): value is T {
  return allowed.includes(value as T);
}

function assertFiniteNumber(value: unknown, label: string, min = -Infinity, max = Infinity): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label}不是有效数值。`);
  }
}

function assertMotionConfig(value: unknown, owner: string): asserts value is MotionConfig {
  if (!isRecord(value)
    || !isOneOf(value.enter, MOTION_PRESETS)
    || !isOneOf(value.exit, MOTION_PRESETS)
    || !isOneOf(value.playback, MOTION_PLAYBACKS)
    || !isOneOf(value.duration, MOTION_DURATIONS)
    || !isOneOf(value.parallax, PARALLAX_DEPTHS)) {
    throw new Error(`“${owner}”包含无效的动效设置。`);
  }
  assertFiniteNumber(value.delay, `“${owner}”的动效延迟`, 0, 5000);
}

function assertEditableHeadingStyle(value: unknown, owner: string): asserts value is EditableHeadingStyle {
  if (!isRecord(value)
    || typeof value.color !== 'string'
    || !value.color.trim()
    || !isOneOf(value.textAlign, TEXT_ALIGNS)
    || typeof value.verticalText !== 'boolean') {
    throw new Error(`“${owner}”包含无效的标题文字设置。`);
  }
  assertFiniteNumber(value.x, `“${owner}”的标题 X 坐标`);
  assertFiniteNumber(value.y, `“${owner}”的标题 Y 坐标`);
  assertFiniteNumber(value.w, `“${owner}”的标题宽度`, 1);
  assertFiniteNumber(value.h, `“${owner}”的标题高度`, 1);
  assertFiniteNumber(value.z, `“${owner}”的标题层级`);
  assertFiniteNumber(value.fontSize, `“${owner}”的标题字号`, 8, 240);
  assertFiniteNumber(value.rotation, `“${owner}”的标题旋转角度`, -180, 180);
  assertFiniteNumber(value.opacity, `“${owner}”的标题透明度`, 0, 1);
  assertMotionConfig(value.motion, `${owner}标题`);
}

function normalizeEditableHeadingStyle(value: unknown): EditableHeadingStyle {
  const defaults = makeEditableHeadingStyle();
  if (value === undefined) return defaults;
  if (!isRecord(value)) return value as EditableHeadingStyle;
  return {
    ...defaults,
    ...value,
    motion: value.motion === undefined
      ? { ...defaults.motion }
      : isRecord(value.motion)
        ? { ...defaults.motion, ...value.motion } as MotionConfig
        : value.motion as unknown as MotionConfig,
  } as EditableHeadingStyle;
}

function assertStoryStickyFocus(
  value: unknown,
  owner: string,
  assets: Record<string, StudioAsset>,
): asserts value is StoryStickyFocusConfig {
  if (!isRecord(value) || typeof value.enabled !== 'boolean') {
    throw new Error(`“${owner}”包含无效的固定主图设置。`);
  }
  assertFiniteNumber(value.sizePercent, `“${owner}”的固定主图大小`, 20, 90);
  assertFiniteNumber(value.xPercent, `“${owner}”的固定主图水平位置`, 10, 90);
  assertFiniteNumber(value.topVh, `“${owner}”的固定主图顶部距离`, 0, 40);
  assertFiniteNumber(value.stepHeightVh, `“${owner}”的固定主图滚动间距`, 55, 140);
  if (value.assetId !== undefined) {
    if (typeof value.assetId !== 'string' || !value.assetId || !assets[value.assetId]) {
      throw new Error(`“${owner}”引用了不存在的固定主图。`);
    }
    if (assets[value.assetId].kind !== 'image') {
      throw new Error(`“${owner}”的固定主图必须是普通图片素材。`);
    }
  }
}

function normalizeStoryStickyFocus(value: unknown): StoryStickyFocusConfig {
  const defaults = makeStoryStickyFocusConfig();
  if (value === undefined) return defaults;
  if (!isRecord(value)) return value as StoryStickyFocusConfig;
  return { ...defaults, ...value } as StoryStickyFocusConfig;
}

function assertLayerBase(layer: Record<string, unknown>, owner: string) {
  if (typeof layer.name !== 'string') throw new Error(`“${owner}”包含无效的图层名称。`);
  assertFiniteNumber(layer.x, `“${owner}”的图层 X 坐标`);
  assertFiniteNumber(layer.y, `“${owner}”的图层 Y 坐标`);
  // Figma layouts legitimately use very small decorative layers (for example
  // the 15px scroll arrow on a 1728px canvas is under one percent wide).
  assertFiniteNumber(layer.w, `“${owner}”的图层宽度`, 0.05);
  assertFiniteNumber(layer.h, `“${owner}”的图层高度`, 0.05);
  assertFiniteNumber(layer.z, `“${owner}”的图层层级`);
  assertFiniteNumber(layer.rotation, `“${owner}”的图层旋转角度`);
  assertFiniteNumber(layer.opacity, `“${owner}”的图层透明度`, 0, 1);
  assertMotionConfig(layer.motion, typeof layer.name === 'string' && layer.name ? layer.name : owner);
  if (layer.mobile !== undefined) {
    if (!isRecord(layer.mobile)) throw new Error(`“${owner}”包含无效的手机图层布局。`);
    assertFiniteNumber(layer.mobile.x, `“${owner}”的手机图层 X 坐标`);
    assertFiniteNumber(layer.mobile.y, `“${owner}”的手机图层 Y 坐标`);
    assertFiniteNumber(layer.mobile.w, `“${owner}”的手机图层宽度`, 1);
    assertFiniteNumber(layer.mobile.h, `“${owner}”的手机图层高度`, 1);
    for (const field of ['fontSize', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const) {
      if (layer.mobile[field] !== undefined) {
        assertFiniteNumber(layer.mobile[field], `“${owner}”的手机图层 ${field}`, 0, field === 'fontSize' ? 120 : 90);
      }
    }
  }
}

function assertStoryCanvas(value: unknown, owner: string) {
  if (!isRecord(value) || value.mode !== 'continuous') throw new Error(`“${owner}”包含无效的连续画布。`);
  assertFiniteNumber(value.designWidth, `“${owner}”的画布宽度`, 320, 4096);
  assertFiniteNumber(value.designHeight, `“${owner}”的画布高度`, 100, 24000);
  assertFiniteNumber(value.mobileDesignWidth, `“${owner}”的手机画布宽度`, 280, 1024);
  assertFiniteNumber(value.mobileDesignHeight, `“${owner}”的手机画布高度`, 100, 24000);
  if (value.source !== undefined && value.source !== 'figma' && value.source !== 'editor') {
    throw new Error(`“${owner}”包含无效的画布来源。`);
  }
}

function assertCausalLevelConfig(value: unknown, owner: string, levelLabel: string): asserts value is CausalLevelConfig {
  if (!isRecord(value)) throw new Error(`“${owner}”包含无效的${levelLabel}配置。`);

  const validateEntries = (entries: unknown, fields: readonly string[], label: string) => {
    if (entries === undefined) return;
    if (!isRecord(entries)) throw new Error(`“${owner}”的${label}结构无效。`);
    for (const [key, entry] of Object.entries(entries)) {
      if (!isRecord(entry)) throw new Error(`“${owner}”的${label}“${key}”结构无效。`);
      for (const field of fields) {
        assertFiniteNumber(entry[field], `“${owner}”的${label}“${key}”.${field}`);
      }
    }
  };

  validateEntries(value.layout, ['x', 'y', 'w'], '布局项');
  validateEntries(value.layerOverrides, ['x', 'y', 'w', 'z'], '图层覆盖项');
}

function assertLevelOneConfig(value: unknown, owner: string): asserts value is LevelOneConfig {
  assertCausalLevelConfig(value, owner, '第一关');
}

function assertLevelTwoConfig(value: unknown, owner: string): asserts value is LevelTwoConfig {
  assertCausalLevelConfig(value, owner, '第二关');
}

function assertLevelThreeConfig(value: unknown, owner: string): asserts value is LevelThreeConfig {
  assertCausalLevelConfig(value, owner, '第三关');
}

function assertLevelFourConfig(value: unknown, owner: string): asserts value is LevelFourConfig {
  assertCausalLevelConfig(value, owner, '第四关');
}

function assertLevelFiveConfig(value: unknown, owner: string): asserts value is LevelFiveConfig {
  assertCausalLevelConfig(value, owner, '第五关');
}

function assertLevelSixConfig(value: unknown, owner: string): asserts value is LevelSixConfig {
  assertCausalLevelConfig(value, owner, '第六关');
}

export function assertProjectDocument(value: unknown): asserts value is ProjectDocument {
  if (!value || typeof value !== 'object') throw new Error('项目文件不是有效对象。');
  const project = value as Partial<ProjectDocument>;
  if (project.schema !== 'wanping-project' || project.version !== 1) {
    throw new Error('项目版本不受支持，请使用当前编辑器导出的项目包。');
  }
  if (!project.meta || typeof project.meta.title !== 'string') throw new Error('项目缺少标题。');
  assertEditableHeadingStyle(project.meta.titleStyle, '网站');
  if (!project.assets || typeof project.assets !== 'object') throw new Error('项目缺少素材库。');
  if (!Array.isArray(project.blocks)) throw new Error('项目缺少故事大纲。');

  const blockIds = new Set<string>();
  for (const block of project.blocks) {
    if (!block?.id || blockIds.has(block.id)) throw new Error('故事大纲中存在无效或重复的区块 ID。');
    blockIds.add(block.id);
    if (block.kind === 'story') {
      if (!Array.isArray(block.panels)) throw new Error(`“${block.title}”缺少漫画画面。`);
      if (block.finalChapterConfig !== undefined) {
        assertCausalLevelConfig(block.finalChapterConfig, block.title, '最终章');
      }
      if (block.stickyFocus !== undefined) assertStoryStickyFocus(block.stickyFocus, block.title, project.assets);
      const panelIds = new Set<string>();
      for (const panel of block.panels) {
        if (!panel.id || panelIds.has(panel.id)) throw new Error(`“${block.title}”存在重复画面。`);
        panelIds.add(panel.id);
        if (!isOneOf(panel.canvasAspect, CANVAS_ASPECTS)) throw new Error(`“${panel.name}”的画布比例无效。`);
        if (panel.canvas !== undefined) assertStoryCanvas(panel.canvas, panel.name);
        if (panel.stickySide !== undefined && !isOneOf(panel.stickySide, ['left', 'right'] as const)) {
          throw new Error(`“${panel.name}”的固定主图侧栏位置无效。`);
        }
        assertMotionConfig(panel.motion, panel.name);
        if (panel.assetId && !project.assets[panel.assetId]) throw new Error(`“${panel.name}”引用了不存在的图片。`);
        if (panel.bubbleAssetId && !project.assets[panel.bubbleAssetId]) throw new Error(`“${panel.name}”引用了不存在的气泡。`);
        if (!Array.isArray(panel.layers)) throw new Error(`“${panel.name}”缺少自由画布图层。`);
        const layerIds = new Set<string>();
        for (const layer of panel.layers) {
          if (!isRecord(layer)
            || typeof layer.id !== 'string'
            || !layer.id
            || (layer.kind !== 'image' && layer.kind !== 'text')) {
            throw new Error(`“${panel.name}”包含无效图层。`);
          }
          if (layerIds.has(layer.id)) throw new Error(`“${panel.name}”存在重复图层 ID。`);
          layerIds.add(layer.id);
          assertLayerBase(layer, panel.name);

          if (layer.kind === 'image') {
            if (typeof layer.assetId !== 'string' || !layer.assetId || !project.assets[layer.assetId]) {
              throw new Error(`“${layer.name}”引用了不存在的图片。`);
            }
            if (!isOneOf(layer.fit, ['contain', 'cover'] as const)) throw new Error(`“${layer.name}”的图片适配方式无效。`);
            assertFiniteNumber(layer.cropZoom, `“${layer.name}”的裁切缩放`, 1, 4);
            assertFiniteNumber(layer.cropX, `“${layer.name}”的裁切焦点 X`, -50, 50);
            assertFiniteNumber(layer.cropY, `“${layer.name}”的裁切焦点 Y`, -50, 50);
            if (typeof layer.flipX !== 'boolean' || typeof layer.flipY !== 'boolean') {
              throw new Error(`“${layer.name}”包含无效的图片镜像设置。`);
            }
          } else {
            if (typeof layer.text !== 'string'
              || !Array.isArray(layer.boldRanges)
              || typeof layer.color !== 'string'
              || !isOneOf(layer.textAlign, TEXT_ALIGNS)
              || typeof layer.verticalText !== 'boolean'
              || !isOneOf(layer.bubbleStyle, BUBBLE_STYLES)) {
              throw new Error(`“${layer.name}”包含无效的文字设置。`);
            }
            if (layer.boldRanges.length > 256) throw new Error(`“${layer.name}”包含过多局部加粗片段。`);
            for (const range of layer.boldRanges) {
              if (!isRecord(range)
                || !Number.isInteger(range.start)
                || !Number.isInteger(range.end)
                || (range.start as number) < 0
                || (range.end as number) <= (range.start as number)
                || (range.end as number) > layer.text.length) {
                throw new Error(`“${layer.name}”包含无效的局部加粗范围。`);
              }
            }
            assertFiniteNumber(layer.fontSize, `“${layer.name}”的字号`, 10, 120);
            assertFiniteNumber(layer.padding, `“${layer.name}”的文字内边距`, 0, 60);
            assertFiniteNumber(layer.paddingTop, `“${layer.name}”的上方安全区`, 0, 90);
            assertFiniteNumber(layer.paddingRight, `“${layer.name}”的右侧安全区`, 0, 90);
            assertFiniteNumber(layer.paddingBottom, `“${layer.name}”的下方安全区`, 0, 90);
            assertFiniteNumber(layer.paddingLeft, `“${layer.name}”的左侧安全区`, 0, 90);
            if (layer.bubbleAssetId !== undefined
              && (typeof layer.bubbleAssetId !== 'string' || !layer.bubbleAssetId || !project.assets[layer.bubbleAssetId])) {
              throw new Error(`“${layer.name}”引用了不存在的气泡。`);
            }
          }
        }
      }
      if (!isRecord(block.audio)
        || !isOneOf(block.audio.trigger, ['none', 'section-enter', 'click'] as const)
        || typeof block.audio.loop !== 'boolean'
        || typeof block.audio.fadeOut !== 'boolean') {
        throw new Error(`“${block.title}”包含无效的声音设置。`);
      }
      assertFiniteNumber(block.audio.volume, `“${block.title}”的音量`, 0, 1);
      if (block.audio.assetId !== undefined) {
        if (typeof block.audio.assetId !== 'string' || !block.audio.assetId || !project.assets[block.audio.assetId]) {
          throw new Error(`“${block.title}”引用了不存在的声音。`);
        }
        if (project.assets[block.audio.assetId].kind !== 'audio') throw new Error(`“${block.title}”引用的素材不是声音。`);
      }
    } else if (block.kind !== 'level') {
      throw new Error('项目包含未知的区块类型。');
    } else {
      if (!isOneOf(block.template, ['level-one', 'level-two', 'level-three', 'level-four', 'level-five', 'level-six', 'placeholder'] as const)) {
        throw new Error(`“${block.title}”包含未知的关卡模板。`);
      }
      assertFiniteNumber(block.displayNumber, `“${block.title}”的关卡编号`, 1);
      if (typeof block.configured !== 'boolean' || typeof block.requiredToContinue !== 'boolean') {
        throw new Error(`“${block.title}”包含无效的关卡设置。`);
      }
      if (block.levelOneConfig !== undefined) assertLevelOneConfig(block.levelOneConfig, block.title);
      if (block.levelTwoConfig !== undefined) assertLevelTwoConfig(block.levelTwoConfig, block.title);
      if (block.levelThreeConfig !== undefined) assertLevelThreeConfig(block.levelThreeConfig, block.title);
      if (block.levelFourConfig !== undefined) assertLevelFourConfig(block.levelFourConfig, block.title);
      if (block.levelFiveConfig !== undefined) assertLevelFiveConfig(block.levelFiveConfig, block.title);
      if (block.levelSixConfig !== undefined) assertLevelSixConfig(block.levelSixConfig, block.title);
    }
  }

  for (const asset of Object.values(project.assets)) {
    if (!asset.id || !asset.url || !['image', 'audio', 'bubble'].includes(asset.kind)) throw new Error('素材库中存在无效素材。');
    if (asset.builtIn && !asset.url.startsWith('/assets/')) throw new Error(`内置素材“${asset.name}”路径不安全。`);
    if (!asset.builtIn && !/^data:(image|audio)\//.test(asset.url)) throw new Error(`素材“${asset.name}”格式不安全。`);
    if (/^data:(image\/svg\+xml|text\/html|application\/javascript)/i.test(asset.url)) throw new Error(`素材“${asset.name}”格式不受支持。`);
  }
}

export function normalizeProjectDocument(value: unknown): ProjectDocument {
  if (!value || typeof value !== 'object') throw new Error('项目文件不是有效对象。');
  const project = cloneProject(value as ProjectDocument);
  project.settings = {
    initialMuted: true,
    motionPreference: 'system',
    ...(isRecord(project.settings) ? project.settings : {}),
  } as ProjectDocument['settings'];
  const savedAssets = { ...(isRecord(project.assets) ? project.assets : {}) } as Record<string, StudioAsset>;
  Object.entries(CANONICAL_CORE_ASSET_URLS).forEach(([id, url]) => {
    if (!savedAssets[id]) return;
    savedAssets[id] = { ...savedAssets[id], url, builtIn: true };
  });
  project.assets = { ...savedAssets, ...FIGMA_STORY_ASSETS };
  if (isRecord(project.meta)) {
    project.meta.titleStyle = normalizeEditableHeadingStyle(project.meta.titleStyle);
  }
  if (Array.isArray(project.blocks)) {
    const starterTexts = new Set([
      '在故事开始之前，先用漫画与文字交代人物、时代与即将发生的变化。你可以替换这张示例图。',
      '每一格都可以选择入场和离场轨道，远景、主体与前景以不同速度滚动。',
      '玩家完成第五关后，这一段才会被解锁。你可以上传新的漫画分镜与音效。',
      '在这里输入这一格漫画旁边的文字。',
      '在这里输入漫画旁边的文字。',
      '双击或在右侧修改气泡上的文字',
      '气泡上的文字',
    ]);
    if (project.meta?.description === '漫画、文字、声音与互动关卡共同组成的滚动叙事。') {
      project.meta.description = '';
    }
    if (project.settings && project.settings.levelFourSeeded !== true) {
      const alreadyHasLevelFour = project.blocks.some(
        (block) => block.kind === 'level' && block.displayNumber === 4,
      );
      if (!alreadyHasLevelFour) {
        const levelFour = makeLevelBlock(4);
        levelFour.title = '第四关 · 政治立场';
        const insertionIndex = project.blocks.findIndex(
          (block) => block.kind === 'level' && block.displayNumber > 4,
        );
        if (insertionIndex >= 0) project.blocks.splice(insertionIndex, 0, levelFour);
        else project.blocks.push(levelFour);
      }
      project.settings.levelFourSeeded = true;
    }
    if (project.settings && project.settings.levelSixSeeded !== true) {
      const existingLevelSix = project.blocks.find(
        (block): block is LevelBlock => block.kind === 'level' && block.displayNumber === 6,
      );
      if (existingLevelSix) {
        existingLevelSix.template = 'level-six';
        existingLevelSix.configured = true;
        existingLevelSix.levelSixConfig = existingLevelSix.levelSixConfig ?? {};
      } else {
        const levelSix = makeLevelBlock(6);
        levelSix.title = '第六关 · 吊祭婉儿';
        const insertionIndex = project.blocks.findIndex(
          (block) => block.kind === 'level' && block.displayNumber > 6,
        );
        if (insertionIndex >= 0) project.blocks.splice(insertionIndex, 0, levelSix);
        else project.blocks.push(levelSix);
      }
      project.settings.levelSixSeeded = true;
    }
    if (project.settings && project.settings.completionFlowVersion !== 1) {
      const afterSix = project.blocks.find(
        (block): block is StoryBlock => block.kind === 'story' && block.id === 'story-figma-after-six',
      );
      const panel = afterSix?.panels[0];
      if (panel) {
        panel.layers = panel.layers.filter(
          (layer) => layer.id !== 'figma-after6-scroll' && layer.id !== 'figma-after6-scroll-arrow',
        );
        const copy = panel.layers.find((layer) => layer.id === 'figma-after6-copy');
        if (copy) {
          copy.y = 8;
          if (copy.mobile) copy.mobile.y = 8;
        }
      }
      project.settings.completionFlowVersion = 1;
    }
    project.blocks.forEach((block) => {
      if (block.kind === 'level') {
        if (block.displayNumber === 1 && block.template === 'placeholder') {
          block.template = 'level-one';
          block.configured = true;
          block.levelOneConfig = block.levelOneConfig ?? {};
        } else if (block.displayNumber === 2 && block.template === 'placeholder') {
          block.template = 'level-two';
          block.configured = true;
          block.levelTwoConfig = block.levelTwoConfig ?? {};
        } else if (block.displayNumber === 3 && block.template === 'placeholder') {
          block.template = 'level-three';
          block.configured = true;
          block.levelThreeConfig = block.levelThreeConfig ?? {};
        } else if (block.displayNumber === 4 && block.template === 'placeholder') {
          block.template = 'level-four';
          block.configured = true;
          block.levelFourConfig = block.levelFourConfig ?? {};
        } else if (block.displayNumber === 5 && block.template === 'placeholder') {
          block.template = 'level-five';
          block.configured = true;
          block.levelFiveConfig = block.levelFiveConfig ?? {};
        } else if (block.displayNumber === 6 && block.template === 'placeholder') {
          block.template = 'level-six';
          block.configured = true;
          block.levelSixConfig = block.levelSixConfig ?? {};
        }
        if (block.template === 'level-four') block.levelFourConfig = block.levelFourConfig ?? {};
        if (block.template === 'level-five') block.levelFiveConfig = block.levelFiveConfig ?? {};
        if (block.template === 'level-six') block.levelSixConfig = block.levelSixConfig ?? {};
        return;
      }
      if (!Array.isArray(block.panels)) return;
      if (block.id === 'story-final-chapter') block.finalChapterConfig = block.finalChapterConfig ?? {};
      block.stickyFocus = normalizeStoryStickyFocus(block.stickyFocus);
      block.panels.forEach((panel, panelIndex) => {
        if (starterTexts.has(panel.text)) panel.text = '';
        panel.canvasAspect = panel.canvasAspect ?? '16:9';
        panel.stickySide = panel.stickySide ?? (panelIndex % 2 === 0 ? 'left' : 'right');
        panel.motion = { ...DEFAULT_MOTION, ...(panel.motion ?? {}) };
        if (!Array.isArray(panel.layers)) panel.layers = legacyLayersForPanel(panel);
        panel.layers.forEach((layer) => {
          layer.motion = { ...DEFAULT_MOTION, ...(layer.motion ?? {}) };
          if (layer.kind === 'image') {
            if (layer.flipX === undefined) layer.flipX = false;
            if (layer.flipY === undefined) layer.flipY = false;
          }
          if (layer.kind === 'text') {
            if (starterTexts.has(layer.text)) layer.text = '';
            const legacyPadding = Number.isFinite(layer.padding) ? layer.padding : 18;
            layer.padding = legacyPadding;
            layer.paddingTop = Number.isFinite(layer.paddingTop) ? layer.paddingTop : legacyPadding;
            layer.paddingRight = Number.isFinite(layer.paddingRight) ? layer.paddingRight : legacyPadding;
            layer.paddingBottom = Number.isFinite(layer.paddingBottom) ? layer.paddingBottom : legacyPadding;
            layer.paddingLeft = Number.isFinite(layer.paddingLeft) ? layer.paddingLeft : legacyPadding;
            const ranges = Array.isArray(layer.boldRanges) ? layer.boldRanges : [];
            const normalized: TextBoldRange[] = [];
            ranges
              .filter((range): range is TextBoldRange => Boolean(range)
                && Number.isInteger(range.start)
                && Number.isInteger(range.end)
                && range.end > range.start)
              .map((range) => ({
                start: Math.max(0, Math.min(layer.text.length, range.start)),
                end: Math.max(0, Math.min(layer.text.length, range.end)),
              }))
              .filter((range) => range.end > range.start)
              .sort((a, b) => a.start - b.start || a.end - b.end)
              .slice(0, 256)
              .forEach((range) => {
                const previous = normalized[normalized.length - 1];
                if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
                else normalized.push(range);
              });
            layer.boldRanges = normalized;
          }
        });
      });
    });
  }
  applyFigmaLayoutSeed(project);
  ensureOpeningPage(project);
  // Content repairs are part of the seeded default project. Do not reapply
  // them every time an existing project is opened: the saved author layout is
  // authoritative and must survive reloads and publishing unchanged.
  applyChoiceLayoutMigration(project);
  assertProjectDocument(project);
  return project;
}

export function cloneProject(project: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(project)) as ProjectDocument;
}
