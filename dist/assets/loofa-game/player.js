// Load the published 5.10.2 build unchanged. Its asset server permits CORS.
// Language is changed through the game's own public Settings methods; no
// PlayerPrefs bytes or Unity files are rewritten by this wrapper.
const original = 'https://lufasoup.ruiyuanbai.com/';
const build = `${original}Build/5.10.2`;
const initializedKey = 'portfolio.loofasoup.language-initialized.v1';
const root = document.documentElement;
const canvas = document.getElementById('unity-canvas');
const loading = document.getElementById('loading');
const copy = document.getElementById('loading-copy');
const progress = document.getElementById('progress');
const waiters = new Set();
let game;
let failed = false;

root.dataset.state = 'loading';
document.getElementById('retry').addEventListener('click', () => location.reload());

// This build's _JS_Log_Dump explicitly calls window.dump for Unity logs.
// GameAudioManager.OnSceneLoaded reports the actual scene after it loads.
// Observe that event so SendMessage only targets objects in a loaded scene.
const previousDump = window.dump;
window.dump = line => {
  if (typeof previousDump === 'function') previousDump.call(window, line);
  const match = String(line).match(/\[AudioDebug\] OnSceneLoaded: scene=([^,\r\n]+)/);
  if (!match) return;
  root.dataset.scene = match[1];
  for (const waiter of [...waiters]) {
    if (waiter.matches(match[1])) waiter.resolve(match[1]);
  }
};

const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

function changeScene(object, method, matches) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      waiters.delete(waiter);
      reject(new Error(`The game did not finish ${method}.`));
    }, 15000);
    const waiter = {
      matches,
      resolve: scene => {
        clearTimeout(timer);
        waiters.delete(waiter);
        // Allow the scene's Start callbacks to finish before the next command.
        nextFrame().then(() => resolve(scene));
      },
    };
    waiters.add(waiter);
    try { game.SendMessage(object, method); }
    catch (error) {
      clearTimeout(timer);
      waiters.delete(waiter);
      reject(error);
    }
  });
}

// Keep the first-run marker separate from native PlayerPrefs. IndexedDB is a
// fallback for browsers that block localStorage but still allow the game's save.
function fallbackMarker(write = false) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('portfolio-loofasoup', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('settings');
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Browser storage is unavailable.'));
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('settings', write ? 'readwrite' : 'readonly');
      const store = transaction.objectStore('settings');
      const entry = write ? store.put(true, initializedKey) : store.get(initializedKey);
      transaction.oncomplete = () => { db.close(); resolve(write || entry.result === true); };
      transaction.onerror = () => { db.close(); reject(transaction.error); };
    };
  });
}

async function hasInitialized() {
  try { if (localStorage.getItem(initializedKey) === '1') return true; }
  catch { /* Try the same storage mechanism used by the game. */ }
  try { return await fallbackMarker(); }
  catch { return false; }
}

async function rememberInitialization() {
  try { localStorage.setItem(initializedKey, '1'); return; }
  catch { /* Try the same storage mechanism used by the game. */ }
  try { await fallbackMarker(true); }
  catch { /* Without browser storage the game is still playable for this visit. */ }
}

function fail(error) {
  if (failed) return;
  failed = true;
  root.dataset.state = 'error';
  loading.hidden = false;
  copy.textContent = 'The game could not finish loading.';
  progress.hidden = true;
  document.getElementById('help').hidden = false;
  document.getElementById('actions').hidden = false;
  console.error('Taste of Connection player:', error);
}

function loadLoader() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${build}.loader.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error('The game loader could not be downloaded.'));
    document.head.append(script);
  });
}

async function start() {
  await loadLoader();
  game = await window.createUnityInstance(canvas, {
    dataUrl: `${build}.data.gz?v=bf2a9df46156`,
    frameworkUrl: `${build}.framework.js.gz`,
    codeUrl: `${build}.wasm.gz`,
    streamingAssetsUrl: `${original}StreamingAssets`,
    companyName: 'DefaultCompany',
    productName: 'Loofa',
    productVersion: '0.1',
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    showBanner: (message, type) => {
      if (type === 'error') fail(new Error(message));
      else console.warn(message);
    },
  }, value => { progress.value = value; });
  if (failed) return;
  copy.textContent = 'Opening the game…';
  await nextFrame();

  if (await hasInitialized()) {
    // The build always boots into FirstPage_CN. Reload the menu through its
    // SceneLoader so the saved native language also applies to the first screen.
    await changeScene('SceneManager', 'LoadFirstPage', scene => /^FirstPage_(CN|EN)$/.test(scene));
  } else {
    await changeScene('SceneManager', 'LoadSetting', scene => scene === 'Setting');
    game.SendMessage('SettingPageController', 'SetEnglish');
    await changeScene('SettingPageController', 'OnClickBack', scene => scene === 'FirstPage_EN');
    // Never mark initialization complete until the English menu is confirmed.
    await rememberInitialization();
  }

  if (failed) return;
  root.dataset.state = 'ready';
  loading.hidden = true;
}

start().catch(fail);
