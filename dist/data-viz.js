// Source-checked definitions; see workbench/data-viz-provenance.md.
export const DATA_VISUAL_REPLACEMENTS = [
  {
    "projectId": "glancemap",
    "sectionId": "findings",
    "originalSrc": "/assets/1113-254-3x-575d03ab.webp",
    "visual": {
      "id": "glance-recall",
      "type": "bars",
      "title": "Free recall, now and one week later",
      "description": "Material-adjusted mean scores. Both comparisons use the same 0–100% scale.",
      "panels": [
        {
          "title": "Immediately after learning",
          "unit": "Free recall (%)",
          "min": 0,
          "max": 100,
          "rows": [
            {
              "label": "Illustration Only",
              "value": 48.3,
              "display": "48.3%",
              "series": "comparison"
            },
            {
              "label": "GlanceMap",
              "value": 57.9,
              "display": "57.9%",
              "series": "primary"
            }
          ],
          "note": "+9.6 percentage points with GlanceMap."
        },
        {
          "title": "Seven days later",
          "unit": "Free recall (%)",
          "min": 0,
          "max": 100,
          "rows": [
            {
              "label": "Illustration Only",
              "value": 45.0,
              "display": "45.0%",
              "series": "comparison"
            },
            {
              "label": "GlanceMap",
              "value": 52.0,
              "display": "52.0%",
              "series": "primary"
            }
          ],
          "note": "+7.0 percentage points with GlanceMap."
        }
      ],
      "scope": "16 participants. These are material-adjusted means, not individual scores. Bars show point estimates on a common percentage scale."
    },
    "sources": [
      "workbench/figma-glance-image-1113-254.json — current Figma 1113:254 text values",
      "../tmp/glancemap/submission-2026-09-14/paper.txt:1090–1104; Table 3:1275–1284"
    ]
  },
  {
    "projectId": "glancemap",
    "sectionId": "findings",
    "originalSrc": "/assets/1113-258-3x-fffffc22.webp",
    "visual": {
      "id": "glance-recognition",
      "type": "bars",
      "title": "The picture-memory tradeoff",
      "description": "Observed illustration-recognition accuracy.",
      "panels": [
        {
          "title": "Picture recognition",
          "unit": "Correct responses (%)",
          "min": 0,
          "max": 100,
          "rows": [
            {
              "label": "Illustration Only",
              "value": 83.0,
              "display": "83.0%",
              "series": "comparison"
            },
            {
              "label": "GlanceMap",
              "value": 75.9,
              "display": "75.9%",
              "series": "primary"
            }
          ],
          "note": "−7.1 percentage points with GlanceMap."
        }
      ],
      "scope": "Illustration Only: 93/112 responses. GlanceMap: 85/112. Better lesson recall co-occurred with poorer illustration recognition; the comparison does not isolate the causal contribution of individual interface features."
    },
    "sources": [
      "workbench/figma-glance-image-1113-258.json — current Figma 1113:258",
      "../tmp/glancemap/submission-2026-09-14/paper.txt:1155–1158"
    ]
  },
  {
    "projectId": "traditional-color",
    "sectionId": "pilot",
    "originalSrc": "/assets/colorgene-05-pilot-results-60d1adf8.webp",
    "visual": {
      "id": "colorgene-pilot",
      "type": "bars",
      "title": "A small pilot, a larger reported change",
      "description": "Mean pre-to-post questionnaire gain, measured in points.",
      "panels": [
        {
          "title": "Change in TCSCDS score",
          "unit": "Questionnaire change (points)",
          "min": 0,
          "max": 10,
          "rows": [
            {
              "label": "Usual workflow",
              "value": 1.21,
              "display": "+1.21",
              "series": "comparison"
            },
            {
              "label": "ColoGene",
              "value": 8.66,
              "display": "+8.66",
              "series": "primary"
            }
          ],
          "note": "ColoGene mean total score: 18.91 before → 27.57 after."
        },
        {
          "title": "Finished within 15 minutes",
          "unit": "Participants (out of 5)",
          "min": 0,
          "max": 5,
          "rows": [
            {
              "label": "Usual workflow",
              "value": 4,
              "display": "4 / 5",
              "series": "comparison"
            },
            {
              "label": "ColoGene",
              "value": 5,
              "display": "5 / 5",
              "series": "primary"
            }
          ],
          "note": ""
        }
      ],
      "scope": "Five participants per group. These descriptive pilot results suggest a direction for further study; they do not establish effectiveness."
    },
    "sources": [
      "../tmp/pdfs/colorgene/text.txt:332–352; section 5.2"
    ]
  },
  {
    "projectId": "beyond-the-gaze",
    "sectionId": "example",
    "originalSrc": "/assets/hll-metrics-case-c5d7bdfe.webp",
    "visual": {
      "id": "gaze-single-case",
      "type": "bars",
      "title": "Many returns. Shorter fixations.",
      "description": "One viewer of The Hay Wain, region A3. These are separate measures with separate scales.",
      "panels": [
        {
          "title": "Visits to the region",
          "unit": "Visits",
          "min": 0,
          "max": 40,
          "rows": [
            {
              "label": "Trial mean",
              "value": 20.33,
              "display": "20.33",
              "series": "comparison"
            },
            {
              "label": "Region A3",
              "value": 38,
              "display": "38",
              "series": "primary"
            }
          ],
          "note": ""
        },
        {
          "title": "Mean fixation duration",
          "unit": "Seconds",
          "min": 0,
          "max": 0.2,
          "rows": [
            {
              "label": "Trial mean",
              "value": 0.17,
              "display": "0.170 s",
              "series": "comparison"
            },
            {
              "label": "Region A3",
              "value": 0.051,
              "display": "0.051 s",
              "series": "primary"
            }
          ],
          "note": ""
        }
      ],
      "scope": "One participant–painting–region record, not a group average. Repeated access and short fixations co-occurred here; this does not establish a viewing mechanism or prove absent understanding."
    },
    "sources": [
      "../research_portfolio/gaze.md — One concrete example; source pp. 5–6",
      "../research_portfolio/v2/hll-definition-results-copy.md — concrete-case pair"
    ]
  },
  {
    "projectId": "suzhou-scrollverse",
    "sectionId": "study",
    "originalSrc": "/assets/fig4-study-results-bc437b38.webp",
    "visual": {
      "id": "suzhou-study",
      "type": "bars",
      "title": "What participants reported",
      "description": "A concise reconstruction from values reported in the manuscript.",
      "panels": [
        {
          "title": "System usability",
          "unit": "SUS score (0–100)",
          "min": 0,
          "max": 100,
          "rows": [
            {
              "label": "Annotation viewer",
              "value": 70.33,
              "display": "70.33",
              "series": "comparison"
            },
            {
              "label": "ScrollVerse",
              "value": 75.42,
              "display": "75.42",
              "series": "primary"
            }
          ],
          "note": "Difference not statistically significant (p = .294)."
        },
        {
          "title": "Perceived workload",
          "unit": "Mean workload rating",
          "min": 0,
          "max": 5,
          "rows": [
            {
              "label": "Annotation viewer",
              "value": 2.56,
              "display": "2.56",
              "series": "comparison"
            },
            {
              "label": "ScrollVerse",
              "value": 2.33,
              "display": "2.33",
              "series": "primary"
            }
          ],
          "note": "Difference not statistically significant (p = .359). Lower ratings indicate less perceived workload."
        },
        {
          "title": "Within the ScrollVerse group",
          "unit": "Participants (out of 30)",
          "min": 0,
          "max": 30,
          "rows": [
            {
              "label": "Clearer understanding of Qing-dynasty urban life",
              "value": 25,
              "display": "25 / 30",
              "series": "primary"
            },
            {
              "label": "Recommend or try similar experiences",
              "value": 26,
              "display": "26 / 30",
              "series": "primary"
            }
          ],
          "note": "Self-reports and intentions, not objectively measured learning."
        }
      ],
      "scope": "60 participants, 30 per condition. Nonsignificant differences do not establish equivalence. The study assessed perceived experience and understanding; it did not test objective learning gains."
    },
    "sources": [
      "../research_portfolio/tmp/suzhou/full.txt:625–652 — SUS, workload, agreement percentages",
      "../research_portfolio/v2-suzhou-copy.md; current dist/content.json — 25/30 and 26/30 counts"
    ]
  },
  {
    "projectId": "versecolor",
    "sectionId": "study",
    "originalSrc": "/assets/results-aeccb8f9.webp",
    "visual": {
      "id": "verse-effect-sizes",
      "type": "bars",
      "title": "Stronger support for making connections",
      "description": "Two reported standardized differences between VerseColor and Souyun.",
      "panels": [
        {
          "title": "Questionnaire effects favoring VerseColor",
          "unit": "Cohen’s d (standardized difference)",
          "min": 0,
          "max": 2.5,
          "rows": [
            {
              "label": "Relational support",
              "value": 2.29,
              "display": "2.29",
              "series": "primary"
            },
            {
              "label": "Imagery support",
              "value": 1.91,
              "display": "1.91",
              "series": "primary"
            }
          ],
          "note": ""
        }
      ],
      "scope": "Cohen’s d is an effect size, not a percentage, multiplier, or learning score. Souyun received higher usability ratings; retrieval-precision ratings were broadly comparable. Short-term questionnaire ratings do not establish durable learning gains."
    },
    "sources": [
      "../research_portfolio/verse.txt:322–335 — Results",
      "../research_portfolio/v2/hll-definition-results-copy.md — omit d=1.07 because cognitive ease/load labels conflict"
    ]
  }
];
export const DATA_VISUAL_ADDITIONS = [];

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let instanceId = 0;
let activeCleanup;

