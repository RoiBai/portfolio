// Original published Unity build, mirrored unchanged because itch blocks CORS.
// Keep Unity’s audio clock running, but route every destination connection
// through a zero-gain node before the game creates its first AudioContext.
const connect = AudioNode.prototype.connect;
const silencers = new WeakMap();
AudioNode.prototype.connect = function(destination, ...ports) {
  if (destination === this.context.destination) {
    let silencer = silencers.get(this.context);
    if (!silencer) {
      silencer = this.context.createGain();
      silencer.gain.value = 0;
      connect.call(silencer, destination);
      silencers.set(this.context, silencer);
    }
    return connect.call(this, silencer, ...ports);
  }
  return connect.call(this, destination, ...ports);
};
const mediaPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function(...args) {
  this.defaultMuted = true;
  this.muted = true;
  this.volume = 0;
  return mediaPlay.apply(this, args);
};
document.addEventListener('volumechange', event => {
  if (event.target instanceof HTMLMediaElement) {
    if (!event.target.muted) event.target.muted = true;
    if (event.target.volume !== 0) event.target.volume = 0;
  }
}, true);
const root = document.documentElement;
const loading = document.getElementById('loading');
const copy = document.getElementById('loading-copy');
const progress = document.getElementById('progress');
const canvas = document.getElementById('unity-canvas');
root.dataset.state = 'loading';
root.dataset.audio = 'muted';
document.getElementById('retry').addEventListener('click', () => location.reload());
function fail(error) {
  root.dataset.state = 'error';
  loading.hidden = false;
  progress.hidden = true;
  copy.textContent = 'The game could not finish loading.';
  document.getElementById('actions').hidden = false;
  console.error('Ambulance Rush player:', error);
}
function loadLoader() {
  return new Promise((resolve,reject) => {
    const script = document.createElement('script');
    script.src = '/assets/ambulance-game/Build/ambulance.loader.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('The game loader could not be downloaded.'));
    document.head.append(script);
  });
}
async function start() {
  await loadLoader();
  await window.createUnityInstance(canvas, {
    dataUrl: '/assets/ambulance-game/Build/ambulance.data',
    frameworkUrl: '/assets/ambulance-game/Build/ambulance.framework.js',
    codeUrl: '/assets/ambulance-game/Build/ambulance.wasm',
    streamingAssetsUrl: new URL('./StreamingAssets', import.meta.url).href,
    companyName:'roi', productName:'IVE_ambulance_game', productVersion:'3',
    devicePixelRatio:Math.min(window.devicePixelRatio || 1,2),
    showBanner:(message,type) => { if(type === 'error') fail(new Error(message)); else console.warn(message); }
  }, value => { progress.value = value; });
  if (root.dataset.state === 'error') return;
  root.dataset.state = 'ready';
  loading.hidden = true;
}
start().catch(fail);
