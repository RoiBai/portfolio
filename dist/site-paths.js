// The same source runs at localhost, a custom domain, or GitHub Pages /portfolio/.
export const SITE_BASE = (document.documentElement.dataset.basePath || '').replace(/\/$/, '');
export const siteURL = path => SITE_BASE + (path.startsWith('/') ? path : '/' + path);
export function sitePath(pathname = location.pathname) {
  const relative = SITE_BASE && (pathname === SITE_BASE || pathname.startsWith(SITE_BASE + '/'))
    ? pathname.slice(SITE_BASE.length) : pathname;
  return relative.replace(/\/$/, '') || '/';
}