/** Exact mapping only: a different figure in the same section is never replaced. */
export function replacementFor(projectId, sectionId, originalFigure) {
  const source = typeof originalFigure === 'string' ? originalFigure : originalFigure?.src;
  return DATA_VISUAL_REPLACEMENTS.find(item => item.projectId === projectId && item.sectionId === sectionId && item.originalSrc === source)?.visual || null;
}

function renderPanel(panel) {
  const minimum = Number(panel.min) || 0;
  const maximum = Number(panel.max);
  const span = maximum - minimum;
  if (!(span > 0) || !panel.rows?.length) return '';
  const rows = panel.rows.filter(row => Number.isFinite(Number(row.value)));
  return `<section class="dv-panel"><h4 class="dv-panel-title">${escapeHTML(panel.title)}</h4><p class="dv-unit">${escapeHTML(panel.unit)}</p><div class="dv-rows">${rows.map(row => {
    const width = Math.max(0, Math.min(100, (Number(row.value) - minimum) / span * 100));
    return `<div class="dv-row" data-series="${row.series === 'comparison' ? 'comparison' : 'primary'}"><div class="dv-row-head"><span class="dv-row-label">${escapeHTML(row.label)}</span><strong class="dv-value" data-counter-value="${escapeHTML(row.display ?? row.value)}">${escapeHTML(row.display ?? row.value)}</strong></div><div class="dv-track" aria-hidden="true"><span class="dv-fill" style="--bar-size:${width.toFixed(4)}%"></span></div></div>`;
  }).join('')}</div><div class="dv-axis" aria-hidden="true"><span>${escapeHTML(minimum)}</span><span>${escapeHTML(maximum)}</span></div>${panel.note ? `<p class="dv-note">${escapeHTML(panel.note)}</p>` : ''}</section>`;
}

