export const IMAGE_VARIANTS = {
  "/assets/editorial-20261014/glance-371@4x.png": "/assets/fast/glance-hero.webp",
  "/assets/research-interactive/suzhou-original-handscroll.jpg": "/assets/fast/suzhou-scroll.webp",
  "/assets/research-editorial/verse-meaning-in-context.png": "/assets/fast/verse-hero.webp",
  "/assets/games-motion/loofa-ensemble-cutout.png": "/assets/fast/loofa-cast.webp",
  "/assets/research-interactive/persona-phd-story.png": "/assets/fast/persona-story.webp"
};
export const imageVariant = path => IMAGE_VARIANTS[path] || path;
