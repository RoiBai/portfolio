(() => {
  "use strict";
  try {

  if (
    typeof colors === "undefined" ||
    typeof colorRelations === "undefined" ||
    typeof families === "undefined" ||
    !Array.isArray(colors)
  ) {
    return;
  }

  const graphWrap = document.getElementById("graph-wrap");
  const panel = document.getElementById("panel");
  const legend = document.getElementById("legend");
  if (!graphWrap || !panel || !legend) return;

  const FILM_DURATION = 90;
  const COVER_HOLD_END = 2.35;
  const COVER_FADE_END = 3.65;
  const COLOR_ENTRY_START = 2.45;
  const RING_SOURCE_START = 8;
  const SOURCE_READY = 12;
  const SOURCE_FAMILY_START = 30;
  const FAMILY_READY = 34;
  const FAMILY_ARCHIVE_START = 38;
  const ARCHIVE_READY = 40;
  const ARCHIVE_COMPOSE_START = 40;
  const COMPOSE_READY = 42;
  const COMPOSE_END = 85.85;
  const OUTRO_LOGO_START = 85.98;
  const OUTRO_RING_READY = 87.25;
  const COLOR_ENTRY_END = 4.25;
  const RING_READY = 7;
  const RING_SPIN_START = 7;
  const COLOR_FOCUS_SLOT = 2.25;
  const COMPOSE_CARD_COUNT = 5;
  const COMPOSE_LAUNCH_START = 2.3;
  const COMPOSE_LAUNCH_STAGGER = .14;
  const COMPOSE_OUTBOUND_DURATION = 1.05;
  const COMPOSE_LAST_LAND_AT =
    COMPOSE_LAUNCH_START +
    (COMPOSE_CARD_COUNT - 1) * COMPOSE_LAUNCH_STAGGER +
    COMPOSE_OUTBOUND_DURATION;
  const COMPOSE_LANDED_HOLD = 5;
  const COMPOSE_FIRST_RETURN_AT =
    COMPOSE_LAST_LAND_AT + COMPOSE_LANDED_HOLD;
  const COMPOSE_RETURN_STAGGER = .07;
  const COMPOSE_RETURN_DURATION = 1.02;
  const COMPOSE_INPUT_EXIT_AT = 9.9;
  const COMPOSE_SEND_OUT_AT = 10.28;

  const params = new URLSearchParams(window.location.search);
  const recordMode = params.get("record") === "1";
  const musicEnabled = params.get("music") !== "0";
  const RECORD_LOGICAL_WIDTH = 1920;
  const RECORD_LOGICAL_HEIGHT = 1080;
  const FILM_MUSIC_GAIN = .72;
  const FILM_MUSIC_FADE_IN = 1.4;
  const FILM_MUSIC_FADE_OUT = 4.15;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const requestedTime = Number.parseFloat(params.get("time") || "0");
  const initialTime = Number.isFinite(requestedTime)
    ? Math.max(0, Math.min(FILM_DURATION, requestedTime))
    : 0;
  const initiallyPaused = params.get("paused") === "1" || params.has("time");
  const isRecordingMode = () =>
    recordMode || document.body.classList.contains("record-mode");

  const SOURCE_ORDER = ["mineral", "plant", "literary", "nature"];
  const SOURCE_META = {
    mineral: {
      cn: "矿物",
      en: "MINERAL",
      image: "assets/source-photos/mineral-azurite.jpg",
      accent: "#9C5333",
      representatives: ["shiqing", "shilu"]
    },
    plant: {
      cn: "草木",
      en: "PLANT",
      image: "assets/source-photos/plant-indigo.jpg",
      accent: "#4D8A63",
      representatives: ["yanzhi", "tenghuang"]
    },
    nature: {
      cn: "自然",
      en: "NATURE",
      image: "assets/source-photos/nature-huangshan.jpg",
      accent: "#6E9CB3",
      representatives: ["tianshuibi", "cui"]
    },
    literary: {
      cn: "典籍",
      en: "LITERARY",
      image: "assets/source-photos/literary-book.png",
      accent: "#7C1823",
      representatives: ["piao", "xuan"]
    }
  };
  const SOURCE_FOCUS = SOURCE_ORDER.flatMap((category) =>
    SOURCE_META[category].representatives.map((representative) => ({
      category,
      representative
    }))
  );
  const FAMILY_ORDER = Object.keys(families);
  const FAMILY_FOCUS = [
    { id: "red", representative: "qian" },
    { id: "red", representative: "jiang" },
    { id: "yellow", representative: "zhizi" },
    { id: "yellow", representative: "xiang" },
    { id: "green", representative: "songhua" },
    { id: "green", representative: "congqing" },
    { id: "blue", representative: "dianlan" },
    { id: "blue", representative: "kongqing" },
    { id: "purple", representative: "ouhe" },
    { id: "purple", representative: "zipurple" },
    { id: "white", representative: "qianbai" },
    { id: "white", representative: "yuebai" },
    { id: "black", representative: "mo" },
    { id: "black", representative: "zi" },
    { id: "brown", representative: "zheshi" },
    { id: "brown", representative: "chenxiang" }
  ];
  const FAMILY_FOCUS_ENABLED = false;
  const PROVENANCE_FOCUS = [
    {
      representative: "zhusha",
      note: "矿物入色 · 丹砂见礼制与绘事"
    },
    {
      representative: "tianqing",
      note: "天光成色 · 宋瓷承雨过天青"
    }
  ];
  const COMPOSE_PROMPTS = [
    "江南春雨，婉约清雅的茶席设计，素净又温润",
    "敦煌国风海报设计，华贵而富有历史感，热烈中见沉稳",
    "宋代汝窑瓷器感的品牌视觉，清雅禅意，天青月白的意境",
    "文人书房，沉静古朴的品牌视觉，要有深邃的历史感"
  ];
  const COMPOSE_SLOT_DURATION =
    (COMPOSE_END - COMPOSE_READY) / COMPOSE_PROMPTS.length;
  const COMPOSE_EXAMPLES = COMPOSE_PROMPTS.map((prompt, index) => ({
    start: Number(
      (COMPOSE_READY + index * COMPOSE_SLOT_DURATION).toFixed(5)
    ),
    end: index === COMPOSE_PROMPTS.length - 1
      ? COMPOSE_END
      : Number(
          (
            COMPOSE_READY + (index + 1) * COMPOSE_SLOT_DURATION
          ).toFixed(5)
        ),
    prompt
  }));
  const FILM_TIMELINE = Object.freeze({
    duration: FILM_DURATION,
    coverHoldEnd: COVER_HOLD_END,
    coverFadeEnd: COVER_FADE_END,
    colorEntryStart: COLOR_ENTRY_START,
    ringSourceStart: RING_SOURCE_START,
    sourceReady: SOURCE_READY,
    sourceFamilyStart: SOURCE_FAMILY_START,
    familyReady: FAMILY_READY,
    familyArchiveStart: FAMILY_ARCHIVE_START,
    archiveReady: ARCHIVE_READY,
    archiveComposeStart: ARCHIVE_COMPOSE_START,
    familyComposeStart: FAMILY_ARCHIVE_START,
    composeReady: COMPOSE_READY,
    composeEnd: COMPOSE_END,
    outroLogoStart: OUTRO_LOGO_START,
    outroRingReady: OUTRO_RING_READY,
    colorFocusSlot: COLOR_FOCUS_SLOT,
    sourceFocus: SOURCE_FOCUS.map((entry) => ({ ...entry })),
    familyFocus: [],
    provenanceFocus: [],
    composeSlotDuration: COMPOSE_SLOT_DURATION,
    composeTiming: Object.freeze({
      launchStart: COMPOSE_LAUNCH_START,
      launchStagger: COMPOSE_LAUNCH_STAGGER,
      outboundDuration: COMPOSE_OUTBOUND_DURATION,
      lastLandAt: COMPOSE_LAST_LAND_AT,
      landedHold: COMPOSE_LANDED_HOLD,
      firstReturnAt: COMPOSE_FIRST_RETURN_AT,
      returnStagger: COMPOSE_RETURN_STAGGER,
      returnDuration: COMPOSE_RETURN_DURATION,
      inputExitAt: COMPOSE_INPUT_EXIT_AT,
      sendOutAt: COMPOSE_SEND_OUT_AT
    }),
    composeExamples: COMPOSE_EXAMPLES.map((entry) => ({ ...entry }))
  });

  const orderedColors = SOURCE_ORDER.flatMap((category) =>
    colors.filter((color) => color.cat === category)
  );
  const orderedIndex = new Map(orderedColors.map((color, index) => [color.id, index]));
  const colorsBySource = new Map(
    SOURCE_ORDER.map((source) => [
      source,
      orderedColors.filter((color) => color.cat === source)
    ])
  );
  const sourceLocalIndex = new Map();
  colorsBySource.forEach((members) => {
    members.forEach((color, index) => sourceLocalIndex.set(color.id, index));
  });
  const QUADRANT_MID = new Map([
    ["mineral", -Math.PI * .75],
    ["plant", -Math.PI * .25],
    ["nature", Math.PI * .25],
    ["literary", Math.PI * .75]
  ]);
  const QUADRANT_SPAN = Math.PI * (78 / 180);
  const primaryFamily = new Map(
    orderedColors.map((color) => [
      color.id,
      colorRelations[color.id]?.family?.[0] || FAMILY_ORDER[0]
    ])
  );
  const primaryFamilyGroups = new Map(
    FAMILY_ORDER.map((familyId) => [
      familyId,
      orderedColors.filter((color) => primaryFamily.get(color.id) === familyId)
    ])
  );

  const stage = document.createElement("section");
  stage.className = "cinematic-stage";
  stage.id = "cinematicStage";
  stage.dataset.scene = "ring";
  stage.setAttribute("aria-label", "华夏百色图自动导览");
  stage.innerHTML = `
    <div class="film-cover" id="filmCover" aria-hidden="true">
      <img
        class="film-cover-preload"
        id="filmCoverImage"
        src="assets/cover/huaxia-color-atlas-art-plate.png"
        alt=""
        loading="eager"
        decoding="sync"
      >
      <div class="film-cover-paper"></div>
      <div class="film-cover-art film-cover-art-halo"></div>
      <div class="film-cover-art film-cover-art-mountains"></div>
      <div class="film-cover-art film-cover-art-stilllife"></div>
      <div class="film-cover-art film-cover-art-reflection"></div>
      <div class="film-cover-copy">
        <div class="film-cover-kicker">CHINESE · COLOR · ATLAS · 2026</div>
        <h1 class="film-cover-title">華夏色譜</h1>
        <p class="film-cover-subtitle"><span>A KNOWLEDGE GRAPH OF</span><span>TRADITIONAL CHINESE COLORS</span></p>
        <i class="film-cover-rule"></i>
        <p class="film-cover-intro">以廿四色为纲，循典籍、矿物、草木、器物之本源，<br>构一方可游可观之色谱。点击任一色，<br>以见其名、其形、其源。</p>
      </div>
    </div>
    <div class="film-wash" aria-hidden="true"></div>
    <audio
      class="film-music"
      id="filmMusic"
      src="assets/audio/huaxia-color-atlas-bgm-120s.mp3"
      preload="auto"
      playsinline
      aria-hidden="true"
    ></audio>
    <canvas class="film-links" id="filmLinks" aria-hidden="true"></canvas>
    <div class="film-atlas-core" id="filmAtlasCore" aria-hidden="true">
      <span class="film-atlas-watermark">色</span>
      <div class="film-atlas-center">
        <strong class="film-atlas-glyph">色</strong>
        <span class="film-atlas-caption">華 · 夏 · 百 · 色</span>
        <div class="film-atlas-lockup">
          <b>華夏色譜</b>
          <small>CHINESE · COLOR · ATLAS</small>
        </div>
      </div>
      ${SOURCE_ORDER.map((category) => `
        <div class="film-atlas-category" data-cat="${category}">
          <strong>${SOURCE_META[category].cn}</strong>
          <span>${SOURCE_META[category].en}</span>
        </div>
      `).join("")}
    </div>
    <div class="film-provenance-dim" id="filmProvenanceDim" aria-hidden="true"></div>
    <div class="film-end-logo" id="filmEndLogo" aria-hidden="true">
      <span>CHINESE · COLOR · ATLAS</span>
      <strong>華夏色譜</strong>
      <em>百 色 · 一 图 观 源</em>
    </div>
    <div class="film-wordmark" aria-hidden="true">
      <div class="film-kicker">CHINESE · COLOR · ATLAS · 2026</div>
      <h2>華夏百色圖</h2>
      <p>A KNOWLEDGE GRAPH OF TRADITIONAL CHINESE COLORS</p>
      <span class="film-count">華夏百色，循矿物、草木、典籍、自然之本源</span>
    </div>
    <section class="film-home-host" id="filmHomeHost" aria-hidden="true">
      <header class="film-home-caption">
        <div>
          <span>CHINESE · COLOR · ATLAS · 2026</span>
          <strong>華夏百色圖</strong>
          <p>以华夏百色为纲，循矿物、草木、典籍、自然之本源，构一方可游可观之色谱。</p>
        </div>
        <em>一 图 观 源</em>
      </header>
      <div class="film-home-legend" aria-hidden="true">
        <span><i style="--legend-color:#9C5333"></i>矿物 · MINERAL</span>
        <span><i style="--legend-color:#4D8A63"></i>草木 · PLANT</span>
        <span><i style="--legend-color:#7C1823"></i>典籍 · LITERARY</span>
        <span><i style="--legend-color:#6E9CB3"></i>自然 · NATURE</span>
      </div>
      <div class="film-home-system">
        <div class="film-home-graph-slot" id="filmHomeGraphSlot"></div>
        <div class="film-home-panel-slot" id="filmHomePanelSlot" aria-hidden="true"></div>
      </div>
    </section>
    <div class="source-vignettes" id="sourceVignettes" aria-hidden="true"></div>
    <div class="family-vignettes" id="familyVignettes" aria-hidden="true"></div>
    <section class="film-provenance-guide" id="filmProvenanceGuide" aria-hidden="true">
      <header>
        <span>COLOR · ARCHIVE</span>
        <strong>一 色 · 见 其 来 处</strong>
        <em id="filmProvenanceName"></em>
      </header>
      <div class="film-provenance-pointers">
        <article data-field="origin">
          <strong>溯源</strong>
          <span>材料、物象与命名来处</span>
          <i></i>
        </article>
        <article data-field="context">
          <strong>典故</strong>
          <span>典籍与故事中的色彩记忆</span>
          <i></i>
        </article>
        <article data-field="era">
          <strong>沿革</strong>
          <span>颜色跨越时代的使用流变</span>
          <i></i>
        </article>
      </div>
    </section>
    <div class="film-chips" id="filmChips" role="list" aria-label="一百种传统色"></div>
    <aside class="film-inspector" id="filmInspector" aria-hidden="true">
      <button class="film-inspector-close" type="button" aria-label="关闭颜色档案">×</button>
      <div class="film-inspector-swatch"></div>
      <div class="film-inspector-head">
        <div><h3></h3><p></p></div><span></span>
      </div>
      <dl>
        <div><dt>溯 源</dt><dd data-field="origin"></dd></div>
        <div><dt>典 故</dt><dd data-field="context"></dd></div>
        <div><dt>沿 革</dt><dd data-field="era"></dd></div>
        <div><dt>典 籍</dt><dd data-field="cites"></dd></div>
      </dl>
    </aside>
    <div class="film-topline" aria-hidden="true">
      <span class="film-microbrand"><strong>華夏色譜</strong><small>CHINESE · COLOR · ATLAS</small></span>
      <span class="film-scene-name" id="filmSceneName">色 入 成 环</span>
    </div>
    <div class="film-controls">
      <button type="button" id="filmPause" title="空格键播放或暂停">暂停 · SPACE</button>
      <button type="button" id="filmRestart">重播</button>
      <button type="button" id="filmFullscreen" title="F 键切换全屏">全屏录制 · F</button>
      <button type="button" id="filmSkip">进入图谱</button>
    </div>
    <div class="film-progress" aria-hidden="true"><span></span></div>
  `;
  document.body.appendChild(stage);

  const summonFlightLayer = document.createElement("div");
  summonFlightLayer.className = "summon-flight-layer";
  summonFlightLayer.id = "summonFlightLayer";
  summonFlightLayer.setAttribute("aria-hidden", "true");
  stage.appendChild(summonFlightLayer);

  const replayTrigger = document.createElement("button");
  replayTrigger.type = "button";
  replayTrigger.id = "filmReplay";
  replayTrigger.className = "film-replay-trigger";
  replayTrigger.innerHTML = `<span class="dot" style="background:#7C1823"></span>重播 · REPLAY`;
  const legendHint = legend.querySelector(".hint");
  legend.insertBefore(replayTrigger, legendHint || null);

  const filmLinks = stage.querySelector("#filmLinks");
  const linkContext = filmLinks.getContext?.("2d") || null;
  const chipsHost = stage.querySelector("#filmChips");
  const sourceHost = stage.querySelector("#sourceVignettes");
  const familyHost = stage.querySelector("#familyVignettes");
  const provenanceGuide = stage.querySelector("#filmProvenanceGuide");
  const provenanceName = stage.querySelector("#filmProvenanceName");
  const provenanceDim = stage.querySelector("#filmProvenanceDim");
  const provenancePointerNodes = new Map(
    Array.from(
      stage.querySelectorAll(".film-provenance-pointers article")
    ).map((node) => [node.dataset.field, node])
  );
  const filmCover = stage.querySelector("#filmCover");
  const filmCoverImage = stage.querySelector("#filmCoverImage");
  const filmAtlasCore = stage.querySelector("#filmAtlasCore");
  const filmEndLogo = stage.querySelector("#filmEndLogo");
  const filmMusic = stage.querySelector("#filmMusic");
  const atlasCenterNode = filmAtlasCore?.querySelector(".film-atlas-center");
  const atlasWatermarkNode = filmAtlasCore?.querySelector(".film-atlas-watermark");
  const atlasCategoryNodes = new Map(
    Array.from(stage.querySelectorAll(".film-atlas-category")).map((node) => [
      node.dataset.cat,
      node
    ])
  );
  const filmHomeHost = stage.querySelector("#filmHomeHost");
  const filmHomeGraphSlot = stage.querySelector("#filmHomeGraphSlot");
  const filmHomePanelSlot = stage.querySelector("#filmHomePanelSlot");
  const inspector = stage.querySelector("#filmInspector");
  const pauseButton = stage.querySelector("#filmPause");
  const restartButton = stage.querySelector("#filmRestart");
  const fullscreenButton = stage.querySelector("#filmFullscreen");
  const skipButton = stage.querySelector("#filmSkip");
  const sceneName = stage.querySelector("#filmSceneName");
  const progressFill = stage.querySelector(".film-progress span");
  const composeOverlayElement = document.getElementById("composeOverlay");
  const composeInputElement = document.getElementById("composeInput");
  const composeResultElement = document.getElementById("composeResult");
  const paletteElement = document.getElementById("palette");
  const paletteCompositionElement = document.getElementById("paletteComposition");
  const charCountElement = document.getElementById("charCount");
  const graphHomeParent = graphWrap.parentNode;
  const graphHomeNextSibling = graphWrap.nextSibling;
  const panelHomeParent = panel.parentNode;
  const panelHomeNextSibling = panel.nextSibling;
  const composeHomeParent = composeOverlayElement?.parentNode || null;
  const composeHomeNextSibling = composeOverlayElement?.nextSibling || null;

  function dockGraphInStage() {
    if (
      filmHomeGraphSlot &&
      graphWrap.parentNode !== filmHomeGraphSlot
    ) {
      filmHomeGraphSlot.appendChild(graphWrap);
    }
    if (
      filmHomePanelSlot &&
      panel.parentNode !== filmHomePanelSlot
    ) {
      filmHomePanelSlot.appendChild(panel);
    }
    if (typeof layout === "function") layout();
  }

  function restoreGraphHome() {
    if (!graphHomeParent) return;
    if (
      graphHomeNextSibling &&
      graphHomeNextSibling.parentNode === graphHomeParent
    ) {
      graphHomeParent.insertBefore(graphWrap, graphHomeNextSibling);
    } else {
      graphHomeParent.appendChild(graphWrap);
    }
    if (panelHomeParent) {
      if (
        panelHomeNextSibling &&
        panelHomeNextSibling.parentNode === panelHomeParent
      ) {
        panelHomeParent.insertBefore(panel, panelHomeNextSibling);
      } else {
        panelHomeParent.appendChild(panel);
      }
    }
    if (typeof layout === "function") layout();
  }

  function dockComposeInStage() {
    if (
      composeOverlayElement &&
      composeOverlayElement.parentNode !== stage
    ) {
      stage.appendChild(composeOverlayElement);
    }
  }

  function restoreComposeHome() {
    if (!composeOverlayElement || !composeHomeParent) return;
    composeOverlayElement.classList.remove("film-outro-hidden");
    if (
      composeHomeNextSibling &&
      composeHomeNextSibling.parentNode === composeHomeParent
    ) {
      composeHomeParent.insertBefore(
        composeOverlayElement,
        composeHomeNextSibling
      );
    } else {
      composeHomeParent.appendChild(composeOverlayElement);
    }
  }

  if (recordMode) document.body.classList.add("record-mode");
  dockGraphInStage();
  dockComposeInStage();

  const sourceCards = new Map();
  SOURCE_ORDER.forEach((category) => {
    const meta = SOURCE_META[category];
    const count = colorsBySource.get(category).length;
    const samples = meta.representatives
      .map((id) => orderedColors.find((color) => color.id === id))
      .filter(Boolean);
    const card = document.createElement("article");
    card.className = "source-vignette";
    card.dataset.cat = category;
    card.innerHTML = `
      <img src="${meta.image}" alt="" loading="eager" decoding="async">
      <div class="source-vignette-copy">
        <strong>${meta.cn}</strong>
        <span>${meta.en}</span>
        <em>${String(count).padStart(2, "0")} 色</em>
      </div>
      <div class="source-vignette-samples">
        ${samples.map((color) => `
          <span style="--sample-color:${color.hex}">
            <i></i>${color.name}<small>${color.hex.toUpperCase()}</small>
          </span>
        `).join("")}
      </div>
    `;
    sourceHost.appendChild(card);
    sourceCards.set(category, card);
  });

  const familyCards = new Map();
  FAMILY_ORDER.forEach((familyId) => {
    const family = families[familyId];
    const fullMembers = primaryFamilyGroups.get(familyId) || [];
    const fullCount = fullMembers.length;
    const representative = FAMILY_FOCUS.find((entry) => entry.id === familyId)
      ?.representative;
    const samples = [
      fullMembers.find((color) => color.id === representative),
      ...fullMembers.filter((color) => color.id !== representative)
    ].filter(Boolean).slice(0, 3);
    const card = document.createElement("div");
    card.className = "family-vignette";
    card.dataset.family = familyId;
    card.style.setProperty("--family-accent", family.accent);
    card.innerHTML = `
      <strong>${family.cn}</strong>
      <span>${family.en} · FAMILY</span>
      <em>${String(fullCount).padStart(2, "0")} 色</em>
      <div class="family-vignette-samples">
        ${samples.map((color) => `
          <i title="${color.name}" style="--sample-color:${color.hex}">
            <b>${color.name}</b>
          </i>
        `).join("")}
      </div>
    `;
    familyHost.appendChild(card);
    familyCards.set(familyId, card);
  });

  const relationText = (color, type, registry) =>
    (colorRelations[color.id]?.[type] || [])
      .map((id) => registry[id]?.cn || id)
      .join(" · ");

  const chipById = new Map();
  orderedColors.forEach((color) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "film-chip";
    chip.dataset.id = color.id;
    chip.dataset.cat = color.cat;
    chip.style.setProperty("--chip-color", color.hex);
    chip.style.setProperty(
      "--catalog-delay",
      `${
        SOURCE_ORDER.indexOf(color.cat) * .075 +
        (sourceLocalIndex.get(color.id) || 0) * .004
      }s`
    );
    chip.setAttribute("role", "listitem");
    chip.setAttribute(
      "aria-label",
      `${color.name}，${color.hex.toUpperCase()}，点击查看完整颜色档案`
    );
    chip.innerHTML = `
      <span class="film-chip-visual">
        <span class="film-chip-fill"></span>
        <span class="film-chip-name">${color.name}<small>${color.hex.toUpperCase()}</small></span>
        <span class="film-chip-detail">
          <b>${color.pinyin.toUpperCase()}</b>
          <span class="film-chip-meta"><i>来源</i>${categories[color.cat].cn} · <i>年代</i>${color.era}</span>
          <em class="film-chip-origin"><i>溯源</i>${color.origin}</em>
          <em class="film-chip-context"><i>典故</i>${color.context}</em>
          <em class="film-chip-era"><i>沿革</i>${color.era}</em>
          <span class="film-chip-cites"><i>典籍</i>${color.cites.join(" · ")}</span>
          <span class="film-chip-relations">
            <span><i>色系</i>${relationText(color, "family", families)}</span>
            <span><i>时期</i>${relationText(color, "period", periods)}</span>
            <span><i>地域</i>${relationText(color, "region", regions)}</span>
            <span><i>工艺</i>${relationText(color, "craft", crafts)}</span>
          </span>
        </span>
      </span>
    `;
    chipsHost.appendChild(chip);
    chipById.set(color.id, chip);
  });

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const smooth = (value) => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };
  const easeOutQuint = (value) => 1 - Math.pow(1 - clamp01(value), 5);
  const damp = (value, target, tau, delta) =>
    target + (value - target) * Math.exp(-delta / tau);
  const radiansToDegrees = (value) => value * 180 / Math.PI;
  const mixAngle = (from, to, amount) => {
    let difference = (to - from) % 360;
    if (difference > 180) difference -= 360;
    if (difference < -180) difference += 360;
    return from + difference * amount;
  };
  const categoryIndex = new Map(SOURCE_ORDER.map((category, index) => [category, index]));

  function sequenceFocusWeight(time, start, end, count, index, fade = .72) {
    if (time < start || time > end || index < 0 || index >= count) return 0;
    const segment = (end - start) / count;
    const left = start + index * segment;
    const right = left + segment;
    const entryStart = index === 0 ? left : left - fade / 2;
    const entryEnd = index === 0 ? left + fade : left + fade / 2;
    const exitStart = index === count - 1 ? right - fade : right - fade / 2;
    const exitEnd = index === count - 1 ? right : right + fade / 2;
    const entry = smooth((time - entryStart) / Math.max(.001, entryEnd - entryStart));
    const exit = smooth((exitEnd - time) / Math.max(.001, exitEnd - exitStart));
    return Math.min(entry, exit);
  }

  function sourceFocusWeight(category, time) {
    return sequenceFocusWeight(
      time,
      SOURCE_READY,
      SOURCE_FAMILY_START,
      SOURCE_ORDER.length,
      SOURCE_ORDER.indexOf(category)
    );
  }

  function familyFocusWeight(familyId, time) {
    if (!FAMILY_FOCUS_ENABLED) return 0;
    return Math.max(
      0,
      ...FAMILY_FOCUS.map((focus, index) =>
        focus.id === familyId
          ? sequenceFocusWeight(
              time,
              FAMILY_READY,
              FAMILY_ARCHIVE_START,
              FAMILY_FOCUS.length,
              index
            )
          : 0
      )
    );
  }

  function sourceFocusActivity(time) {
    return clamp01(
      SOURCE_ORDER.reduce(
        (total, category) => total + sourceFocusWeight(category, time),
        0
      )
    );
  }

  function familyFocusActivity(time) {
    if (!FAMILY_FOCUS_ENABLED) return 0;
    return clamp01(
      FAMILY_FOCUS.reduce(
        (total, focus) => total + familyFocusWeight(focus.id, time),
        0
      )
    );
  }

  function provenanceFocusWeight(index, time) {
    return sequenceFocusWeight(
      time,
      ARCHIVE_READY,
      ARCHIVE_COMPOSE_START,
      PROVENANCE_FOCUS.length,
      index,
      .82
    );
  }

  function pulseWindow(
    value,
    enterStart,
    enterEnd,
    exitStart,
    exitEnd
  ) {
    return Math.min(
      smooth((value - enterStart) / Math.max(.001, enterEnd - enterStart)),
      1 - smooth((value - exitStart) / Math.max(.001, exitEnd - exitStart))
    );
  }

  function provenanceBeat(time) {
    const duration =
      (ARCHIVE_COMPOSE_START - ARCHIVE_READY) /
      PROVENANCE_FOCUS.length;
    const rawIndex = Math.floor((time - ARCHIVE_READY) / duration);
    const index = Math.max(
      0,
      Math.min(PROVENANCE_FOCUS.length - 1, rawIndex)
    );
    const local = time - ARCHIVE_READY - index * duration;
    const fieldWindows = {
      origin: { start: .55, end: 2.15 },
      context: { start: 2.15, end: 3.75 },
      era: { start: 3.75, end: 5.35 }
    };
    const fields = {};
    let activeField = "";
    let activeEmphasis = 0;
    Object.entries(fieldWindows).forEach(([field, window]) => {
      const label = pulseWindow(
        local,
        window.start,
        window.start + .28,
        window.end - .24,
        window.end
      );
      const line = pulseWindow(
        local,
        window.start + .16,
        window.start + .54,
        window.end - .2,
        window.end
      );
      const emphasis = pulseWindow(
        local,
        window.start + .38,
        window.start + .7,
        window.end - .42,
        window.end - .12
      );
      fields[field] = { label, line, emphasis };
      if (emphasis > activeEmphasis) {
        activeField = field;
        activeEmphasis = emphasis;
      }
    });
    return {
      index,
      duration,
      local,
      fields,
      activeField,
      activeEmphasis,
      guideOpacity: pulseWindow(
        local,
        .22,
        .5,
        duration - .42,
        duration - .12
      )
    };
  }

  let geometry = null;
  let sArcPositions = [];
  let sourceCenters = {};
  let sourcePanelCenters = {};
  let familyCenters = {};
  let familyLabelCenters = {};
  let currentPoses = [];
  let linkDpr = 1;
  let recordRenderScale = 1;
  let hoverPauseTimer = 0;
  let hoverResumeTimer = 0;
  let inspectorResumeTimer = 0;
  let finishHideTimer = 0;
  let finishSelectTimer = 0;
  let inspectorWasRunning = true;
  let currentScene = "";
  let currentFocusKey = "";
  let currentAutoFocusId = null;
  let pickedIds = new Set();
  let composeIndex = -1;
  let composeResultIndex = -1;
  let composeOutIndex = -1;
  let composeOpened = false;
  let composeClosing = false;
  let manualCompose = false;
  let composeFlights = [];
  let graphFocusId = "";

  const playback = {
    time: initialTime,
    speed: 0,
    targetSpeed: 0,
    last: performance.now(),
    started: false,
    finished: false,
    pauseReason: "",
    frame: 0,
    hiddenWasPlaying: false,
    userControlled: false
  };
  let musicClockActive = false;
  let musicPlayToken = 0;

  if (filmMusic) {
    filmMusic.muted = !musicEnabled;
    filmMusic.volume = 0;
    filmMusic.playbackRate = 1;
    filmMusic.preservesPitch = true;
    filmMusic.webkitPreservesPitch = true;
  }

  function seekMusic(time = playback.time, force = true) {
    if (!filmMusic || !musicEnabled) return;
    const target = Math.max(0, Math.min(FILM_DURATION, Number(time) || 0));
    if (!force && Math.abs(filmMusic.currentTime - target) < .16) return;
    try {
      filmMusic.currentTime = target;
    } catch {
      // Metadata can still be loading; the next play/seek pass will retry.
    }
  }

  function updateMusicEnvelope(time = playback.time) {
    if (!filmMusic || !musicEnabled) return;
    const fadeIn = smooth(time / FILM_MUSIC_FADE_IN);
    const fadeOut =
      1 - smooth(
        (time - (FILM_DURATION - FILM_MUSIC_FADE_OUT)) /
        FILM_MUSIC_FADE_OUT
      );
    filmMusic.volume = Math.max(
      0,
      Math.min(1, FILM_MUSIC_GAIN * fadeIn * fadeOut)
    );
  }

  function pauseMusic(sync = true) {
    musicPlayToken += 1;
    musicClockActive = false;
    if (!filmMusic) return;
    try {
      filmMusic.pause();
    } catch {
      // A media backend may be unavailable; visuals remain fully functional.
    }
    if (sync) seekMusic(playback.time);
  }

  function startMusic() {
    if (!filmMusic || !musicEnabled || playback.finished) return;
    const token = ++musicPlayToken;
    seekMusic(playback.time);
    updateMusicEnvelope(playback.time);
    let playRequest;
    try {
      playRequest = filmMusic.play();
    } catch {
      musicClockActive = false;
      return;
    }
    Promise.resolve(playRequest).then(() => {
      if (token !== musicPlayToken || playback.targetSpeed === 0) return;
      seekMusic(playback.time);
      musicClockActive = true;
    }).catch(() => {
      // Browsers block unprompted audio. Pressing Space is a user gesture and
      // starts the same timeline with sound for recording.
      if (token === musicPlayToken) musicClockActive = false;
    });
  }

  function computeSArc(width, height) {
    const samples = 520;
    const points = [];
    let total = 0;
    let previous = null;
    for (let index = 0; index <= samples; index += 1) {
      const u = -1 + index / samples * 2;
      const point = {
        x: width * .5 + width * .54 * u,
        y: height * .52 - height * .25 * Math.sin(Math.PI * u)
      };
      if (previous) total += Math.hypot(point.x - previous.x, point.y - previous.y);
      points.push({ ...point, u, length: total });
      previous = point;
    }

    return orderedColors.map((_, rank) => {
      const target = rank / Math.max(1, orderedColors.length - 1) * total;
      let low = 0;
      let high = points.length - 1;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (points[middle].length < target) low = middle + 1;
        else high = middle;
      }
      const upper = points[low];
      const lower = points[Math.max(0, low - 1)];
      const span = upper.length - lower.length || 1;
      const amount = (target - lower.length) / span;
      const u = lerp(lower.u, upper.u, amount);
      const x = lerp(lower.x, upper.x, amount);
      const y = lerp(lower.y, upper.y, amount);
      const slope = Math.atan2(
        -height * .25 * Math.PI * Math.cos(Math.PI * u),
        width * .54
      );
      return { x, y, rotate: radiansToDegrees(slope) };
    });
  }

  function syncRecordingViewport() {
    if (!isRecordingMode()) {
      recordRenderScale = 1;
      stage.classList.remove("is-record-canvas");
      stage.style.removeProperty("--film-record-scale");
      stage.style.removeProperty("--film-record-offset-x");
      stage.style.removeProperty("--film-record-offset-y");
      return;
    }

    const viewportWidth = Math.max(
      1,
      document.documentElement.clientWidth || window.innerWidth || 1
    );
    const viewportHeight = Math.max(
      1,
      document.documentElement.clientHeight || window.innerHeight || 1
    );
    recordRenderScale = Math.min(
      viewportWidth / RECORD_LOGICAL_WIDTH,
      viewportHeight / RECORD_LOGICAL_HEIGHT
    );
    const renderedWidth = RECORD_LOGICAL_WIDTH * recordRenderScale;
    const renderedHeight = RECORD_LOGICAL_HEIGHT * recordRenderScale;
    stage.classList.add("is-record-canvas");
    stage.style.setProperty(
      "--film-record-scale",
      recordRenderScale.toFixed(6)
    );
    stage.style.setProperty(
      "--film-record-offset-x",
      `${(viewportWidth - renderedWidth) / 2}px`
    );
    stage.style.setProperty(
      "--film-record-offset-y",
      `${(viewportHeight - renderedHeight) / 2}px`
    );
  }

  function resizeStage() {
    syncRecordingViewport();
    const width = Math.max(
      640,
      stage.clientWidth || (isRecordingMode() ? RECORD_LOGICAL_WIDTH : window.innerWidth * .78)
    );
    const height = Math.max(
      520,
      stage.clientHeight || (isRecordingMode() ? RECORD_LOGICAL_HEIGHT : window.innerHeight - 210)
    );
    const shortSide = Math.min(width, height);
    const nodeRadius = Math.min(18, Math.max(11, shortSide * .016));
    const ringOuterRadius = Math.min(width * .39, height * .455);
    const ringRailGap = Math.max(nodeRadius * 2 + 6, height * .042);
    const composePadding = Math.max(22, height * .03);
    const composeFrameWidth = width >= 1100
      ? Math.min(1010, width * .44)
      : width * .50;
    const composeFrameLeft =
      width - composePadding - width * .01 - composeFrameWidth;
    const composeLeftMin = width >= 1100 ? width * .045 : 24;
    const composeLeftMax =
      composeFrameLeft - (width >= 1100 ? 44 : 28);
    const composeRadiusLimit = Math.max(
      92,
      Math.min(
        width * (width >= 1100 ? .235 : .205),
        height * .43,
        (composeLeftMax - composeLeftMin) / 2 - 2
      )
    );
    const largestSourceRail = Math.ceil(
      Math.max(
        ...Array.from(colorsBySource.values(), (members) => members.length)
      ) / 2
    );
    const composeAngularStep =
      QUADRANT_SPAN / Math.max(2, largestSourceRail + 1);
    const composeHalfChord = Math.sin(composeAngularStep / 2);
    const composeSafeNodeRadius = Math.max(
      6.8,
      (
        composeHalfChord * (composeRadiusLimit - 7) - 1
      ) / (1 + composeHalfChord * 2)
    );
    const composeNodeRadius = Math.min(
      width < 1100 ? 9.5 : 17.5,
      Math.max(width < 1100 ? 6.8 : 12.8, shortSide * .016),
      composeSafeNodeRadius
    );
    const composeOuterRadius = Math.max(
      92,
      Math.min(
        composeRadiusLimit,
        (composeLeftMax - composeLeftMin) / 2 - composeNodeRadius - 2
      )
    );
    const composeRailGap = Math.max(
      composeNodeRadius * 2 + 7,
      height * .035
    );

    const compactSourceOverlay = width < 1100;
    const sourceSideMargin = Math.max(compactSourceOverlay ? 16 : 28, width * .018);
    const sourcePanelWidth = compactSourceOverlay
      ? width * .44
      : (
          width >= 1320
            ? Math.min(340, Math.max(240, width * .16))
            : Math.min(220, Math.max(150, width * .17))
        );
    const sourcePanelHeight = compactSourceOverlay
      ? Math.min(230, Math.max(170, height * .32))
      : Math.min(230, Math.max(138, height * .245));
    const sourceAirGap = Math.max(18, width * .012);
    const sourceColumnGap = compactSourceOverlay
      ? 7
      : (width >= 1700 ? 10 : (width >= 1200 ? 8 : 5));
    const sourceAvailableWidth = Math.max(
      210,
      width / 2 -
        sourceSideMargin * 2 -
        sourcePanelWidth -
        sourceAirGap
    );
    const sourceCardWidth = Math.max(
      38,
      Math.min(
        compactSourceOverlay
          ? 78
          : (width >= 1700 ? 112 : (width >= 1320 ? 88 : 60)),
        compactSourceOverlay
          ? (width / 2 - 48 - sourceColumnGap * 4) / 5
          : (sourceAvailableWidth - sourceColumnGap * 4) / 5
      )
    );
    const sourceCardHeight = compactSourceOverlay
      ? Math.min(32, Math.max(28, height * .0435))
      : (width >= 1700 ? 40 : (width >= 1200 ? 34 : 28));
    const sourceRowGap = compactSourceOverlay
      ? 7
      : (width >= 1700 ? 10 : (width >= 1200 ? 8 : 6));
    const sourceGridWidth =
      sourceCardWidth * 5 + sourceColumnGap * 4;
    const sourcePanelLeftX = sourceSideMargin + sourcePanelWidth / 2;
    const sourceGridLeftX =
      sourceSideMargin +
      sourcePanelWidth +
      sourceAirGap +
      sourceGridWidth / 2;

    const familyLayoutColumns = 4;
    const familyLayoutRows = Math.ceil(FAMILY_ORDER.length / familyLayoutColumns);
    const familyGridColumns = width >= 1700 ? 4 : (width >= 1200 ? 3 : 2);
    const familyCellWidth = width / familyLayoutColumns;
    const familyCellHeight = height / familyLayoutRows;
    const familyInset = width >= 1700 ? 22 : 17;
    const familyColumnGap = width >= 1700 ? 11 : (width >= 1200 ? 8 : 7);
    const familyCardWidth = Math.max(
      48,
      Math.min(
        width >= 1700 ? 126 : (width >= 1200 ? 118 : 108),
        (
          familyCellWidth -
          familyInset * 2 -
          familyColumnGap * (familyGridColumns - 1)
        ) / familyGridColumns
      )
    );
    const familyCardHeight = width >= 1700 ? 44 : (width >= 1200 ? 40 : 34);
    const familyRowGap = width >= 1700 ? 12 : (width >= 1200 ? 9 : 7);
    const familyLabelWidth = width >= 1700 ? 250 : (width >= 1200 ? 230 : 210);
    const familyLabelHeight = width >= 1700 ? 112 : (width >= 1200 ? 92 : 70);
    const familyLabelGap = width >= 1700 ? 14 : (width >= 1200 ? 12 : 10);

    geometry = {
      width,
      height,
      cx: width * (width < 1100 ? .56 : .535),
      cy: height * .52,
      nodeRadius,
      nodeSize: nodeRadius * 2,
      ringRadius: ringOuterRadius,
      ringOuterRadius,
      ringInnerRadius: ringOuterRadius - ringRailGap,
      ringCategoryRadius: (ringOuterRadius - ringRailGap) * .5,
      ringSealRadius: Math.min(66, Math.max(46, ringOuterRadius * .19)),
      composeCx: (composeLeftMin + composeLeftMax) / 2,
      composeCy: height * .5,
      composeRadius: composeOuterRadius,
      composeOuterRadius,
      composeInnerRadius: composeOuterRadius - composeRailGap,
      composeCategoryRadius: Math.max(
        Math.min(102, Math.max(78, composeOuterRadius * .29)) + 54,
        (composeOuterRadius - composeRailGap) * .54
      ),
      composeSealRadius: Math.min(102, Math.max(78, composeOuterRadius * .29)),
      composeNodeScale: composeNodeRadius / nodeRadius,
      composeFrameLeft,
      sourceCardWidth,
      sourceCardHeight,
      sourceColumnGap,
      sourceRowGap,
      sourcePanelWidth,
      sourcePanelHeight,
      familyCardWidth,
      familyCardHeight,
      familyColumnGap,
      familyRowGap,
      familyGridColumns,
      familyLayoutColumns,
      familyLayoutRows,
      familyLabelWidth,
      familyLabelHeight,
      familyLabelGap
    };
    stage.style.setProperty("--film-node-size", `${geometry.nodeSize}px`);
    stage.style.setProperty("--source-card-width", `${sourceCardWidth}px`);
    stage.style.setProperty("--source-card-height", `${sourceCardHeight}px`);
    stage.style.setProperty("--source-panel-width", `${sourcePanelWidth}px`);
    stage.style.setProperty("--source-panel-height", `${sourcePanelHeight}px`);
    stage.style.setProperty("--family-card-width", `${familyCardWidth}px`);
    stage.style.setProperty("--family-card-height", `${familyCardHeight}px`);
    stage.style.setProperty("--family-label-width", `${familyLabelWidth}px`);
    stage.style.setProperty("--family-label-height", `${familyLabelHeight}px`);
    stage.classList.toggle("has-compact-source-layout", compactSourceOverlay);
    sArcPositions = computeSArc(width, height);
    const compactLeftX = width * .25;
    const panelLeftX = compactSourceOverlay ? compactLeftX : sourcePanelLeftX;
    const gridLeftX = compactSourceOverlay ? compactLeftX : sourceGridLeftX;
    sourcePanelCenters = {
      mineral: { x: panelLeftX, y: height * .29 },
      plant: { x: width - panelLeftX, y: height * .29 },
      literary: { x: panelLeftX, y: height * .71 },
      nature: { x: width - panelLeftX, y: height * .71 }
    };
    sourceCenters = {
      mineral: { x: gridLeftX, y: height * .29 },
      plant: { x: width - gridLeftX, y: height * .29 },
      literary: { x: gridLeftX, y: height * .71 },
      nature: { x: width - gridLeftX, y: height * .71 }
    };
    familyCenters = {};
    familyLabelCenters = {};
    FAMILY_ORDER.forEach((familyId, index) => {
      const row = Math.floor(index / familyLayoutColumns);
      const column = index % familyLayoutColumns;
      const x = (column + .5) * familyCellWidth;
      const cellTop = row * familyCellHeight;
      const familyRows = Math.max(
        1,
        Math.ceil(
          (primaryFamilyGroups.get(familyId)?.length || 1) /
          familyGridColumns
        )
      );
      const familyGridHeight =
        familyRows * familyCardHeight +
        Math.max(0, familyRows - 1) * familyRowGap;
      const totalHeight =
        familyLabelHeight + familyLabelGap + familyGridHeight;
      const contentTop =
        cellTop + Math.max(8, (familyCellHeight - totalHeight) / 2);
      familyCenters[familyId] = {
        x,
        y:
          contentTop +
          familyLabelHeight +
          familyLabelGap +
          familyGridHeight / 2
      };
      familyLabelCenters[familyId] = {
        x,
        y: contentTop + familyLabelHeight / 2
      };
      const card = familyCards.get(familyId);
      card.style.left = `${familyLabelCenters[familyId].x}px`;
      card.style.top = `${familyLabelCenters[familyId].y}px`;
    });
    SOURCE_ORDER.forEach((category) => {
      const card = sourceCards.get(category);
      card.style.left = `${sourcePanelCenters[category].x}px`;
      card.style.top = `${sourcePanelCenters[category].y}px`;
    });

    if (linkContext) {
      const browserDpr = Math.max(1, window.devicePixelRatio || 1);
      linkDpr = isRecordingMode()
        ? Math.min(2, Math.max(browserDpr, recordRenderScale))
        : Math.min(2, browserDpr);
      filmLinks.width = Math.round(width * linkDpr);
      filmLinks.height = Math.round(height * linkDpr);
      filmLinks.style.width = `${width}px`;
      filmLinks.style.height = `${height}px`;
      linkContext.setTransform(linkDpr, 0, 0, linkDpr, 0, 0);
    }
    if (
      graphWrap.parentNode === filmHomeGraphSlot &&
      typeof layout === "function"
    ) {
      layout();
    }
  }

  function easedRotationPhase(time, start, velocity, rampDuration = .5) {
    const elapsed = Math.max(0, time - start);
    if (elapsed >= rampDuration) {
      return velocity * (elapsed - rampDuration * .5);
    }
    const progress = elapsed / rampDuration;
    return (
      velocity *
      rampDuration *
      (progress * progress * progress - .5 * progress ** 4)
    );
  }

  function atlasPhase(time, compose = false) {
    if (compose) {
      if (time < COMPOSE_READY) return 0;
      return Math.sin((time - COMPOSE_READY) * .36) * .026;
    }
    if (time < RING_SPIN_START) {
      return (
        Math.PI *
        2 *
        smooth(
          (time - COLOR_ENTRY_END) /
          Math.max(.001, RING_SPIN_START - COLOR_ENTRY_END)
        )
      );
    }
    return (
      Math.PI * 2 +
      easedRotationPhase(time, RING_SPIN_START, .045, .8)
    );
  }

  function atlasFrame(compose = false) {
    return compose
      ? {
          cx: geometry.composeCx,
          cy: geometry.composeCy,
          innerRadius: geometry.composeInnerRadius,
          outerRadius: geometry.composeOuterRadius,
          categoryRadius: geometry.composeCategoryRadius,
          sealRadius: geometry.composeSealRadius,
          nodeScale: geometry.composeNodeScale
        }
      : {
          cx: geometry.cx,
          cy: geometry.cy,
          innerRadius: geometry.ringInnerRadius,
          outerRadius: geometry.ringOuterRadius,
          categoryRadius: geometry.ringCategoryRadius,
          sealRadius: geometry.ringSealRadius,
          nodeScale: 1
        };
  }

  function outroProgress(time) {
    return smooth(
      (time - COMPOSE_END) /
      Math.max(.001, OUTRO_RING_READY - COMPOSE_END)
    );
  }

  function outroPhase(time) {
    return (
      atlasPhase(COMPOSE_END, true) +
      easedRotationPhase(time, COMPOSE_END, .022, .7)
    );
  }

  function outroFrame(time) {
    const from = atlasFrame(true);
    const to = {
      ...atlasFrame(false),
      cx: geometry.width * .5,
      cy: geometry.height * .5
    };
    const progress = outroProgress(time);
    return {
      cx: lerp(from.cx, to.cx, progress),
      cy: lerp(from.cy, to.cy, progress),
      innerRadius: lerp(from.innerRadius, to.innerRadius, progress),
      outerRadius: lerp(from.outerRadius, to.outerRadius, progress),
      categoryRadius: lerp(
        from.categoryRadius,
        to.categoryRadius,
        progress
      ),
      sealRadius: lerp(from.sealRadius, to.sealRadius, progress),
      nodeScale: lerp(from.nodeScale, to.nodeScale, progress)
    };
  }

  function ringPose(
    rank,
    time,
    compose = false,
    phaseOverride = null,
    frameOverride = null
  ) {
    const color = orderedColors[rank];
    const members = colorsBySource.get(color.cat) || [];
    const localIndex = sourceLocalIndex.get(color.id) || 0;
    const rail = localIndex % 2;
    const railIndex = Math.floor(localIndex / 2);
    const slotCount = Math.ceil(members.length / 2);
    const step = QUADRANT_SPAN / (slotCount + 1);
    const frame = frameOverride || atlasFrame(compose);
    const phase = Number.isFinite(phaseOverride)
      ? phaseOverride
      : atlasPhase(time, compose);
    let angle =
      (QUADRANT_MID.get(color.cat) || 0) -
      QUADRANT_SPAN / 2 +
      step * (railIndex + 1 + rail * .5) +
      phase;
    let radius = rail ? frame.outerRadius : frame.innerRadius;
    let nodeScale = frame.nodeScale;
    if (compose) {
      const waveTime = Math.max(0, time - COMPOSE_READY);
      const waveRamp = smooth(waveTime / .8);
      const categoryWave = categoryIndex.get(color.cat) || 0;
      const wavePhase =
        waveTime * .78 +
        railIndex * .48 +
        rail * 1.37 +
        categoryWave * .86;
      const waveAmplitude = geometry.width < 1100 ? 2.2 : 6;
      radius += Math.sin(wavePhase) * waveAmplitude * waveRamp;
      angle +=
        Math.sin(wavePhase * .57) *
        (geometry.width < 1100 ? .002 : .004) *
        waveRamp;
      nodeScale *= 1 + Math.sin(wavePhase + .8) * .015 * waveRamp;
    }
    return {
      x: frame.cx + Math.cos(angle) * radius,
      y: frame.cy + Math.sin(angle) * radius,
      rotate: 0,
      scale: nodeScale,
      opacity: 1,
      angle
    };
  }

  function sourcePose(color, time) {
    const members = colorsBySource.get(color.cat);
    const index = members.findIndex((member) => member.id === color.id);
    const columns = 5;
    const row = Math.floor(index / columns);
    const rows = Math.ceil(members.length / columns);
    const rowStart = row * columns;
    const rowCount = Math.min(columns, members.length - rowStart);
    const column = index - rowStart;
    const gapX = geometry.sourceCardWidth + geometry.sourceColumnGap;
    const gapY = geometry.sourceCardHeight + geometry.sourceRowGap;
    const center = sourceCenters[color.cat];
    const focusWeight = sourceFocusWeight(color.cat, time);
    return {
      x: center.x + (column - (rowCount - 1) / 2) * gapX,
      y: center.y + (row - (rows - 1) / 2) * gapY,
      rotate: 0,
      scale: 1 + focusWeight * .025,
      opacity: 1,
      angle: 0
    };
  }

  function familyPose(color, time) {
    const familyId = primaryFamily.get(color.id);
    const members = primaryFamilyGroups.get(familyId);
    const index = members.findIndex((member) => member.id === color.id);
    const columns = geometry.familyGridColumns;
    const row = Math.floor(index / columns);
    const rows = Math.ceil(members.length / columns);
    const rowStart = row * columns;
    const rowCount = Math.min(columns, members.length - rowStart);
    const column = index - rowStart;
    const gapX = geometry.familyCardWidth + geometry.familyColumnGap;
    const gapY = geometry.familyCardHeight + geometry.familyRowGap;
    const center = familyCenters[familyId];
    const focusWeight = familyFocusWeight(familyId, time);
    return {
      x: center.x + (column - (rowCount - 1) / 2) * gapX,
      y:
        center.y +
        (row - (rows - 1) / 2) * gapY,
      rotate: 0,
      scale: 1 + focusWeight * .02,
      opacity: 1,
      angle: 0
    };
  }

  function curvedPose(from, to, progress, bend) {
    const t = smooth(progress);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const arc = Math.sin(t * Math.PI) * bend;
    return {
      x: lerp(from.x, to.x, t) + (-dy / length) * arc,
      y: lerp(from.y, to.y, t) + (dx / length) * arc,
      rotate: mixAngle(from.rotate, to.rotate, t),
      scale: lerp(from.scale, to.scale, t),
      opacity: lerp(from.opacity ?? 1, to.opacity ?? 1, t)
    };
  }

  function composeFlightTiming(colorId) {
    const flight = composeFlights.find((entry) => entry.id === colorId);
    const index = flight?.index ?? 0;
    return {
      index,
      launch: COMPOSE_LAUNCH_START + index * COMPOSE_LAUNCH_STAGGER,
      returnLaunch:
        COMPOSE_FIRST_RETURN_AT +
        (COMPOSE_CARD_COUNT - 1 - index) * COMPOSE_RETURN_STAGGER,
      returnDuration: COMPOSE_RETURN_DURATION
    };
  }

  function poseForColor(color, time) {
    const rank = orderedIndex.get(color.id);

    if (time < RING_SOURCE_START) {
      const introTime = time - COLOR_ENTRY_START;
      const stagger = rank * .006;
      const approach = easeOutQuint(
        (introTime - stagger) /
          Math.max(.2, COLOR_ENTRY_END - COLOR_ENTRY_START - .28)
      );
      const s = sArcPositions[rank];
      const farX =
        geometry.width * .5 +
        (s.x - geometry.width * .5) * .16;
      const farY =
        geometry.height * .49 +
        (s.y - geometry.height * .49) * .12;
      const waveRise = smooth((introTime - .22 - stagger) / .7);
      const waveFade =
        1 - smooth((time - COLOR_ENTRY_END + .05) / 1.32);
      const wave =
        Math.sin(time * 3.15 - rank * .21) *
        (5 + 8 * approach) *
        waveRise *
        waveFade;
      const sPose = {
        x:
          lerp(farX, s.x, approach) +
          Math.cos(rank * .73) * (1 - approach) * 7,
        y:
          lerp(farY, s.y, approach) +
          wave +
          Math.sin(rank * 1.7) * (1 - approach) * 5,
        rotate:
          lerp(0, s.rotate, approach) +
          Math.cos(time * 3.15 - rank * .21) *
            1.5 *
            waveRise *
            waveFade,
        scale:
          lerp(.14, .72, approach) *
          (
            1 +
            Math.sin(time * 3.15 - rank * .21) *
              .035 *
              waveRise *
              waveFade
          ),
        opacity: smooth((introTime - .03 - stagger) / .54)
      };
      const target = ringPose(rank, time);
      return curvedPose(
        sPose,
        target,
        (time - COLOR_ENTRY_END) / (RING_READY - COLOR_ENTRY_END),
        8
      );
    }

    if (time < SOURCE_READY) {
      const from = ringPose(rank, RING_SOURCE_START);
      const to = sourcePose(color, SOURCE_READY);
      const sourceOrder = categoryIndex.get(color.cat);
      const groupDelay = sourceOrder * .18;
      const duration = SOURCE_READY - RING_SOURCE_START - .54;
      return curvedPose(
        from,
        to,
        (time - RING_SOURCE_START - groupDelay) / duration,
        (rank % 2 ? -1 : 1) * geometry.height * .11
      );
    }

    if (time < SOURCE_FAMILY_START) {
      return sourcePose(color, time);
    }

    if (time < FAMILY_READY) {
      const from = sourcePose(color, SOURCE_FAMILY_START);
      const to = familyPose(color, FAMILY_READY);
      const sourceIndex = categoryIndex.get(color.cat);
      const familyIndex = FAMILY_ORDER.indexOf(primaryFamily.get(color.id));
      const delay = familyIndex * .07;
      const duration =
        FAMILY_READY - SOURCE_FAMILY_START - (FAMILY_ORDER.length - 1) * .07;
      const progress = clamp01(
        (time - SOURCE_FAMILY_START - delay) / duration
      );
      const pose = curvedPose(
        from,
        to,
        progress,
        (familyIndex - (FAMILY_ORDER.length - 1) / 2) * 24 +
          (sourceIndex % 2 ? 18 : -18)
      );
      pose.scale *= 1 - Math.sin(smooth(progress) * Math.PI) * .08;
      return pose;
    }

    if (time < FAMILY_ARCHIVE_START) {
      return familyPose(color, time);
    }

    if (time < ARCHIVE_READY) {
      const from = familyPose(color, FAMILY_ARCHIVE_START);
      const to = ringPose(rank, ARCHIVE_READY, true);
      return curvedPose(
        from,
        to,
        (time - FAMILY_ARCHIVE_START) /
          Math.max(.001, ARCHIVE_READY - FAMILY_ARCHIVE_START),
        (rank % 2 ? -1 : 1) * geometry.height * .12
      );
    }

    if (time < ARCHIVE_COMPOSE_START) {
      const pose = ringPose(rank, time, true);
      const focusWeights = PROVENANCE_FOCUS.map((_, index) =>
        provenanceFocusWeight(index, time)
      );
      const activity = Math.max(0, ...focusWeights);
      const ownIndex = PROVENANCE_FOCUS.findIndex(
        (focus) => focus.representative === color.id
      );
      const ownWeight = ownIndex >= 0 ? focusWeights[ownIndex] : 0;
      pose.opacity = clamp01(
        lerp(1, .3, activity) + .7 * ownWeight
      );
      return pose;
    }

    if (time < COMPOSE_READY) {
      return ringPose(rank, time, true);
    }

    if (time >= COMPOSE_END) {
      const from = ringPose(rank, COMPOSE_END, true);
      const endFrame = outroFrame(time);
      const to = ringPose(
        rank,
        time,
        false,
        outroPhase(time),
        endFrame
      );
      return curvedPose(
        from,
        to,
        outroProgress(time),
        (rank % 2 ? -1 : 1) * 14
      );
    }

    const pose = ringPose(rank, time, true);
    if (pickedIds.has(color.id)) {
      const example = COMPOSE_EXAMPLES.find(
        (entry) => time >= entry.start && time < entry.end
      );
      if (example) {
        const local = time - example.start;
        const timing = composeFlightTiming(color.id);
        const anticipation = smooth(
          (local - (timing.launch - .18)) / .18
        );
        const returnProgress = smooth(
          (local - timing.returnLaunch) / timing.returnDuration
        );
        const lift = 24 * anticipation * (1 - returnProgress);
        pose.x += Math.cos(pose.angle) * lift;
        pose.y += Math.sin(pose.angle) * lift;
      }
    }
    return pose;
  }

  function pickedBoostAt(time, colorId) {
    const example = COMPOSE_EXAMPLES.find(
      (entry) => time >= entry.start && time < entry.end
    );
    if (!example) return 1;
    const local = time - example.start;
    const timing = composeFlightTiming(colorId);
    const pickedEntry = smooth(
      (local - (timing.launch - .18)) / .18
    );
    const pickedReturn =
      1 - smooth(
        (local - timing.returnLaunch) / timing.returnDuration
      );
    return 1 + .18 * pickedEntry * pickedReturn;
  }

  function applyPoses(time) {
    currentPoses = orderedColors.map((color) => poseForColor(color, time));
    currentPoses.forEach((pose, index) => {
      const color = orderedColors[index];
      const chip = chipById.get(color.id);
      const isFocusedDossier = color.id === currentAutoFocusId;
      let pickedBoost = 1;
      if (pickedIds.has(color.id)) {
        pickedBoost = pickedBoostAt(time, color.id);
      }
      if (isFocusedDossier) {
        const provenanceScene = currentScene === "provenance";
        const dossierWidth = provenanceScene
          ? Math.min(930, geometry.width * .58)
          : Math.min(500, Math.max(360, geometry.width * .27));
        const dossierHeight = provenanceScene
          ? Math.min(590, geometry.height * .66)
          : Math.min(306, Math.max(238, geometry.height * .315));
        const edge = 26;
        const desiredX = provenanceScene
          ? geometry.width * (geometry.width < 1100 ? .57 : .7)
          : pose.x;
        const desiredY = provenanceScene
          ? geometry.height * .51
          : pose.y;
        const targetX = Math.max(
          edge + dossierWidth / 2,
          Math.min(geometry.width - edge - dossierWidth / 2, desiredX)
        );
        const targetY = Math.max(
          edge + dossierHeight / 2,
          Math.min(geometry.height - edge - dossierHeight / 2, desiredY)
        );
        chip.style.setProperty(
          "--focus-shift-x",
          `${((targetX - pose.x) / Math.max(.001, pose.scale)).toFixed(2)}px`
        );
        chip.style.setProperty(
          "--focus-shift-y",
          `${((targetY - pose.y) / Math.max(.001, pose.scale)).toFixed(2)}px`
        );
        chip.style.setProperty(
          "--focus-compensation",
          (1 / Math.max(.001, pose.scale)).toFixed(4)
        );
      } else {
        chip.style.removeProperty("--focus-shift-x");
        chip.style.removeProperty("--focus-shift-y");
        chip.style.removeProperty("--focus-compensation");
      }
      const transform = [
        `translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, 0)`,
        "translate(-50%, -50%)",
        `rotate(${pose.rotate.toFixed(3)}deg)`,
        `scale(${(pose.scale * pickedBoost).toFixed(4)})`
      ].join(" ");
      chip.style.transform = transform;
      chip.style.opacity = clamp01(pose.opacity).toFixed(3);
      chip.style.zIndex = String(
        10 + index + (pickedIds.has(color.id) ? 500 : 0)
      );
      chip.style.setProperty("--chip-counter-rotate", `${(-pose.rotate).toFixed(3)}deg`);
    });
  }

  function updateCover(time) {
    if (!filmCover) return;
    const progress = smooth(
      (time - COVER_HOLD_END) /
        Math.max(.001, COVER_FADE_END - COVER_HOLD_END)
    );
    const visible = time <= COVER_FADE_END + .18;
    filmCover.style.setProperty(
      "--film-cover-opacity",
      (1 - progress).toFixed(4)
    );
    filmCover.style.setProperty(
      "--film-cover-scale",
      (1 + progress * .008).toFixed(5)
    );
    const coverReveals = {
      "--cover-paper-in": smooth(time / .45),
      "--cover-halo-in": smooth((time - .12) / .82),
      "--cover-mountains-in": smooth((time - .28) / .86),
      "--cover-stilllife-in": smooth((time - .48) / .92),
      "--cover-reflection-in": smooth((time - .68) / .92),
      "--cover-kicker-in": smooth((time - .16) / .56),
      "--cover-title-in": smooth((time - .38) / .7),
      "--cover-subtitle-in": smooth((time - .64) / .64),
      "--cover-rule-in": smooth((time - .86) / .5),
      "--cover-intro-in": smooth((time - 1.02) / .76)
    };
    Object.entries(coverReveals).forEach(([name, value]) => {
      filmCover.style.setProperty(name, value.toFixed(4));
    });
    const haloIn = coverReveals["--cover-halo-in"];
    const mountainsIn = coverReveals["--cover-mountains-in"];
    const stilllifeIn = coverReveals["--cover-stilllife-in"];
    const reflectionIn = coverReveals["--cover-reflection-in"];
    const kickerIn = coverReveals["--cover-kicker-in"];
    const titleIn = coverReveals["--cover-title-in"];
    const subtitleIn = coverReveals["--cover-subtitle-in"];
    const introIn = coverReveals["--cover-intro-in"];
    filmCover.style.setProperty(
      "--cover-halo-x",
      `${((1 - haloIn) * 22).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-halo-scale",
      (.986 + haloIn * .014).toFixed(4)
    );
    filmCover.style.setProperty(
      "--cover-mountains-x",
      `${((1 - mountainsIn) * 28 + Math.sin(time * .45) * mountainsIn * .7).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-mountains-scale",
      (1.018 - mountainsIn * .018).toFixed(4)
    );
    filmCover.style.setProperty(
      "--cover-stilllife-y",
      `${((1 - stilllifeIn) * 24 + Math.sin(time * .62) * stilllifeIn * .55).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-stilllife-scale",
      (1.012 - stilllifeIn * .012).toFixed(4)
    );
    filmCover.style.setProperty(
      "--cover-reflection-y",
      `${((1 - reflectionIn) * -18).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-reflection-opacity",
      (reflectionIn * .86).toFixed(4)
    );
    filmCover.style.setProperty(
      "--cover-kicker-x",
      `${((1 - kickerIn) * -18).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-title-clip",
      `${((1 - titleIn) * 100).toFixed(2)}%`
    );
    filmCover.style.setProperty(
      "--cover-title-y",
      `${((1 - titleIn) * 12).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-subtitle-x",
      `${((1 - subtitleIn) * 14).toFixed(2)}px`
    );
    filmCover.style.setProperty(
      "--cover-intro-y",
      `${((1 - introIn) * 14).toFixed(2)}px`
    );
    filmCover.style.visibility = visible ? "visible" : "hidden";
    stage.style.setProperty(
      "--ring-topline-opacity",
      smooth((time - COVER_FADE_END + .08) / .5).toFixed(3)
    );
    stage.classList.toggle("is-cover-visible", visible);
  }

  function updateAtlasCore(time, scene) {
    if (!filmAtlasCore || !geometry) return;
    const compose = scene === "compose";
    const compact = compose || scene === "provenance";
    const frame = scene === "end"
      ? outroFrame(time)
      : atlasFrame(compact);
    const phase = scene === "end"
      ? outroPhase(time)
      : atlasPhase(time, compact);
    const reveal = scene === "ring"
      ? smooth((time - 3.15) / 1.15)
      : (scene === "provenance"
          ? smooth(
              (time - FAMILY_ARCHIVE_START) /
              Math.max(.001, ARCHIVE_READY - FAMILY_ARCHIVE_START)
            )
          : (scene === "compose"
          ? 1
          : (scene === "end" ? 1 : 0)));
    filmAtlasCore.style.setProperty(
      "--atlas-core-opacity",
      reveal.toFixed(3)
    );
    stage.style.setProperty("--atlas-label-opacity", "0");
    filmAtlasCore.style.setProperty(
      "--atlas-breathe",
      (
        compact
          ? 1 +
            Math.sin(Math.max(0, time - COMPOSE_READY) * .62) *
            (compose ? .012 : .005) *
            smooth((time - COMPOSE_READY) / .8)
          : (
              scene === "end"
                ? 1 + Math.sin((time - COMPOSE_END) * .72) * .004
                : 1
            )
      ).toFixed(4)
    );
    filmAtlasCore.style.setProperty(
      "--atlas-seal-size",
      `${(frame.sealRadius * 2).toFixed(2)}px`
    );
    [atlasCenterNode, atlasWatermarkNode].forEach((node) => {
      if (!node) return;
      node.style.left = `${frame.cx.toFixed(2)}px`;
      node.style.top = `${frame.cy.toFixed(2)}px`;
    });
    if (filmEndLogo) {
      const logoReveal = scene === "end"
        ? smooth((time - OUTRO_LOGO_START) / .7)
        : 0;
      filmEndLogo.style.left = `${frame.cx.toFixed(2)}px`;
      filmEndLogo.style.top = `${frame.cy.toFixed(2)}px`;
      filmEndLogo.style.setProperty(
        "--end-logo-opacity",
        logoReveal.toFixed(3)
      );
      filmEndLogo.style.setProperty(
        "--end-logo-scale",
        lerp(.94, 1, logoReveal).toFixed(4)
      );
      filmEndLogo.style.setProperty(
        "--end-logo-y",
        `${lerp(18, 0, logoReveal).toFixed(2)}px`
      );
    }
    atlasCategoryNodes.forEach((node, category) => {
      const angle = (QUADRANT_MID.get(category) || 0) + phase;
      const categoryRadius =
        frame.categoryRadius +
        (
          compact
            ? Math.sin(
                Math.max(0, time - COMPOSE_READY) * .54 +
                (categoryIndex.get(category) || 0) * 1.37
              ) *
              (geometry.width < 1100 ? 1.4 : 3) *
              smooth((time - COMPOSE_READY) / .8)
            : 0
        );
      node.style.left =
        `${(frame.cx + Math.cos(angle) * categoryRadius).toFixed(2)}px`;
      node.style.top =
        `${(frame.cy + Math.sin(angle) * categoryRadius).toFixed(2)}px`;
    });
  }

  function drawAtlasGuide(
    frame,
    time,
    compose,
    alpha,
    phaseOverride = null,
    spokes = true
  ) {
    if (!linkContext) return;
    const phase = Number.isFinite(phaseOverride)
      ? phaseOverride
      : atlasPhase(time, compose);
    linkContext.save();
    linkContext.globalAlpha = alpha;
    SOURCE_ORDER.forEach((category) => {
      const mid = (QUADRANT_MID.get(category) || 0) + phase;
      const start = mid - QUADRANT_SPAN / 2;
      const end = mid + QUADRANT_SPAN / 2;
      const hubX =
        frame.cx + Math.cos(mid) * frame.categoryRadius;
      const hubY =
        frame.cy + Math.sin(mid) * frame.categoryRadius;

      linkContext.strokeStyle = SOURCE_META[category].accent;
      linkContext.lineWidth = .9;
      linkContext.globalAlpha = alpha * .9;
      [frame.innerRadius, frame.outerRadius].forEach((radius) => {
        linkContext.beginPath();
        linkContext.arc(frame.cx, frame.cy, radius, start, end);
        linkContext.stroke();
      });

      if (spokes) {
        linkContext.strokeStyle = "#595348";
        linkContext.lineWidth = .82;
        linkContext.globalAlpha = alpha * .72;
        linkContext.setLineDash([2, 5]);
        linkContext.beginPath();
        linkContext.moveTo(frame.cx, frame.cy);
        linkContext.lineTo(hubX, hubY);
        linkContext.stroke();
        linkContext.setLineDash([]);

        (colorsBySource.get(category) || []).forEach((color) => {
          const pose = currentPoses[orderedIndex.get(color.id)];
          if (!pose) return;
          linkContext.globalAlpha = alpha * .56;
          linkContext.beginPath();
          linkContext.moveTo(hubX, hubY);
          linkContext.quadraticCurveTo(
            (hubX + pose.x) / 2 + Math.cos(pose.angle) * 5,
            (hubY + pose.y) / 2 + Math.sin(pose.angle) * 5,
            pose.x,
            pose.y
          );
          linkContext.stroke();
        });
      }
    });
    linkContext.restore();
  }

  function drawLinks(time) {
    if (!linkContext || !geometry) return;
    linkContext.clearRect(0, 0, geometry.width, geometry.height);
    if (time < RING_SOURCE_START) {
      drawAtlasGuide(
        atlasFrame(false),
        time,
        false,
        .86 * smooth((time - 3.75) / 1.05)
      );
      return;
    }

    if (time < SOURCE_FAMILY_START) {
      const reveal = smooth((time - RING_SOURCE_START) / 2.2);
      orderedColors.forEach((color, index) => {
        const pose = currentPoses[index];
        const center = sourceCenters[color.cat];
        const focusWeight = sourceFocusWeight(color.cat, time);
        const focusActivity = sourceFocusActivity(time);
        linkContext.save();
        linkContext.globalAlpha = reveal * lerp(
          .11,
          .34,
          focusWeight * focusActivity
        );
        linkContext.strokeStyle = SOURCE_META[color.cat].accent;
        linkContext.lineWidth = lerp(.7, 1.2, focusWeight);
        linkContext.beginPath();
        linkContext.moveTo(center.x, center.y);
        const middleX = (center.x + pose.x) / 2 + (index % 2 ? 10 : -10);
        const middleY = (center.y + pose.y) / 2;
        linkContext.quadraticCurveTo(middleX, middleY, pose.x, pose.y);
        linkContext.stroke();
        linkContext.restore();
      });
      return;
    }

    if (time < FAMILY_ARCHIVE_START) {
      const reveal = smooth((time - SOURCE_FAMILY_START) / 2.5);
      orderedColors.forEach((color, index) => {
        const pose = currentPoses[index];
        const relation = colorRelations[color.id]?.family || [];
        const primary = relation[0];
        const center = familyCenters[primary];
        const focusWeight = familyFocusWeight(primary, time);
        const focusActivity = familyFocusActivity(time);
        linkContext.save();
        linkContext.globalAlpha = reveal * lerp(
          .1,
          .32,
          focusWeight * focusActivity
        );
        linkContext.strokeStyle = families[primary]?.accent || "#6E6A5E";
        linkContext.lineWidth = lerp(.7, 1.15, focusWeight);
        linkContext.beginPath();
        linkContext.moveTo(center.x, center.y);
        linkContext.lineTo(pose.x, pose.y);
        linkContext.stroke();
        if (relation[1] && familyCenters[relation[1]]) {
          linkContext.globalAlpha = reveal * .17;
          linkContext.setLineDash([2, 5]);
          linkContext.beginPath();
          linkContext.moveTo(pose.x, pose.y);
          linkContext.lineTo(familyCenters[relation[1]].x, familyCenters[relation[1]].y);
          linkContext.stroke();
        }
        linkContext.restore();
      });
      return;
    }

    if (time < ARCHIVE_READY) {
      drawAtlasGuide(
        atlasFrame(true),
        time,
        true,
        .34 * smooth(
          (time - FAMILY_ARCHIVE_START) /
          Math.max(.001, ARCHIVE_READY - FAMILY_ARCHIVE_START)
        )
      );
      return;
    }
    if (time < COMPOSE_READY) {
      drawAtlasGuide(
        atlasFrame(true),
        time,
        true,
        .44
      );
      return;
    }
    if (time >= COMPOSE_END) {
      drawAtlasGuide(
        outroFrame(time),
        time,
        false,
        .42,
        outroPhase(time),
        false
      );
      return;
    }
    drawAtlasGuide(
      atlasFrame(true),
      time,
      true,
      time < COMPOSE_END
        ? .42
        : .24 * (1 - smooth((time - COMPOSE_END) / 1.25))
    );
  }

  function setAutoFocus(id) {
    stage.classList.toggle("has-local-focus", Boolean(id));
    if (currentAutoFocusId === id) return;
    if (currentAutoFocusId) {
      chipById.get(currentAutoFocusId)?.classList.remove(
        "is-auto-focus",
        "is-info-card"
      );
    }
    currentAutoFocusId = id || null;
    if (currentAutoFocusId) {
      chipById.get(currentAutoFocusId)?.classList.add(
        "is-auto-focus",
        "is-info-card"
      );
    }
  }

  function setPicked(ids) {
    pickedIds.forEach((id) => {
      const chip = chipById.get(id);
      chip?.classList.remove(
        "is-picked",
        "is-flight-arming",
        "is-flight-departed"
      );
      chip?.style.removeProperty("--flight-index");
      chip?.style.removeProperty("--flight-source-opacity");
    });
    pickedIds = new Set(ids || []);
    pickedIds.forEach((id) => chipById.get(id)?.classList.add("is-picked"));
  }

  function clearFocusVisuals() {
    currentFocusKey = "";
    sourceCards.forEach((card) => card.classList.remove("is-focus"));
    familyCards.forEach((card) => card.classList.remove("is-focus"));
    provenanceGuide?.style.setProperty("--provenance-guide-opacity", "0");
    provenanceDim?.style.setProperty("--provenance-dim-opacity", "0");
    provenancePointerNodes.forEach((node) => {
      node.style.setProperty("--pointer-opacity", "0");
      node.style.setProperty("--pointer-shift", "-22px");
      node.style.setProperty("--pointer-scale", ".96");
      node.style.setProperty("--pointer-line-scale", "0");
      node.style.setProperty("--pointer-clip", "100%");
    });
    PROVENANCE_FOCUS.forEach((focus) => {
      const chip = chipById.get(focus.representative);
      chip?.classList.remove("is-provenance-emphasis");
      chip?.removeAttribute("data-provenance-field");
      chip?.style.removeProperty("--provenance-field-scale");
      chip?.style.removeProperty("--provenance-field-weight");
    });
    setAutoFocus(null);
  }

  function updateMorphState(time, scene) {
    SOURCE_ORDER.forEach((category, index) => {
      const revealAt = RING_SOURCE_START + .18 + index * .22;
      const revealed = scene === "source" && time >= revealAt;
      sourceCards.get(category)?.classList.toggle("is-revealed", revealed);
    });

    FAMILY_ORDER.forEach((familyId, index) => {
      const revealAt = SOURCE_FAMILY_START + 1.25 + index * .09;
      const revealed = scene === "family" && time >= revealAt;
      familyCards.get(familyId)?.classList.toggle("is-revealed", revealed);
    });

    const cardScene = scene === "source" || scene === "family";
    orderedColors.forEach((color) => {
      const chip = chipById.get(color.id);
      const focused = color.id === currentAutoFocusId;
      chip?.classList.toggle(
        "is-index-card",
        cardScene && !focused
      );
      chip?.classList.toggle(
        "is-info-card",
        cardScene || focused
      );
    });
  }

  function updateFocus(time, scene) {
    let nextFocus = "";
    let representative = null;

    if (scene === "source" && time >= SOURCE_READY) {
      const duration = COLOR_FOCUS_SLOT;
      const index = Math.min(
        SOURCE_FOCUS.length - 1,
        Math.floor((time - SOURCE_READY) / duration)
      );
      const focus = SOURCE_FOCUS[index];
      const local = time - SOURCE_READY - index * duration;
      const inRest = local < .2 || local > duration - .2;
      nextFocus = `source:${focus.category}:${inRest ? "rest" : focus.representative}`;
      representative = inRest ? null : focus.representative;
    } else if (
      FAMILY_FOCUS_ENABLED &&
      scene === "family" &&
      time >= FAMILY_READY
    ) {
      const duration = COLOR_FOCUS_SLOT;
      const index = Math.min(
        FAMILY_FOCUS.length - 1,
        Math.floor((time - FAMILY_READY) / duration)
      );
      const focus = FAMILY_FOCUS[index];
      const local = time - FAMILY_READY - index * duration;
      const inRest = local < .2 || local > duration - .2;
      nextFocus = `family:${focus.id}:${inRest ? "rest" : focus.representative}`;
      representative = inRest ? null : focus.representative;
    } else if (scene === "provenance" && time >= ARCHIVE_READY) {
      const duration =
        (ARCHIVE_COMPOSE_START - ARCHIVE_READY) /
        PROVENANCE_FOCUS.length;
      const index = Math.min(
        PROVENANCE_FOCUS.length - 1,
        Math.floor((time - ARCHIVE_READY) / duration)
      );
      const focus = PROVENANCE_FOCUS[index];
      const local = time - ARCHIVE_READY - index * duration;
      const inRest = local < .18 || local > duration - .24;
      const color = orderedColors.find(
        (entry) => entry.id === focus.representative
      );
      nextFocus =
        `provenance:${focus.representative}:${inRest ? "rest" : "archive"}`;
      representative = inRest ? null : focus.representative;
      if (provenanceName && color) {
        provenanceName.textContent =
          `${color.name} · ${color.hex.toUpperCase()} · ${focus.note}`;
      }
    }

    if (nextFocus === currentFocusKey) return;
    currentFocusKey = nextFocus;
    sourceCards.forEach((card, category) => {
      card.classList.toggle(
        "is-focus",
        nextFocus.startsWith(`source:${category}:`)
      );
    });
    familyCards.forEach((card, familyId) => {
      card.classList.toggle(
        "is-focus",
        nextFocus.startsWith(`family:${familyId}:`)
      );
    });
    setAutoFocus(representative);
  }

  function updateProvenanceChoreography(time, scene) {
    if (!provenanceGuide) return;
    if (
      scene !== "provenance" ||
      time < ARCHIVE_READY ||
      time >= ARCHIVE_COMPOSE_START
    ) {
      provenanceGuide.style.setProperty(
        "--provenance-guide-opacity",
        "0"
      );
      provenanceDim?.style.setProperty(
        "--provenance-dim-opacity",
        "0"
      );
      provenancePointerNodes.forEach((node) => {
        node.style.setProperty("--pointer-opacity", "0");
        node.style.setProperty("--pointer-shift", "-22px");
        node.style.setProperty("--pointer-scale", ".96");
        node.style.setProperty("--pointer-line-scale", "0");
        node.style.setProperty("--pointer-clip", "100%");
      });
      PROVENANCE_FOCUS.forEach((focus) => {
        const chip = chipById.get(focus.representative);
        chip?.classList.remove("is-provenance-emphasis");
        chip?.removeAttribute("data-provenance-field");
        chip?.style.removeProperty("--provenance-field-scale");
        chip?.style.removeProperty("--provenance-field-weight");
      });
      return;
    }

    const beat = provenanceBeat(time);
    const focus = PROVENANCE_FOCUS[beat.index];
    const color = orderedColors.find(
      (entry) => entry.id === focus?.representative
    );
    provenanceGuide.style.setProperty(
      "--provenance-guide-opacity",
      beat.guideOpacity.toFixed(3)
    );
    const dimEnvelope = Math.min(
      smooth((time - ARCHIVE_READY) / .62),
      1 -
        smooth(
          (time - (ARCHIVE_COMPOSE_START - .7)) / .7
        )
    );
    provenanceDim?.style.setProperty(
      "--provenance-dim-opacity",
      (.62 * dimEnvelope).toFixed(3)
    );

    Object.entries(beat.fields).forEach(([field, values]) => {
      const node = provenancePointerNodes.get(field);
      if (!node) return;
      node.style.setProperty(
        "--pointer-opacity",
        values.label.toFixed(3)
      );
      node.style.setProperty(
        "--pointer-shift",
        `${(-22 * (1 - values.label)).toFixed(2)}px`
      );
      node.style.setProperty(
        "--pointer-scale",
        (.96 + .04 * values.label).toFixed(4)
      );
      node.style.setProperty(
        "--pointer-line-scale",
        values.line.toFixed(4)
      );
      node.style.setProperty(
        "--pointer-clip",
        `${((1 - values.label) * 100).toFixed(2)}%`
      );
    });

    PROVENANCE_FOCUS.forEach((entry) => {
      const chip = chipById.get(entry.representative);
      if (!chip) return;
      const isCurrent = entry.representative === focus?.representative;
      const hasEmphasis =
        isCurrent &&
        Boolean(beat.activeField) &&
        beat.activeEmphasis > .015;
      chip.classList.toggle("is-provenance-emphasis", hasEmphasis);
      if (hasEmphasis) {
        chip.dataset.provenanceField = beat.activeField;
        chip.style.setProperty(
          "--provenance-field-scale",
          (1 + beat.activeEmphasis * .08).toFixed(4)
        );
        chip.style.setProperty(
          "--provenance-field-weight",
          String(Math.round(400 + beat.activeEmphasis * 300))
        );
      } else {
        chip.removeAttribute("data-provenance-field");
        chip.style.removeProperty("--provenance-field-scale");
        chip.style.removeProperty("--provenance-field-weight");
      }
    });

    if (provenanceName && color && focus) {
      provenanceName.textContent =
        `${color.name} · ${color.hex.toUpperCase()} · ${focus.note}`;
    }
  }

  function sceneForTime(time) {
    if (time < RING_SOURCE_START) return "ring";
    if (time < SOURCE_FAMILY_START) return "source";
    if (time < FAMILY_ARCHIVE_START) return "family";
    if (time < ARCHIVE_COMPOSE_START) return "provenance";
    if (time < COMPOSE_END) return "compose";
    return "end";
  }

  const sceneLabels = {
    ring: "色 入 成 环",
    source: "四 源 聚 色",
    family: "溯 系 成 谱",
    provenance: "百 色 归 环",
    graph: "一 图 观 源",
    compose: "以 意 召 色",
    end: "归 入 图 谱"
  };

  function setScene(scene) {
    if (scene === currentScene) return;
    if (scene === "end") suppressComposeForOutro();
    currentScene = scene;
    stage.dataset.scene = scene;
    sceneName.textContent = sceneLabels[scene];
    filmHomeHost?.setAttribute(
      "aria-hidden",
      String(scene !== "graph")
    );
    filmHomePanelSlot?.setAttribute(
      "aria-hidden",
      String(scene !== "graph")
    );
    provenanceGuide?.setAttribute(
      "aria-hidden",
      String(scene !== "provenance")
    );
    document.body.classList.toggle("film-compose", scene === "compose");
    if (scene === "end") {
      clearFocusVisuals();
    }
  }

  function resetComposeVisuals() {
    cleanupComposeFlights();
    composeIndex = -1;
    composeResultIndex = -1;
    composeOutIndex = -1;
    manualCompose = false;
    setPicked([]);
    if (composeInputElement) composeInputElement.value = "";
    if (charCountElement) charCountElement.textContent = "0 字";
    if (composeResultElement) composeResultElement.classList.remove("active");
    if (composeResultElement) composeResultElement.classList.remove("film-returned");
    composeInputElement?.style.removeProperty("--film-input-opacity");
    composeOverlayElement?.classList.remove("film-outro-hidden");
    if (paletteElement) paletteElement.innerHTML = "";
    const reasoning = document.getElementById("reasoning");
    if (reasoning) reasoning.innerHTML = "";
    if (paletteCompositionElement) {
      paletteCompositionElement.innerHTML = "";
      paletteCompositionElement.style.display = "none";
    }
  }

  function openComposeForFilm() {
    if (composeOpened || typeof openCompose !== "function") return;
    composeOverlayElement?.classList.remove("film-outro-hidden");
    composeOpened = true;
    composeClosing = false;
    openCompose();
  }

  function closeComposeForFilm() {
    if (!composeOpened || composeClosing || typeof closeCompose !== "function") return;
    cleanupComposeFlights();
    composeClosing = true;
    closeCompose();
    composeOpened = false;
  }

  function suppressComposeForOutro() {
    cleanupComposeFlights();
    composeOverlayElement?.classList.add("film-outro-hidden");
    composeOverlayElement?.classList.remove("active");
    composeOverlayElement?.setAttribute("aria-hidden", "true");
    composeOpened = false;
    composeClosing = false;
  }

  function beginComposeExample(index) {
    cleanupComposeFlights();
    composeIndex = index;
    composeResultIndex = -1;
    composeOutIndex = -1;
    setPicked([]);
    if (composeInputElement) composeInputElement.value = "";
    if (charCountElement) charCountElement.textContent = "0 字";
    if (composeResultElement) composeResultElement.classList.remove("active");
    if (composeResultElement) composeResultElement.classList.remove("film-returned");
    if (paletteElement) paletteElement.innerHTML = "";
    const reasoning = document.getElementById("reasoning");
    if (reasoning) reasoning.innerHTML = "";
    if (paletteCompositionElement) {
      paletteCompositionElement.innerHTML = "";
      paletteCompositionElement.style.display = "none";
    }
  }

  function revealComposeResult(index, prompt) {
    if (
      composeResultIndex === index ||
      typeof renderResult !== "function" ||
      typeof generatePalette !== "function"
    ) return;
    composeResultIndex = index;
    renderResult(prompt);
    composeResultElement?.classList.remove("film-returned");
    const cards = Array.from(document.querySelectorAll("#palette .palette-card"));
    const ids = cards.map((card) => card.dataset.id).filter(Boolean);
    setPicked(ids);
    cleanupComposeFlights(true);

    cards.forEach((card) => card.classList.add("flight-target"));
    cards.forEach((card, cardIndex) => {
      const sourceId = card.dataset.id;
      const sourceColor = orderedColors.find((color) => color.id === sourceId);
      const sourceChip = chipById.get(sourceId);
      if (!sourceId || !sourceColor || !sourceChip) {
        card.classList.remove("flight-target");
        return;
      }

      const clone = card.cloneNode(true);
      clone.classList.remove("flight-target", "flight-landing", "flight-landed");
      clone.classList.add("summon-flight-card");
      clone.dataset.flightIndex = String(cardIndex);
      clone.removeAttribute("role");
      clone.hidden = true;
      clone.style.left = "-10000px";
      clone.style.top = "-10000px";
      clone.style.opacity = "0";
      clone.style.setProperty("--flight-color", sourceColor.hex);
      clone.style.setProperty("--flight-dot-opacity", "1");
      summonFlightLayer.appendChild(clone);
      sourceChip.style.setProperty("--flight-index", String(cardIndex));
      composeFlights.push({
        id: sourceId,
        index: cardIndex,
        sourceColor,
        sourceChip,
        targetCard: card,
        clone
      });
    });
  }

  function cleanupComposeFlights(
    keepTargets = false,
    preserveHiddenTargets = false
  ) {
    composeFlights.forEach((flight) => {
      flight.sourceChip?.classList.remove(
        "is-flight-arming",
        "is-flight-departed"
      );
      flight.sourceChip?.style.removeProperty("--flight-index");
      flight.sourceChip?.style.removeProperty("--flight-source-opacity");
      if (preserveHiddenTargets) {
        flight.targetCard?.classList.add(
          "flight-target",
          "flight-landing",
          "flight-landed"
        );
        flight.targetCard?.style.setProperty("--flight-opacity", "0");
      } else {
        flight.targetCard?.classList.remove(
          "flight-target",
          "flight-landing",
          "flight-landed"
        );
        flight.targetCard?.style.removeProperty("--flight-opacity");
      }
      flight.clone?.remove();
    });
    summonFlightLayer.innerHTML = "";
    composeFlights = [];
    if (!keepTargets) setPicked([]);
  }

  function updateComposeFlights(local, example) {
    if (!composeFlights.length) return;
    const graphBounds = stage.getBoundingClientRect();
    const stageScaleX = graphBounds.width / Math.max(1, geometry.width);
    const stageScaleY = graphBounds.height / Math.max(1, geometry.height);
    const toStageRect = (rect) => ({
      left: (rect.left - graphBounds.left) / Math.max(.001, stageScaleX),
      top: (rect.top - graphBounds.top) / Math.max(.001, stageScaleY),
      width: rect.width / Math.max(.001, stageScaleX),
      height: rect.height / Math.max(.001, stageScaleY)
    });
    const exampleStart = example.start;

    composeFlights.forEach((flight) => {
      const timing = composeFlightTiming(flight.id);
      const launch = timing.launch;
      const duration = COMPOSE_OUTBOUND_DURATION;
      const returnLaunch = timing.returnLaunch;
      const returnDuration = timing.returnDuration;

      if (local >= returnLaunch) {
        const returnU = clamp01((local - returnLaunch) / returnDuration);
        const measuredTarget = toStageRect(
          flight.targetCard.getBoundingClientRect()
        );
        const completionTime =
          exampleStart + returnLaunch + returnDuration;
        const sourcePose = poseForColor(
          flight.sourceColor,
          completionTime
        );
        const sourceScale =
          sourcePose.scale *
          pickedBoostAt(completionTime, flight.id) *
          1.06;
        const sourceWidth = geometry.nodeSize * sourceScale;
        const sourceHeight = geometry.nodeSize * sourceScale;
        const from = {
          left: measuredTarget.width
            ? measuredTarget.left
            : geometry.width * .72 + flight.index * 154,
          top: measuredTarget.height
            ? measuredTarget.top
            : geometry.height * .32,
          width: measuredTarget.width || 142,
          height: measuredTarget.height || 330
        };
        const returnTo = {
          left: sourcePose.x - sourceWidth / 2,
          top: sourcePose.y - sourceHeight / 2,
          width: sourceWidth,
          height: sourceHeight
        };
        flight.clone.style.width = `${Math.max(1, from.width)}px`;
        flight.clone.style.height = `${Math.max(1, from.height)}px`;
        const startX = from.left + from.width / 2;
        const startY = from.top + from.height / 2;
        const endX = returnTo.left + returnTo.width / 2;
        const endY = returnTo.top + returnTo.height / 2;
        const controlX = lerp(startX, endX, .48);
        const controlY = Math.min(startY, endY) - 76 - flight.index * 6;
        const eased = smooth(returnU);
        const dotMorph = smooth((returnU - .62) / .34);
        const inverse = 1 - eased;
        const x =
          inverse * inverse * startX +
          2 * inverse * eased * controlX +
          eased * eased * endX;
        const y =
          inverse * inverse * startY +
          2 * inverse * eased * controlY +
          eased * eased * endY;
        const targetWidth = Math.max(1, from.width);
        const targetHeight = Math.max(1, from.height);
        const scaleX = lerp(
          1,
          Math.max(.12, returnTo.width / targetWidth),
          eased
        );
        const scaleY = lerp(
          1,
          Math.max(.08, returnTo.height / targetHeight),
          eased
        );
        const rotation = lerp(0, sourcePose.rotate, eased);
        const sourceArrival = smooth((returnU - .8) / .2);
        const returnEntry = smooth(returnU / .14);

        flight.clone.style.left = `${x.toFixed(2)}px`;
        flight.clone.style.top = `${y.toFixed(2)}px`;
        flight.clone.style.opacity = (
          returnEntry * (1 - sourceArrival)
        ).toFixed(3);
        flight.clone.style.borderRadius =
          `${lerp(0, 999, dotMorph).toFixed(2)}px`;
        flight.clone.style.setProperty(
          "--flight-dot-opacity",
          dotMorph.toFixed(3)
        );
        flight.clone.style.transform =
          `translate(-50%, -50%) rotate(${rotation.toFixed(3)}deg) ` +
          `scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
        const cloneInfo = flight.clone.querySelector(".info");
        if (cloneInfo) {
          cloneInfo.style.opacity = (1 - smooth(returnU / .5)).toFixed(3);
        }
        flight.clone.hidden = false;

        flight.targetCard.classList.add("flight-landing", "flight-landed");
        flight.targetCard.style.setProperty(
          "--flight-opacity",
          (1 - returnEntry).toFixed(3)
        );
        flight.sourceChip.classList.add(
          "is-flight-arming",
          "is-flight-departed"
        );
        flight.sourceChip.style.setProperty(
          "--flight-source-opacity",
          sourceArrival.toFixed(3)
        );
        if (returnU >= 1) {
          flight.clone.hidden = true;
          flight.targetCard.style.setProperty("--flight-opacity", "0");
          flight.sourceChip.classList.remove("is-flight-departed");
        }
        return;
      }

      const raw = (local - launch) / duration;
      const u = clamp01(raw);

      if (raw < 0) {
        flight.clone.hidden = true;
        flight.sourceChip.classList.toggle(
          "is-flight-arming",
          local >= launch - .18
        );
        flight.sourceChip.classList.remove("is-flight-departed");
        flight.sourceChip.style.setProperty("--flight-source-opacity", "1");
        flight.targetCard.classList.remove("flight-landing", "flight-landed");
        flight.targetCard.style.setProperty("--flight-opacity", "0");
        return;
      }

      const launchPose = poseForColor(
        flight.sourceColor,
        exampleStart + launch
      );
      const sourceScale =
        launchPose.scale *
        pickedBoostAt(exampleStart + launch, flight.id) *
        1.06;
      const sourceWidth = geometry.nodeSize * sourceScale;
      const sourceHeight = geometry.nodeSize * sourceScale;
      const from = {
        left: launchPose.x - sourceWidth / 2,
        top: launchPose.y - sourceHeight / 2,
        width: sourceWidth,
        height: sourceHeight
      };
      const measuredTarget = toStageRect(
        flight.targetCard.getBoundingClientRect()
      );
      const to = {
        left: measuredTarget.width
          ? measuredTarget.left
          : geometry.width * .72 + flight.index * 154,
        top: measuredTarget.height
          ? measuredTarget.top
          : geometry.height * .32,
        width: measuredTarget.width || 142,
        height: measuredTarget.height || 330
      };
      const targetWidth = Math.max(1, to.width);
      const targetHeight = Math.max(1, to.height);
      flight.clone.style.width = `${targetWidth}px`;
      flight.clone.style.height = `${targetHeight}px`;
      flight.sourceChip.classList.add(
        "is-flight-arming",
        "is-flight-departed"
      );
      const startX = from.left + from.width / 2;
      const startY = from.top + from.height / 2;
      const endX = to.left + to.width / 2;
      const endY = to.top + to.height / 2;
      const controlX = lerp(startX, endX, .46);
      const controlY = Math.min(startY, endY) - 86 - flight.index * 7;
      const travel = smooth(u);
      const morph = smooth((u - .64) / .34);
      const inverse = 1 - travel;
      const x =
        inverse * inverse * startX +
        2 * inverse * travel * controlX +
        travel * travel * endX;
      const y =
        inverse * inverse * startY +
        2 * inverse * travel * controlY +
        travel * travel * endY -
        Math.sin(clamp01((u - .76) / .24) * Math.PI) * 8;
      const scaleX = lerp(
        Math.max(.012, from.width / targetWidth),
        1,
        morph
      );
      const scaleY = lerp(
        Math.max(.012, from.height / targetHeight),
        1,
        morph
      );
      const rotation = lerp(launchPose.rotate, 0, travel);
      const landing = smooth((u - .84) / .16);
      const entry = smooth(u / .08);
      flight.sourceChip.style.setProperty(
        "--flight-source-opacity",
        (1 - entry).toFixed(3)
      );

      flight.clone.style.left = `${x.toFixed(2)}px`;
      flight.clone.style.top = `${y.toFixed(2)}px`;
      flight.clone.style.opacity = (entry * (1 - landing)).toFixed(3);
      flight.clone.style.borderRadius =
        `${lerp(999, 0, morph).toFixed(2)}px`;
      flight.clone.style.setProperty(
        "--flight-dot-opacity",
        (1 - morph).toFixed(3)
      );
      flight.clone.style.transform =
        `translate(-50%, -50%) rotate(${rotation.toFixed(3)}deg) ` +
        `scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
      const cloneInfo = flight.clone.querySelector(".info");
      if (cloneInfo) {
        cloneInfo.style.opacity = smooth((u - .68) / .24).toFixed(3);
      }
      flight.clone.hidden = false;

      if (landing > 0) {
        flight.targetCard.classList.add("flight-landing");
        flight.targetCard.style.setProperty(
          "--flight-opacity",
          landing.toFixed(3)
        );
      }
      if (u >= 1) {
        flight.clone.hidden = true;
        flight.targetCard.classList.add("flight-landed");
        flight.targetCard.style.setProperty("--flight-opacity", "1");
      }
    });
  }

  function sendComposeResultOut(index) {
    if (composeOutIndex === index) return;
    composeOutIndex = index;
    composeResultElement?.classList.add("film-returned");
    composeResultElement?.classList.remove("active");
    cleanupComposeFlights(false, true);
  }

  function updateSystemGraph(time, scene) {
    let nextId = "";
    if (scene === "graph") {
      if (time < 90.1) nextId = "tianqing";
      else if (time < 91.75) nextId = "zhusha";
      else nextId = "dianlan";
    }
    if (nextId === graphFocusId) return;
    graphFocusId = nextId;
    if (nextId && typeof selectColor === "function") {
      panel.classList.remove("panel-refresh");
      void panel.offsetWidth;
      selectColor(nextId, false);
      panel.classList.add("panel-refresh");
    } else if (typeof deselect === "function") {
      panel.classList.remove("panel-refresh");
      deselect();
    }
  }

  function updateCompose(time) {
    if (time < ARCHIVE_COMPOSE_START) {
      closeComposeForFilm();
      document.body.classList.remove("film-compose");
      return;
    }
    if (time >= COMPOSE_END) {
      closeComposeForFilm();
      return;
    }
    openComposeForFilm();
    if (manualCompose) return;
    const index = COMPOSE_EXAMPLES.findIndex(
      (example) => time >= example.start && time < example.end
    );
    if (index < 0) return;
    const example = COMPOSE_EXAMPLES[index];
    const local = time - example.start;
    if (composeIndex !== index) beginComposeExample(index);

    const inputEntry = smooth((local - .04) / .28);
    const inputExit =
      1 - smooth((local - COMPOSE_INPUT_EXIT_AT) / .38);
    composeInputElement?.style.setProperty(
      "--film-input-opacity",
      Math.min(inputEntry, inputExit).toFixed(3)
    );
    const typedProgress = smooth((local - .2) / 1.6);
    const count = Math.floor(example.prompt.length * typedProgress);
    const typed = example.prompt.slice(0, count);
    if (composeInputElement && composeInputElement.value !== typed) {
      composeInputElement.value = typed;
      if (charCountElement) charCountElement.textContent = `${typed.length} 字`;
    }

    if (local >= 1.8) revealComposeResult(index, example.prompt);
    if (local >= 1.8) updateComposeFlights(local, example);
    if (local >= COMPOSE_SEND_OUT_AT) sendComposeResultOut(index);
  }

  function updateProgress(time) {
    const progress = clamp01(time / FILM_DURATION);
    progressFill.style.setProperty("--film-progress", progress.toFixed(5));
  }

  function updatePlaybackButton() {
    pauseButton.textContent =
      playback.targetSpeed > 0 ? "暂停 · SPACE" : "继续 · SPACE";
    document.body.classList.toggle(
      "cinematic-paused",
      playback.targetSpeed === 0 && !playback.finished
    );
  }

  function pause(reason = "manual") {
    if (playback.finished) return;
    if (["manual", "hover", "inspect", "compose"].includes(reason)) {
      playback.userControlled = true;
    }
    playback.pauseReason = reason;
    playback.targetSpeed = 0;
    if (reason !== "hover") {
      playback.speed = 0;
      playback.last = performance.now();
    }
    pauseMusic(true);
    updatePlaybackButton();
  }

  function play(reason = "manual") {
    if (playback.finished) return;
    if (reason === "manual") playback.userControlled = true;
    dockComposeInStage();
    document.body.classList.add("cinematic-active");
    stage.hidden = false;
    playback.started = true;
    playback.last = performance.now();
    playback.pauseReason = reason;
    playback.targetSpeed = 1;
    startMusic();
    updatePlaybackButton();
  }

  function showInspector(color) {
    if (!color) return;
    window.clearTimeout(hoverPauseTimer);
    window.clearTimeout(hoverResumeTimer);
    window.clearTimeout(inspectorResumeTimer);
    inspectorWasRunning =
      playback.targetSpeed > 0 || playback.pauseReason === "hover";
    pause("inspect");
    inspector.style.setProperty("--inspect-color", color.hex);
    inspector.querySelector("h3").textContent = color.name;
    inspector.querySelector(".film-inspector-head p").textContent =
      `${color.pinyin.toUpperCase()} · ${color.hex.toUpperCase()}`;
    inspector.querySelector(".film-inspector-head span").textContent =
      `${categories[color.cat].cn} · ${categories[color.cat].en}`;
    inspector.querySelector('[data-field="origin"]').textContent = color.origin;
    inspector.querySelector('[data-field="context"]').textContent = color.context;
    inspector.querySelector('[data-field="era"]').textContent = color.era;
    inspector.querySelector('[data-field="cites"]').textContent = color.cites.join(" · ");
    inspector.classList.add("active");
    inspector.setAttribute("aria-hidden", "false");
  }

  function closeInspector(shouldResume = true) {
    window.clearTimeout(inspectorResumeTimer);
    inspector.classList.remove("active");
    inspector.setAttribute("aria-hidden", "true");
    if (shouldResume && inspectorWasRunning && playback.pauseReason === "inspect") {
      inspectorResumeTimer = window.setTimeout(() => {
        if (
          !playback.finished &&
          !inspector.classList.contains("active") &&
          playback.pauseReason === "inspect"
        ) {
          play("inspect-resume");
        }
      }, 120);
    }
  }

  function clearFilmTimers() {
    [
      hoverPauseTimer,
      hoverResumeTimer,
      inspectorResumeTimer,
      finishHideTimer,
      finishSelectTimer
    ].forEach((timer) => window.clearTimeout(timer));
    hoverPauseTimer = 0;
    hoverResumeTimer = 0;
    inspectorResumeTimer = 0;
    finishHideTimer = 0;
    finishSelectTimer = 0;
  }

  function cleanupFilmClasses() {
    document.body.classList.remove(
      "cinematic-active",
      "cinematic-paused",
      "film-compose"
    );
    panel.classList.remove("panel-switch");
    setAutoFocus(null);
    setPicked([]);
  }

  function finishFilm(takeover = false) {
    if (playback.finished) return;
    clearFilmTimers();
    playback.finished = true;
    playback.userControlled = true;
    playback.targetSpeed = 0;
    playback.speed = 0;
    updateMusicEnvelope(FILM_DURATION);
    pauseMusic(false);
    closeComposeForFilm();
    restoreComposeHome();
    closeInspector(false);
    clearFocusVisuals();
    panel.classList.remove("panel-switch");
    stage.classList.add("is-finished");
    finishHideTimer = window.setTimeout(() => {
      stage.hidden = true;
      restoreGraphHome();
      cleanupFilmClasses();
      finishHideTimer = 0;
      window.animationFinished = true;
    }, 1020);
    if (!takeover && typeof selectColor === "function") {
      finishSelectTimer = window.setTimeout(() => {
        if (playback.finished) selectColor("tianqing", false);
        finishSelectTimer = 0;
      }, 320);
    }
    updatePlaybackButton();
  }

  function resetPlayback() {
    clearFilmTimers();
    closeComposeForFilm();
    resetComposeVisuals();
    closeInspector(false);
    if (typeof deselect === "function") deselect();
    currentScene = "";
    graphFocusId = "";
    clearFocusVisuals();
    composeOpened = false;
    composeClosing = false;
    playback.time = 0;
    playback.speed = 0;
    playback.targetSpeed = 1;
    playback.last = performance.now();
    playback.finished = false;
    playback.started = true;
    playback.pauseReason = "";
    playback.userControlled = true;
    playback.hiddenWasPlaying = false;
    pauseMusic(false);
    seekMusic(0);
    dockGraphInStage();
    dockComposeInStage();
    document.body.classList.add("cinematic-active");
    document.body.classList.remove("film-compose");
    stage.hidden = false;
    stage.classList.remove("is-finished", "is-interactive");
    stage.dataset.scene = "ring";
    window.animationFinished = false;
    updatePlaybackButton();
    requestAnimationFrame(() => render(0));
    startMusic();
  }

  function render(time) {
    if (!geometry) resizeStage();
    updateMusicEnvelope(time);
    stage.dataset.time = time.toFixed(2);
    const scene = sceneForTime(time);
    setScene(scene);
    updateSystemGraph(time, scene);
    updateFocus(time, scene);
    updateProvenanceChoreography(time, scene);
    updateMorphState(time, scene);
    updateCompose(time);
    updateCover(time);
    applyPoses(time);
    updateAtlasCore(time, scene);
    drawLinks(time);
    updateProgress(time);
    stage.classList.toggle("is-interactive", time >= SOURCE_READY);
  }

  function tick(now) {
    const delta = Math.min(.05, Math.max(0, (now - playback.last) / 1000));
    playback.last = now;
    if (playback.started && !playback.finished) {
      const musicDrivesTimeline =
        playback.targetSpeed > 0 &&
        musicClockActive &&
        filmMusic &&
        !filmMusic.paused &&
        Number.isFinite(filmMusic.currentTime);
      if (musicDrivesTimeline) {
        playback.speed = 1;
        playback.time = filmMusic.currentTime;
      } else {
        playback.speed = damp(
          playback.speed,
          playback.targetSpeed,
          playback.targetSpeed === 0 ? .2 : .34,
          delta
        );
        playback.time += delta * playback.speed;
      }
      if (playback.time >= FILM_DURATION) {
        playback.time = FILM_DURATION;
        render(playback.time);
        finishFilm(false);
      } else {
        render(playback.time);
      }
    }
    playback.frame = requestAnimationFrame(tick);
  }

  chipById.forEach((chip, id) => {
    chip.addEventListener("pointerenter", () => {
      if (
        isRecordingMode() ||
        playback.finished ||
        playback.time < SOURCE_READY ||
        playback.targetSpeed === 0
      ) return;
      window.clearTimeout(hoverResumeTimer);
      hoverPauseTimer = window.setTimeout(() => pause("hover"), 120);
    });
    chip.addEventListener("pointerleave", () => {
      window.clearTimeout(hoverPauseTimer);
      if (inspector.classList.contains("active")) return;
      if (playback.pauseReason !== "hover") return;
      hoverResumeTimer = window.setTimeout(() => play("hover-resume"), 900);
    });
    chip.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isRecordingMode()) return;
      showInspector(orderedColors.find((color) => color.id === id));
    });
  });

  inspector.querySelector(".film-inspector-close").addEventListener("click", closeInspector);
  pauseButton.addEventListener("click", () => {
    if (playback.targetSpeed > 0) pause("manual");
    else play("manual");
  });
  restartButton.addEventListener("click", resetPlayback);
  async function toggleStageFullscreen({ restart = false } = {}) {
    const active =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (active) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (typeof exit === "function") await exit.call(document);
      return;
    }
    const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
    if (typeof request !== "function") return;
    await request.call(stage, { navigationUI: "hide" });
    document.body.classList.add("record-mode");
    if (restart) resetPlayback();
    resizeStage();
  }

  fullscreenButton?.addEventListener("click", () => {
    toggleStageFullscreen({ restart: true }).catch(() => {
      // Fullscreen requires an explicit browser-approved user gesture.
    });
  });
  replayTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetPlayback();
  });
  skipButton.addEventListener("click", () => finishFilm(false));

  const syncFullscreenRecordingMode = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement;
    if (fullscreenElement === stage) {
      document.body.classList.add("record-mode");
    } else if (!recordMode) {
      document.body.classList.remove("record-mode");
    }
    resizeStage();
  };
  document.addEventListener("fullscreenchange", syncFullscreenRecordingMode);
  document.addEventListener(
    "webkitfullscreenchange",
    syncFullscreenRecordingMode
  );

  legend.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target.closest("#filmReplay")) return;
      if (!playback.finished) finishFilm(true);
    },
    true
  );

  stage.addEventListener(
    "wheel",
    () => {
      if (!isRecordingMode() && !playback.finished) finishFilm(true);
    },
    { passive: true }
  );

  composeInputElement?.addEventListener("pointerdown", () => {
    if (
      isRecordingMode() ||
      currentScene !== "compose" ||
      playback.finished
    ) return;
    manualCompose = true;
    pause("compose");
  });
  composeInputElement?.addEventListener("input", (event) => {
    if (
      isRecordingMode() ||
      !event.isTrusted ||
      currentScene !== "compose" ||
      playback.finished
    ) return;
    manualCompose = true;
    pause("compose");
  });
  document.getElementById("composeClose")?.addEventListener("pointerdown", () => {
    if (currentScene === "compose" && !playback.finished) finishFilm(true);
  });
  paletteElement?.addEventListener(
    "click",
    (event) => {
      if (
        event.target.closest(".palette-card") &&
        currentScene === "compose" &&
        !playback.finished
      ) {
        manualCompose = true;
        finishFilm(true);
      }
    },
    true
  );

  const isEditableShortcutTarget = (event) => {
    const target =
      event.target instanceof Element ? event.target : document.activeElement;
    return Boolean(
      target?.closest?.(
        'input, textarea, select, button, [contenteditable]:not([contenteditable="false"])'
      )
    );
  };

  document.addEventListener("keydown", (event) => {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (event.key === "Escape" && fullscreenElement) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (typeof exit === "function") Promise.resolve(exit.call(document)).catch(() => {});
      return;
    }
    if (event.key === "Escape" && inspector.classList.contains("active")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeInspector();
      return;
    }
    if (
      event.key === "Escape" &&
      currentScene === "compose" &&
      composeOverlayElement?.classList.contains("active") &&
      !playback.finished
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      finishFilm(true);
      return;
    }
    if (event.isComposing || isEditableShortcutTarget(event)) return;
    if (event.repeat) return;
    if (
      event.code === "Space"
    ) {
      event.preventDefault();
      if (playback.targetSpeed > 0) pause("manual");
      else play("manual");
    }
    if (
      event.code === "KeyF" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      toggleStageFullscreen({ restart: false }).catch(() => {});
      return;
    }
    if (
      event.key.toLowerCase() === "r"
    ) {
      resetPlayback();
    }
  }, true);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      playback.hiddenWasPlaying = playback.targetSpeed > 0;
      if (playback.hiddenWasPlaying) {
        pause("hidden");
      } else {
        playback.speed = 0;
        playback.last = performance.now();
      }
    } else if (playback.hiddenWasPlaying && !playback.finished) {
      playback.hiddenWasPlaying = false;
      play("visible");
    }
  });

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(resizeStage)
    : null;
  if (resizeObserver) resizeObserver.observe(stage);
  else window.addEventListener("resize", resizeStage, { passive: true });

  window.AtlasFilm = {
    duration: FILM_DURATION,
    timeline: FILM_TIMELINE,
    play,
    pause,
    restart: resetPlayback,
    finish: () => finishFilm(false),
    seek(seconds) {
      const value = Math.max(0, Math.min(FILM_DURATION, Number(seconds) || 0));
      clearFilmTimers();
      closeComposeForFilm();
      resetComposeVisuals();
      closeInspector(false);
      if (typeof deselect === "function") deselect();
      currentScene = "";
      graphFocusId = "";
      clearFocusVisuals();
      composeOpened = false;
      composeClosing = false;
      playback.time = value;
      playback.speed = 0;
      playback.targetSpeed = 0;
      playback.finished = false;
      playback.started = true;
      playback.userControlled = true;
      playback.hiddenWasPlaying = false;
      playback.last = performance.now();
      pauseMusic(false);
      seekMusic(value);
      dockGraphInStage();
      dockComposeInStage();
      document.body.classList.add("cinematic-active");
      document.body.classList.remove("film-compose");
      stage.hidden = false;
      stage.classList.remove("is-finished");
      stage.classList.remove("is-interactive");
      window.animationFinished = false;
      render(value);
      updatePlaybackButton();
    },
    get time() {
      return playback.time;
    },
    get scene() {
      return currentScene;
    },
    enterFullscreen() {
      return toggleStageFullscreen({ restart: true });
    },
    toggleFullscreen() {
      return toggleStageFullscreen({ restart: false });
    }
  };
  window.__ATLAS_DURATION = FILM_DURATION;
  window.__ATLAS_TIMELINE = FILM_TIMELINE;
  window.__ATLAS_SET_TIME = window.AtlasFilm.seek;

  resizeStage();
  render(initialTime);
  pauseMusic(false);
  seekMusic(initialTime);
  updateMusicEnvelope(initialTime);
  playback.frame = requestAnimationFrame(tick);

  const readinessImages = [
    filmCoverImage,
    ...Array.from(sourceHost.querySelectorAll("img"))
  ].filter(Boolean);
  const imageReadiness = readinessImages.map((image) => {
    if (image.complete) return Promise.resolve();
    if (typeof image.decode === "function") return image.decode().catch(() => {});
    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  });
  const fontsReady = document.fonts?.ready || Promise.resolve();
  const timeoutReady = new Promise((resolve) => window.setTimeout(resolve, 1800));

  Promise.race([
    Promise.all([fontsReady, ...imageReadiness]),
    timeoutReady
  ]).then(() => {
    if (playback.finished || playback.userControlled) {
      return;
    }
    if (typeof deselect === "function") deselect();
    document.body.classList.add("cinematic-active");
    playback.started = true;
    playback.last = performance.now();
    if (document.hidden) {
      playback.hiddenWasPlaying = !reducedMotion && !initiallyPaused;
      playback.pauseReason = "hidden";
      playback.targetSpeed = 0;
    } else {
      playback.targetSpeed = reducedMotion || initiallyPaused ? 0 : 1;
    }
    updatePlaybackButton();
    if (reducedMotion) {
      finishFilm(false);
    } else if (playback.targetSpeed > 0) {
      startMusic();
    } else {
      pauseMusic(true);
    }
  });
  } catch (error) {
    window.__ATLAS_INIT_ERROR = error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack || ""}`
      : String(error);
    console.error(error);
  }
})();