/** Returns native HTML, not an image. Works before animation setup and without JS. */
export function renderDataVisual(spec) {
  if (!spec || spec.type !== 'bars') return '';
  const id = `dv-${String(spec.id || 'evidence').replace(/[^a-zA-Z0-9_-]/g, '')}-${++instanceId}`;
  const panels = spec.panels || [];
  const content = `<div class="dv-panels">${panels.map(renderPanel).join('')}</div>`;
  const dataTable = spec.type === 'bars' ? `<details class="dv-table-disclosure"><summary>Study details &amp; data</summary>${spec.scope ? `<p class="dv-scope">${escapeHTML(spec.scope)}</p>` : ''}<div class="dv-table-wrap"><table class="dv-table"><caption>${escapeHTML(spec.title)} — reported values</caption><thead><tr><th scope="col">Measure</th><th scope="col">Condition / dimension</th><th scope="col">Value</th></tr></thead><tbody>${panels.flatMap(panel => (panel.rows || []).map(row => `<tr><th scope="row">${escapeHTML(panel.title)}<br><small>${escapeHTML(panel.unit)}</small></th><td>${escapeHTML(row.label)}</td><td>${escapeHTML(row.display ?? row.value)}</td></tr>`)).join('')}</tbody></table></div></details>` : '';
  return `<figure class="project-figure data-visual native-data-visual reveal" data-native-visual="${escapeHTML(spec.id)}" data-viz-type="${spec.type}" aria-labelledby="${id}-title" style="--source-width:1000px"><div class="dv-shell"><div class="dv-kicker">Study evidence</div><h3 class="dv-title" id="${id}-title">${escapeHTML(spec.title)}</h3>${spec.description ? `<p class="dv-description">${escapeHTML(spec.description)}</p>` : ''}${content}${dataTable}</div></figure>`;
}

