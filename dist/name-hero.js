import * as THREE from './vendor/three/three.module.js';

// Independent hero: it never reads or changes project navigation or completion state.
const hero = document.querySelector('#name-hero');
const canvas = hero?.querySelector('#hero-space');
if (hero && canvas) startNameHero().catch(error => {
  hero.dataset.heroReady = 'false';
  hero.dataset.heroError = 'true';
  console.warn('The particle title is unavailable; the text title remains visible.', error);
});

async function startNameHero() {
  const interaction = hero.querySelector('.hero-interaction') || hero;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = hero.querySelector('#hero-portrait');
  canvas.setAttribute('aria-hidden', 'true');
  if (!interaction.hasAttribute('tabindex')) interaction.tabIndex = 0;
  if (!interaction.hasAttribute('role')) interaction.setAttribute('role', 'button');
  if (!interaction.hasAttribute('aria-label')) interaction.setAttribute('aria-label', 'Ruiyuan Bai. Discover the researcher, gamer, developer and dog walker.');
  interaction.setAttribute('aria-pressed', 'false');
  if (portrait) {
    portrait.addEventListener('load', () => hero.classList.add('hero-has-portrait'));
    if (portrait.complete && portrait.naturalWidth) hero.classList.add('hero-has-portrait');
  }

  const fontFamily = getComputedStyle(hero).getPropertyValue('--hero-particle-font').trim() || '"Source Serif Pro", Georgia, serif';
  await document.fonts.load(`600 120px ${fontFamily}`).catch(() => {});
  interaction.setAttribute('aria-label', 'Ruiyuan Bai. Hover, focus or tap to discover four roles. Drag horizontally or use arrow keys to rotate the space. Press Escape to return to the name.');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false, powerPreference: 'low-power'});
  renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const space = new THREE.Group(); scene.add(space);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 160);
  camera.position.set(0, 0, 28);
  const worldHeight = 2 * 28 * Math.tan(THREE.MathUtils.degToRad(20));
  const rng = seed => () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const smooth = (a, b, value) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t); };
  let width = 0, height = 0, mobile = false, points = null, stars = null;
  let maskHeight = 420, nameMaskBounds = null, roleMaskBounds = null, resizePending = false, resizeCount = 0;
  let introProgress = 1, introActive = false, expandedHeight = innerHeight, compactHeight = 420;
  let introMetrics = null;
  const geometryBuilds = {text:0,stars:0,portrait:0};
  let particleCount = 0, starCount = 0, nameBounds = null, roleBounds = null;
  let photoPoints = null, photoSamples = null, photoBounds = null, photoParticleCount = 0;
  let progress = 0, velocity = 0, target = 0, motionTime = 0, frame = 0;
  let hover = false, focused = false, pinned = false, visible = true, pageActive = true, contextLost = false;
  let raf = 0, lastTime = 0, ready = false, lastPhase = '', lastTarget = -1;
  let pointer = {x: 0, y: 0};
  const orbit = {yaw: 0, pitch: 0};
  const orbitLimit = {yaw: THREE.MathUtils.degToRad(55), pitch: THREE.MathUtils.degToRad(25)};
  let gesture = null, dragging = false, suppressHover = false;

  // Genuine displaced sphere geometry, restored from the original universe scene.
  const moonRandom = rng(4096), moonGeometry = new THREE.SphereGeometry(3.25, 112, 80);
  const craters = Array.from({length: 52}, () => ({center: new THREE.Vector3(moonRandom() - .5, moonRandom() - .5, moonRandom() - .5).normalize(), radius: .035 + moonRandom() * .16}));
  // A few larger depressions face the initial view so relief survives small screens.
  craters.push(...[[.66,.3,.7,.24],[.34,.59,.72,.18],[.84,-.15,.52,.16]].map(([x,y,z,radius])=>({center:new THREE.Vector3(x,y,z).normalize(),radius,depth:.17})));
  const moonPosition = moonGeometry.attributes.position, normal = new THREE.Vector3();
  for (let i = 0; i < moonPosition.count; i++) {
    normal.fromBufferAttribute(moonPosition, i).normalize();
    let relief = Math.sin(normal.x * 25 + normal.z * 14) * Math.sin(normal.y * 30) * .018;
    for (const crater of craters) {
      const d = normal.distanceTo(crater.center) / crater.radius;
      if (d < 1.3) relief += d < .8 ? -(crater.depth || .09) * (1 - d * .6) : .045 * (1 - Math.abs(d - 1) * 3.3);
    }
    normal.multiplyScalar(3.25 + relief); moonPosition.setXYZ(i, normal.x, normal.y, normal.z);
  }
  moonGeometry.computeVertexNormals();
  const moonMaterial = new THREE.MeshStandardMaterial({color: 0x666666, roughness: 1, metalness: 0});
  moonMaterial.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
      float gray = dot(gl_FragColor.rgb, vec3(.333333));
      vec2 cell = floor(gl_FragCoord.xy / 1.6);
      float grain = fract(sin(dot(cell, vec2(12.9898,78.233))) * 43758.5453);
      gray = floor(gray * 9.0 + grain * .72) / 9.0;
      gl_FragColor.rgb = vec3(gray);`);
  };
  moonMaterial.customProgramCacheKey = () => 'hero-crater-halftone-v1';
  // Rotate its relief, while keeping the moon's projected framing stable.
  const moon = new THREE.Mesh(moonGeometry, moonMaterial); scene.add(moon);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x050505, .55));
  const moonLight = new THREE.DirectionalLight(0xffffff, 2.8); moonLight.position.set(-14, 12, 18); scene.add(moonLight);

  const uniforms = {
    uProgress: {value: 0}, uTime: {value: 0}, uMotion: {value: reduced.matches ? 0 : 1},
    uPixelRatio: {value: renderer.getPixelRatio()}, uWorldPerPixel: {value: 1}, uPointSize: {value: 1.35},
    uNameOffsetY: {value:0}, uRoleOffsetY: {value:0}, uBurstHeight: {value:1}
  };
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aRole; attribute vec3 aBurst; attribute float aSeed;
      uniform float uProgress, uTime, uMotion, uWorldPerPixel, uPixelRatio, uPointSize;
      uniform float uNameOffsetY, uRoleOffsetY, uBurstHeight;
      varying float vAlpha;
      void main() {
        float q = clamp(uProgress, 0.0, 1.0);
        float burst = pow(max(0.0, sin(q * 3.14159265)), 1.18);
        float shape = smoothstep(.18, .84, q);
        vec3 p = mix(position, aRole, shape);
        p.y += mix(uNameOffsetY, uRoleOffsetY, shape);
        p += aBurst * vec3(1.0,uBurstHeight,uBurstHeight) * burst;
        // Curved paths and actual depth survive reversal at every point in the transition.
        p.x += sin(aSeed * 23.0 + q * 5.0) * burst * 14.0;
        p.y += cos(aSeed * 29.0 + q * 5.0) * burst * 12.0;
        p.xy += vec2(sin(uTime * .42 + aSeed * 31.0), cos(uTime * .37 + aSeed * 27.0)) * .18 * uMotion * burst;
        // Depth is real, but settled glyphs project to their exact upright mask.
        // The text receives a restrained real 3D tilt; roles settle front-facing.
        float upright = (28.0 - p.z * uWorldPerPixel) / 28.0;
        p.xy *= mix(1.0, upright, 1.0 - burst);
        vec4 view = modelViewMatrix * vec4(p * uWorldPerPixel, 1.0);
        gl_Position = projectionMatrix * view;
        float depth = clamp(28.0 / -view.z, .45, 2.0);
        gl_PointSize = uPointSize * uPixelRatio * (.66 + aSeed * .62) * depth;
        vAlpha = (.54 + aSeed * .42) * (1.0 - burst * .15);
      }`,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float radius = max(abs(gl_PointCoord.x - .5), abs(gl_PointCoord.y - .5));
        float edge = 1.0 - smoothstep(.35, .5, radius);
        if (edge < .015) discard;
        gl_FragColor = vec4(vec3(.94), edge * vAlpha);
      }`
  });
  const starUniforms = {uTime: {value: 0}, uMotion: {value: reduced.matches ? 0 : 1}, uPixelRatio: {value: renderer.getPixelRatio()},uExpanded:{value:0}};
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: starUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSeed; uniform float uTime, uMotion, uPixelRatio, uExpanded; varying float vAlpha;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * .017 + aSeed * 19.0) * .12 * uMotion;
        p.y += cos(uTime * .012 + aSeed * 29.0) * .08 * uMotion;
        vec4 view = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * view;
        gl_PointSize = (.72 + pow(aSeed, 6.0) * 1.65) * uPixelRatio * clamp(30.0 / -view.z, .45, 1.25);
        vAlpha = (.20 + pow(aSeed, 2.5) * .66) * (1.0 + uExpanded * .18) * (.89 + .11 * sin(uTime * .3 * uMotion + aSeed * 47.0));
      }`,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float r = max(abs(gl_PointCoord.x - .5), abs(gl_PointCoord.y - .5));
        float edge = 1.0 - smoothstep(.2, .5, r);
        if (edge < .01) discard;
        gl_FragColor = vec4(vec3(.92), vAlpha * edge);
      }`
  });

  const photoUniforms = {uProgress: {value: 0}, uTime: {value: 0}, uWorldPerPixel: {value: 1}, uPixelRatio: {value: renderer.getPixelRatio()}, uMotion: {value: reduced.matches ? 0 : 1},uPhotoSize:{value:new THREE.Vector2(1,1)},uPhotoOffset:{value:new THREE.Vector2()}};
  const photoMaterial = new THREE.ShaderMaterial({
    uniforms: photoUniforms, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    vertexShader: `
      attribute vec3 aScatter, aColor; attribute float aAlpha, aSeed;
      uniform float uProgress, uTime, uWorldPerPixel, uPixelRatio, uMotion;
      uniform vec2 uPhotoSize, uPhotoOffset;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float gather = smoothstep(.04, .84, uProgress);
        vec3 p = vec3(position.xy * uPhotoSize + uPhotoOffset,position.z) + aScatter * (1.0 - gather);
        p.xy += vec2(sin(uTime * .4 + aSeed * 31.0), cos(uTime * .3 + aSeed * 21.0)) * .7 * (1.0 - gather) * uMotion;
        // Settled points and the DOM photo occupy exactly the same pixels.
        p.xy *= (28.0 - p.z * uWorldPerPixel) / 28.0;
        vec4 view = modelViewMatrix * vec4(p * uWorldPerPixel, 1.0);
        gl_Position = projectionMatrix * view;
        gl_PointSize = (1.20 + aSeed * .72) * uPixelRatio * clamp(28.0 / -view.z, .5, 1.8);
        float gray = dot(aColor, vec3(.2126,.7152,.0722));
        vColor = mix(vec3(gray * .83 + .17), aColor, smoothstep(.36, .94, uProgress));
        vAlpha = aAlpha * (.64 + aSeed * .33) * smoothstep(.04, .22, uProgress) * (1.0 - smoothstep(.72, .985, uProgress));
      }`,
    fragmentShader: `varying vec3 vColor; varying float vAlpha;
      void main() { float r = max(abs(gl_PointCoord.x-.5),abs(gl_PointCoord.y-.5));
        gl_FragColor = vec4(vColor, vAlpha * (1.0 - smoothstep(.32,.5,r))); }`
  });

  // One screen-aligned WebGL guide, sharing the scene's frame and pause lifecycle.
  // Its tail is many discrete white particles; no DOM animation or second canvas.
  const guideCount = 240, guideRandom = rng(92305);
  const guidePositions = new Float32Array(guideCount * 3), guideSeeds = new Float32Array(guideCount);
  for (let i=0;i<guideCount;i++) {
    guidePositions.set([i/Math.max(1,guideCount-1),(guideRandom()-.5)*2,(guideRandom()-.5)*2],i*3);
    guideSeeds[i]=guideRandom();
  }
  const guideGeometry = new THREE.BufferGeometry();
  guideGeometry.setAttribute('position',new THREE.BufferAttribute(guidePositions,3));
  guideGeometry.setAttribute('aSeed',new THREE.BufferAttribute(guideSeeds,1));
  const guideUniforms = {uTime:{value:0},uHeight:{value:420},uWorldPerPixel:{value:1},uPixelRatio:{value:renderer.getPixelRatio()},uMotion:{value:reduced.matches?0:1},uOpacity:{value:0}};
  const guideMaterial = new THREE.ShaderMaterial({
    uniforms:guideUniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,
    vertexShader:`
      attribute float aSeed; uniform float uTime,uHeight,uWorldPerPixel,uPixelRatio,uMotion,uOpacity;
      varying float vAlpha;
      void main(){
        float cycle=mod(uTime,3.5);
        float travel=clamp((cycle-.35)/1.8,0.0,1.0);
        float ease=travel*travel*(3.0-2.0*travel);
        float head=mix(uHeight-190.0,uHeight-60.0,ease);
        float tail=position.x;
        float span=mix(40.0,102.0,uMotion);
        float headY=mix(uHeight-120.0,head,uMotion);
        float spread=mix(.7,1.4+tail*3.6,uMotion);
        vec3 p=vec3(position.y*spread,(uHeight*.5-headY)+tail*span,position.z*2.0);
        p.x+=sin(aSeed*29.0+travel*4.0)*tail*1.1*uMotion;
        p.xy*=(28.0-p.z*uWorldPerPixel)/28.0;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p*uWorldPerPixel,1.0);
        gl_PointSize=(.8+pow(aSeed,4.0)*1.45+(1.0-tail)*.6)*uPixelRatio;
        float gate=smoothstep(0.0,.15,travel)*(1.0-smoothstep(.80,1.0,travel));
        vAlpha=uOpacity*mix(.30,gate,uMotion)*pow(1.0-tail,1.3)*(.28+aSeed*.72);
      }`,
    fragmentShader:`varying float vAlpha;void main(){float r=max(abs(gl_PointCoord.x-.5),abs(gl_PointCoord.y-.5));float edge=1.0-smoothstep(.24,.5,r);if(edge*vAlpha<.006)discard;gl_FragColor=vec4(vec3(1.0),edge*vAlpha);}`
  });
  const guide = new THREE.Points(guideGeometry,guideMaterial);guide.frustumCulled=false;guide.renderOrder=5;guide.visible=false;scene.add(guide);

  async function readPortrait() {
    if (!portrait?.src) return;
    await portrait.decode();
    hero.classList.add('hero-has-portrait');
    const sample = document.createElement('canvas');
    sample.width = portrait.naturalWidth; sample.height = portrait.naturalHeight;
    const ctx = sample.getContext('2d', {willReadFrequently: true}); ctx.drawImage(portrait, 0, 0);
    const rgba = ctx.getImageData(0, 0, sample.width, sample.height).data;
    photoSamples = [];
    for (let y = 0; y < sample.height; y += 4) for (let x = 0; x < sample.width; x += 4) {
      const p = (y * sample.width + x) * 4;
      if (rgba[p + 3] < 32) continue;
      photoSamples.push({x, y, color: [rgba[p] / 255, rgba[p + 1] / 255, rgba[p + 2] / 255], alpha: rgba[p + 3] / 255});
    }
    rebuildPortrait(); layoutPortrait(); requestFrame();
  }
  function layoutPortrait() {
    if (!photoSamples?.length || !width) return;
    const box = portrait.getBoundingClientRect(), parent = hero.getBoundingClientRect();
    const scale = Math.min(box.width / portrait.naturalWidth, box.height / portrait.naturalHeight);
    const pw = portrait.naturalWidth * scale, ph = portrait.naturalHeight * scale;
    const left = box.left - parent.left + (box.width - pw) / 2, top = box.top - parent.top + (box.height - ph) / 2;
    photoBounds = {left, top, width: pw, height: ph};
    photoUniforms.uPhotoSize.value.set(pw,ph);
    photoUniforms.uPhotoOffset.value.set(left+pw/2-width/2,height/2-top-ph/2);
    photoUniforms.uWorldPerPixel.value=worldHeight/height;
  }
  function rebuildPortrait() {
    if (!photoSamples?.length || !width) return;
    const wanted = Math.min(mobile ? 5200 : 10800, photoSamples.length);
    if(photoPoints && photoParticleCount===wanted)return;
    photoParticleCount = wanted;
    const pos = new Float32Array(photoParticleCount * 3), colors = new Float32Array(photoParticleCount * 3), scatter = new Float32Array(photoParticleCount * 3);
    const alpha = new Float32Array(photoParticleCount), seeds = new Float32Array(photoParticleCount), random = rng(70513);
    for (let i = 0; i < photoParticleCount; i++) {
      const p = photoSamples[Math.floor(i * photoSamples.length / photoParticleCount)], s = mobile ? .7 : 1;
      // Natural-image coordinates stay fixed while CSS bounds change with height.
      pos.set([p.x/portrait.naturalWidth-.5,.5-p.y/portrait.naturalHeight,0],i*3);
      scatter.set([(random()-.5)*35*s,(random()-.5)*35*s,(random()-.5)*110*s],i*3);
      colors.set(p.color, i*3); alpha[i] = p.alpha; seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    for (const [key, array, size] of [['position',pos,3],['aColor',colors,3],['aScatter',scatter,3],['aAlpha',alpha,1],['aSeed',seeds,1]]) geometry.setAttribute(key,new THREE.BufferAttribute(array,size));
    if (photoPoints) {scene.remove(photoPoints);photoPoints.geometry.dispose();}
    photoPoints = new THREE.Points(geometry,photoMaterial);photoPoints.frustumCulled=false;photoPoints.visible=false;scene.add(photoPoints);
    geometryBuilds.portrait++;
  }

  function sampleText(roles) {
    const scale = Math.min(2, 2200 / width);
    const mask = document.createElement('canvas');
    mask.width = Math.ceil(width * scale); mask.height = Math.ceil(maskHeight * scale);
    const ctx = mask.getContext('2d', {willReadFrequently: true});
    ctx.scale(scale, scale); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const family = fontFamily;
    ctx.imageSmoothingEnabled = false;
    if (!roles) {
      let size = Math.min(160, width * (mobile ? .175 : .11));
      ctx.font = `600 ${size}px ${family}`;
      size *= Math.min(1, (width * (mobile ? .90 : .80)) / ctx.measureText('Ruiyuan Bai').width);
      ctx.font = `600 ${size}px ${family}`;
      ctx.fillText('Ruiyuan Bai', Math.round(width * .5), Math.round(maskHeight * (mobile ? .44 : .48)));
    } else if (mobile) {
      const size = width < 350 ? 24 : 28, line = 44;
      ctx.font = `600 ${size}px ${family}`; ctx.textAlign = 'left';
      ['Researcher', 'Gamer', 'Developer', 'Dog Walker'].forEach((word, i) => ctx.fillText(word, Math.round(width * .08), Math.round(maskHeight * .39 + i * line)));
    } else {
      const size = Math.min(60, width * .042), line = size * 1.55;
      ctx.font = `600 ${size}px ${family}`; ctx.textAlign = 'left';
      [['Researcher', .23, -.5], ['Gamer', .50, -.5], ['Developer', .23, .5], ['Dog Walker', .50, .5]].forEach(([word, x, y]) => ctx.fillText(word, Math.round(width * x), Math.round(maskHeight * .45 + y * line)));
    }
    const data = ctx.getImageData(0, 0, mask.width, mask.height).data;
    const samples = []; const bounds = {left: width, top: maskHeight, right: 0, bottom: 0};
    for (let y = 0; y < mask.height; y += 2) for (let x = 0; x < mask.width; x += 2) {
      if (data[(y * mask.width + x) * 4 + 3] < 140) continue;
      const px = x / scale, py = y / scale;
      samples.push([px - width / 2, maskHeight / 2 - py]);
      bounds.left = Math.min(bounds.left, px); bounds.right = Math.max(bounds.right, px);
      bounds.top = Math.min(bounds.top, py); bounds.bottom = Math.max(bounds.bottom, py);
    }
    return {samples, bounds};
  }

  function rebuild() {
    const name = sampleText(false), roles = sampleText(true);
    if (!name.samples.length || !roles.samples.length) throw new Error('Particle title masks are empty.');
    nameMaskBounds = name.bounds; roleMaskBounds = roles.bounds;
    particleCount = mobile ? 11200 : 22800;
    const random = rng(72391), positions = new Float32Array(particleCount * 3), rolePositions = new Float32Array(particleCount * 3);
    const burst = new Float32Array(particleCount * 3), seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const point = name.samples[Math.floor(i * name.samples.length / particleCount)];
      const role = roles.samples[Math.floor(random() * roles.samples.length)];
      positions.set([point[0] + (random() - .5) * .18, point[1] + (random() - .5) * .18, (random() - .5) * (mobile ? 18 : 32)], i * 3);
      rolePositions.set([role[0] + (random() - .5) * .18, role[1] + (random() - .5) * .18, (random() - .5) * (mobile ? 7 : 13)], i * 3);
      const angle = random() * Math.PI * 2, z = random() * 2 - 1, radial = Math.sqrt(1 - z * z), radius = .32 + random() * .68;
      burst.set([Math.cos(angle) * radial * radius * width * .30, Math.sin(angle) * radial * radius * maskHeight * .58, z * radius * maskHeight * .62], i * 3);
      seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRole', new THREE.BufferAttribute(rolePositions, 3));
    geometry.setAttribute('aBurst', new THREE.BufferAttribute(burst, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    if (points) { scene.remove(points); points.geometry.dispose(); }
    points = new THREE.Points(geometry, particleMaterial); points.frustumCulled = false; scene.add(points);
    geometryBuilds.text++;
  }

  function buildStars() {
    if(stars)return;
    // The shell is independent of every viewport dimension and never rebuilt on scroll.
    starCount=14000;
    const random=rng(55213);
    const sky = new Float32Array(starCount * 3), starSeeds = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      // A full 3D shell keeps the sky populated across the entire drag range.
      const radius = 38 + random() * 57, azimuth = random() * Math.PI * 2, z = random() * 2 - 1;
      const ring = Math.sqrt(1 - z * z);
      sky.set([Math.cos(azimuth) * ring * radius, Math.sin(azimuth) * ring * radius, z * radius], i * 3);
      starSeeds[i] = random();
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(sky, 3));
    starGeometry.setAttribute('aSeed', new THREE.BufferAttribute(starSeeds, 1));
    stars = new THREE.Points(starGeometry, starMaterial); stars.frustumCulled = false; space.add(stars);
    geometryBuilds.stars++;
  }

  function resize() {
    resizePending=false;
    const bounds = hero.getBoundingClientRect();
    // Full-page capture and hidden/reinserted layouts can report a 1px viewport.
    // Keep the last valid geometry until there is enough space to sample glyphs.
    if (bounds.width < 32 || bounds.height < 32) return;
    const nextWidth = Math.max(1, Math.round(bounds.width)), nextHeight = Math.max(1, Math.round(bounds.height));
    const widthChanged=nextWidth!==width, sizeChanged=widthChanged||nextHeight!==height;
    width = nextWidth; height = nextHeight; mobile = width < 700;
    maskHeight=mobile?520:420;
    if(sizeChanged){
      camera.aspect = width / height; camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);resizeCount++;
    }
    expandedHeight=introMetrics?.expandedHeight||Math.max(innerHeight,height);
    compactHeight=introMetrics?.compactHeight||Math.min(expandedHeight,maskHeight);
    const declaredProgress=Number.parseFloat(hero.dataset.introProgress);
    introProgress=Number.isFinite(declaredProgress)?Math.max(0,Math.min(1,declaredProgress)):1;
    introActive=hero.dataset.introActive==='true';
    const expansion=expandedHeight>compactHeight?THREE.MathUtils.clamp((height-compactHeight)/(expandedHeight-compactHeight),0,1):0;
    uniforms.uWorldPerPixel.value = worldHeight / height;
    uniforms.uPointSize.value = mobile ? 1.16 : 1.40;
    uniforms.uNameOffsetY.value=(height-maskHeight)*(.5-(mobile?.44:.48));
    uniforms.uRoleOffsetY.value=(height-maskHeight)*(.5-(mobile?.39:.45));
    uniforms.uBurstHeight.value=height/maskHeight;
    if(widthChanged||!points)rebuild();
    buildStars();
    const offsetBounds=(source,anchor)=>source?{...source,top:source.top+(height-maskHeight)*anchor,bottom:source.bottom+(height-maskHeight)*anchor}:null;
    nameBounds=offsetBounds(nameMaskBounds,mobile?.44:.48);
    roleBounds=offsetBounds(roleMaskBounds,mobile?.39:.45);
    starUniforms.uExpanded.value=expansion;
    const moonDepth = 36, units = worldHeight / height * moonDepth / 28;
    const compactRadius = mobile ? Math.min(94,width*.24) : Math.min(128,compactHeight*.31);
    const expandedRadius=mobile?Math.min(width*.28,expandedHeight*.17):Math.min(210,width*.15,expandedHeight*.22);
    const radius=THREE.MathUtils.lerp(compactRadius,expandedRadius,expansion);
    const moonX=THREE.MathUtils.lerp(mobile?.24:.11,mobile?.20:.13,expansion);
    const moonY=THREE.MathUtils.lerp(.87,mobile?.80:.79,expansion);
    moon.position.set((width*moonX-width/2)*units,(height/2-height*moonY)*units,-8);
    moon.scale.setScalar(radius*units/3.25); moon.visible=true;
    guideUniforms.uHeight.value=height;guideUniforms.uWorldPerPixel.value=worldHeight/height;
    guideUniforms.uOpacity.value=introActive?1-smooth(.03,.35,introProgress):0;
    guide.visible=guideUniforms.uOpacity.value>.001;
    if(widthChanged||!photoPoints)rebuildPortrait();
    if(sizeChanged||!photoBounds)layoutPortrait();
    requestFrame();
  }

  function queueResize() { resizePending=true;requestFrame(); }
  hero.addEventListener('portfolio:hero-intro',event=>{
    if(event.detail)introMetrics=event.detail;
    queueResize();
  });

  function phase() {
    if (progress < .001) return 'name';
    if (progress > .999) return 'roles';
    return target ? (progress < .43 ? 'exploding' : 'composing-roles') : (progress > .57 ? 'exploding-back' : 'composing-name');
  }
  function notifyState() {
    const currentPhase = phase();
    hero.dataset.heroPhase = currentPhase;
    if (lastPhase === currentPhase && lastTarget === target) return;
    lastPhase = currentPhase; lastTarget = target;
    hero.dispatchEvent(new CustomEvent('name-hero-state', {bubbles: true, detail: {target: target ? 'roles' : 'name', progress, phase: currentPhase}}));
  }
  function syncTarget() {
    target = !dragging && (hover || focused || pinned) ? 1 : 0;
    hero.dataset.heroTarget = target ? 'roles' : 'name';
    interaction.setAttribute('aria-pressed', String(!!target));
    if (reduced.matches) { progress = target; velocity = 0; }
    notifyState(); requestFrame();
  }
  function canRender() { return ready && visible && pageActive && !document.hidden && !contextLost; }
  function requestFrame() {
    if (!canRender() || raf) return;
    raf = requestAnimationFrame(render);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; }
  function render(now) {
    raf = 0;
    if (!canRender()) { lastTime = 0; return; }
    if(resizePending)resize();
    const dt = lastTime ? Math.min(1, (now - lastTime) / 1000) : 0; lastTime = now;
    if (reduced.matches) { progress = target; velocity = 0; }
    else {
      // Analytic critically damped spring: retains velocity for a continuous mid-flight reverse.
      const omega = 8, offset = progress - target, temp = (velocity + omega * offset) * dt, decay = Math.exp(-omega * dt);
      progress = Math.max(0, Math.min(1, target + (offset + temp) * decay));
      velocity = (velocity - omega * temp) * decay;
      if (Math.abs(progress - target) < .0003 && Math.abs(velocity) < .002) { progress = target; velocity = 0; }
      motionTime += Math.min(dt, .08);
    }
    const spaceEase = reduced.matches ? 1 : 1 - Math.exp(-dt * (dragging ? 16 : 7));
    space.rotation.y += (orbit.yaw + (reduced.matches ? 0 : pointer.x * .10) - space.rotation.y) * spaceEase;
    space.rotation.x += (orbit.pitch + (reduced.matches ? 0 : pointer.y * .065) - space.rotation.x) * spaceEase;
    moon.rotation.y = space.rotation.y * .95;
    moon.rotation.x = space.rotation.x * .9;
    const nameTilt = 1 - smooth(.18, .80, progress);
    if (points) {
      points.rotation.y = THREE.MathUtils.clamp(space.rotation.y * .36, -.38, .38) * nameTilt;
      points.rotation.x = THREE.MathUtils.clamp(space.rotation.x * .42, -.21, .21) * nameTilt;
    }
    uniforms.uProgress.value = progress; uniforms.uTime.value = motionTime;
    uniforms.uMotion.value = starUniforms.uMotion.value = reduced.matches ? 0 : 1;
    starUniforms.uTime.value = motionTime;
    guideUniforms.uTime.value=motionTime;
    guideUniforms.uMotion.value=reduced.matches?0:1;
    photoUniforms.uProgress.value = progress; photoUniforms.uTime.value = motionTime;
    photoUniforms.uMotion.value = reduced.matches ? 0 : 1;
    const portraitProgress = smooth(.72, .985, progress);
    hero.style.setProperty('--hero-portrait-opacity', portraitProgress.toFixed(4));
    if (photoPoints) photoPoints.visible = progress > .04 && progress < .985;
    renderer.render(scene, camera); frame++; notifyState();
    if (!reduced.matches) requestFrame();
  }

  function inRevealRegion(event) {
    if (!nameBounds) return false;
    const box = hero.getBoundingClientRect(), x = event.clientX - box.left, y = event.clientY - box.top;
    const contains = (bounds, padding = 26) => bounds && x >= bounds.left - padding && x <= bounds.right + padding && y >= bounds.top - padding && y <= bounds.bottom + padding;
    if (contains(nameBounds, mobile ? 22 : 32)) return true;
    if (progress > .08 || hover || pinned) {
      if (contains(roleBounds, 32)) return true;
      if (photoBounds && contains({left:photoBounds.left,top:photoBounds.top,right:photoBounds.left+photoBounds.width,bottom:photoBounds.top+photoBounds.height},24)) return true;
    }
    return false;
  }
  interaction.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch' && !dragging && !suppressHover) { hover = inRevealRegion(event); syncTarget(); }
  });
  interaction.addEventListener('pointerleave', () => {
    hover = false; pointer = {x: 0, y: 0};
    if (!dragging) suppressHover = false;
    syncTarget();
  });
  interaction.addEventListener('pointerdown', event => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    gesture = {id: event.pointerId, type: event.pointerType, x: event.clientX, y: event.clientY, yaw: orbit.yaw, pitch: orbit.pitch, intent: 'pending'};
  });
  interaction.addEventListener('pointermove', event => {
    if (gesture?.id === event.pointerId) {
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (gesture.intent === 'pending' && Math.hypot(dx, dy) > 8) {
        if (gesture.type === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
          // Leave vertical gestures to native page scrolling; they are never taps.
          gesture.intent = 'scroll'; hover = false; focused = false; pinned = false; syncTarget();
        } else if (gesture.type !== 'touch' || Math.abs(dx) > Math.abs(dy) * 1.15) {
          gesture.intent = 'rotate'; dragging = true; suppressHover = true;
          hover = false; focused = false; pinned = false;
          interaction.setPointerCapture(event.pointerId);
          hero.dataset.dragging = 'true'; syncTarget();
        }
      }
      if (gesture.intent === 'rotate') {
        orbit.yaw = THREE.MathUtils.clamp(gesture.yaw + dx / width * Math.PI * 1.5, -orbitLimit.yaw, orbitLimit.yaw);
        orbit.pitch = THREE.MathUtils.clamp(gesture.pitch + dy / height * 1.25, -orbitLimit.pitch, orbitLimit.pitch);
        pointer = {x: 0, y: 0}; requestFrame();
        return;
      }
    }
    if (event.pointerType !== 'touch' && !reduced.matches && !dragging) {
      const bounds = interaction.getBoundingClientRect();
      pointer = {x: (event.clientX - bounds.left) / bounds.width * 2 - 1, y: -((event.clientY - bounds.top) / bounds.height * 2 - 1)};
      requestFrame();
    }
    if (event.pointerType !== 'touch' && !dragging && !suppressHover) {
      const nextHover = inRevealRegion(event);
      if (nextHover !== hover) { hover = nextHover; syncTarget(); }
    }
  });
  function finishGesture(event, cancelled = false) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const finished = gesture; gesture = null;
    dragging = false; hero.dataset.dragging = 'false';
    if (finished.intent === 'rotate') {
      hover = false; focused = false; pinned = false; suppressHover = true;
    } else if (!cancelled && finished.intent === 'pending' && finished.type === 'touch' && inRevealRegion(event)) {
      pinned = !pinned; focused = false; hover = false;
    }
    if (interaction.hasPointerCapture(event.pointerId)) interaction.releasePointerCapture(event.pointerId);
    syncTarget();
  }
  interaction.addEventListener('pointerup', event => finishGesture(event));
  interaction.addEventListener('pointercancel', event => finishGesture(event, true));
  interaction.addEventListener('lostpointercapture', event => finishGesture(event, true));
  interaction.addEventListener('focusin', event => {
    // Pointer taps use the toggle above; keyboard focus always reveals all four roles.
    if (!dragging && event.target.matches(':focus-visible')) { focused = true; syncTarget(); }
  });
  interaction.addEventListener('focusout', event => {
    if (!interaction.contains(event.relatedTarget)) { focused = false; pinned = false; syncTarget(); }
  });
  interaction.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); hover = false; focused = false; pinned = false; syncTarget(); }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) {
      event.preventDefault(); hover = false; focused = false; pinned = false; suppressHover = true;
      if (event.key === 'Home') { orbit.yaw = 0; orbit.pitch = 0; }
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') orbit.yaw = THREE.MathUtils.clamp(orbit.yaw + (event.key === 'ArrowLeft' ? -.14 : .14), -orbitLimit.yaw, orbitLimit.yaw);
      else orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + (event.key === 'ArrowUp' ? -.10 : .10), -orbitLimit.pitch, orbitLimit.pitch);
      pointer = {x: 0, y: 0}; syncTarget();
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target === interaction) {
      event.preventDefault(); pinned = !target; hover = false; focused = false; syncTarget();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!interaction.contains(event.target) && pinned) { pinned = false; syncTarget(); }
  }, {passive: true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else requestFrame(); });
  window.addEventListener('pagehide', () => { pageActive = false; stop(); });
  window.addEventListener('pageshow', () => { pageActive = true; lastTime = 0; requestFrame(); });
  reduced.addEventListener('change', () => { stop(); if (reduced.matches) { progress = target; velocity = 0; } requestFrame(); });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; hero.dataset.heroReady = 'false'; stop(); });
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; hero.dataset.heroReady = 'true'; requestFrame(); });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting !== false;
    if (visible) requestFrame(); else stop();
  }, {threshold: 0});
  observer.observe(hero);
  new ResizeObserver(queueResize).observe(hero);
  resize(); ready = true;
  readPortrait().catch(error => console.warn('Portrait particles unavailable; the original photo remains available on hover.',error));
  hero.dataset.heroReady = 'true'; hero.dataset.heroTarget = 'name'; hero.dataset.heroPhase = 'name';
  // Name starts completely formed. No intro timer can delay first-paint legibility.
  render(performance.now());
  const snapshot = () => Object.freeze({
    ready, frame, renderer: 'three-webgl', particleCount, starCount,
    viewport: {width, height, mobile}, target: target ? 'roles' : 'name', progress, velocity, phase: phase(),
    burst: Math.pow(Math.max(0, Math.sin(progress * Math.PI)), 1.18),
    roles: ['Researcher', 'Gamer', 'Developer', 'Dog Walker'],
    name: 'Ruiyuan Bai', nameBounds: {...nameBounds}, roleBounds: {...roleBounds},
    positionDimensions: 3, depthPixels: mobile ? 18 : 32, font: fontFamily, fontWeight: 600, textFacing: progress > .80 ? 'front-facing-roles' : 'restrained-3d-name', textRotation: points ? [points.rotation.x,points.rotation.y,points.rotation.z] : [0,0,0],
    moon: {visible:moon.visible,geometry:moonGeometry.type,vertices:moonPosition.count,craters:craters.length,position:moon.position.toArray(),rotation:[moon.rotation.x,moon.rotation.y,moon.rotation.z],scale:moon.scale.x},
    spaceRotation: [space.rotation.x,space.rotation.y,space.rotation.z],
    orbit: {yaw:orbit.yaw,pitch:orbit.pitch,yawDegrees:THREE.MathUtils.radToDeg(orbit.yaw),pitchDegrees:THREE.MathUtils.radToDeg(orbit.pitch),limitsDegrees:{yaw:55,pitch:25},dragging,intent:gesture?.intent||null,suppressHover},
    reducedMotion: reduced.matches, visible, documentHidden: document.hidden, running: !!raf,
    paused: !canRender() || reduced.matches, motionTime, renderCalls: renderer.info.render.calls,
    portraitVisible: hero.classList.contains('hero-has-portrait') && progress > .72,
    portraitParticles: {count:photoParticleCount,visible:!!photoPoints?.visible,source:portrait?.getAttribute('src')||null,bounds:photoBounds?{...photoBounds}:null,gather:smooth(.04,.84,progress),photoOpacity:smooth(.72,.985,progress)},
    geometryBuilds:{...geometryBuilds},resizeCount,
    intro:{progress:introProgress,active:introActive,expandedHeight,compactHeight,maskHeight,pendingResize:resizePending},
    guide:{visible:guide.visible,points:guideCount,mode:reduced.matches?'static-dotted-cue':'downward-particle-meteor',opacity:guideUniforms.uOpacity.value,cycleSeconds:3.5,headX:width/2,headY:reduced.matches?height-120:THREE.MathUtils.lerp(height-190,height-60,smooth(0,1,THREE.MathUtils.clamp(((motionTime%3.5)-.35)/1.8,0,1)))},
    geometryCount:renderer.info.memory.geometries
  });
  Object.defineProperty(window, '__portfolioNameHero', {value: Object.freeze({snapshot}), configurable: true, writable: false});
  hero.dispatchEvent(new CustomEvent('name-hero-ready', {bubbles: true, detail: snapshot()}));
}
