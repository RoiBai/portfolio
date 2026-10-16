export const IMAGE_VARIANTS = {
  "/assets/research-editorial/verse-interface.jpg": "/assets/research-clarity/verse-interface-lossless.webp",
  "/assets/editorial-20261014/glance-371@4x.png": "/assets/fast/glance-hero.webp",
  "/assets/research-interactive/suzhou-original-handscroll.jpg": "/assets/fast/suzhou-scroll.webp",
  "/assets/research-editorial/verse-meaning-in-context.png": "/assets/research-clarity/verse-hero-lossless.webp",
  "/assets/games-motion/loofa-ensemble-cutout.png": "/assets/fast/loofa-cast.webp",
  "/assets/research-interactive/persona-phd-story.png": "/assets/research-clarity/persona-story-lossless.webp"
};
export const imageVariant = path => IMAGE_VARIANTS[path] || path;