const numericToken = /[+−-]?\d[\d,]*(?:\.\d+)?/g;
function animatedText(original, progress) {
  let index = 0;
  // A ratio's denominator and a multiplication factor are context, not a counter.
  const firstOnly = /\d\s*(?:\/|×)\s*\d/.test(original);
  return original.replace(numericToken, token => {
    if (firstOnly && index++ > 0) return token;
    const sign = token.match(/^[+−-]/)?.[0] || '';
    const numberText = sign ? token.slice(1) : token;
    const value = Number(numberText.replaceAll(',', ''));
    const precision = numberText.includes('.') ? numberText.split('.')[1].length : 0;
    const absolute = value * progress;
    let formatted = absolute.toFixed(precision);
    if (numberText.includes(',')) {
      const [integer, decimal] = formatted.split('.');
      formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal === undefined ? '' : `.${decimal}`);
    }
    return sign + formatted;
  });
}

function counterFor(element) {
  const original = element.dataset.counterValue || element.textContent.trim();
  if (!/\d/.test(original)) return null;
  // Calendar spans are labels. Counting 1826 from year zero would misrepresent them.
  if (/^\d{4}\s*[–—-]\s*\d{4}$/.test(original)) {
    element.dataset.counterStatic = 'calendar-range';
    return null;
  }
  element.dataset.counterValue = original;
  element.innerHTML = `<span class="dv-sr-only">${escapeHTML(original)}</span><span data-counter-display aria-hidden="true">${escapeHTML(original)}</span>`;
  const display = element.querySelector('[data-counter-display]');
  return { element, original, display };
}

/** Call after each route render. Cleans up any preceding setup automatically. */
export function setupDataViz(root = document) {
  activeCleanup?.();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const records = [];
  const stats = [...root.querySelectorAll('.stats strong')];
  const charts = [...root.querySelectorAll('[data-native-visual]')];
  for (const target of charts) {
    records.push({target, counters:[...target.querySelectorAll('[data-counter-value]')].map(counterFor).filter(Boolean), chart:true, started:false, done:false});
  }
  for (const target of stats) {
    const counter = counterFor(target);
    if (counter) records.push({target, counters:[counter], chart:false, started:false, done:false});
  }
  let frame = 0, stopped = false, observer;
  const active = new Set();
  const paint = (record, progress) => {
    if (record.chart) record.target.style.setProperty('--viz-progress', String(progress));
    for (const counter of record.counters) counter.display.textContent = progress >= 1 ? counter.original : animatedText(counter.original, progress);
  };
  const finish = record => {
    paint(record, 1);
    record.done = true;
    record.target.dataset.vizAnimated = 'true';
    active.delete(record);
  };
  const tick = now => {
    frame = 0;
    if (stopped || document.hidden) return;
    for (const record of active) {
      const raw = Math.min(1, Math.max(0, (now - record.start) / 760));
      paint(record, 1 - Math.pow(1 - raw, 3));
      if (raw >= 1) finish(record);
    }
    if (active.size) frame = requestAnimationFrame(tick);
  };
  const start = record => {
    if (record.started || record.done || stopped) return;
    record.started = true;
    observer?.unobserve(record.target);
    if (motion.matches || document.hidden || (!record.chart && document.documentElement.classList.contains('project-opening'))) return finish(record);
    record.start = performance.now();
    paint(record, 0);
    active.add(record);
    if (!frame) frame = requestAnimationFrame(tick);
  };
  if (motion.matches || !('IntersectionObserver' in window)) records.forEach(finish);
  else {
    const recordByTarget = new Map(records.map(record => [record.target, record]));
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) start(recordByTarget.get(entry.target));
    }, {threshold:0, rootMargin:'0px 0px -5% 0px'});
    records.forEach(record => observer.observe(record.target));
  }
  const stopMotion = () => {
    if (!motion.matches && !document.hidden) return;
    cancelAnimationFrame(frame); frame = 0;
    // Offscreen untouched content stays at its exact final value; active runs finish.
    [...active].forEach(finish);
    if (motion.matches) records.forEach(finish);
  };
  motion.addEventListener('change', stopMotion);
  document.addEventListener('visibilitychange', stopMotion);
  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    observer?.disconnect();
    cancelAnimationFrame(frame);
    records.forEach(finish);
    motion.removeEventListener('change', stopMotion);
    document.removeEventListener('visibilitychange', stopMotion);
    if (activeCleanup === cleanup) activeCleanup = undefined;
  };
  activeCleanup = cleanup;
  return cleanup;
}
