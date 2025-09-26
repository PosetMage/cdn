// LoadYamlHtmlAndConvert.js
// Depends on: js-yaml and convertYamlToHtml (imported explicitly)

import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.mjs";
import { convertYamlToHtml } from "https://posetmage.com/cdn/js/convertYamlToHtml.js";

/**
 * Fetch a text file with optional cache-busting
 */
async function fetchText(url, { cacheBust = false, ...fetchOpts } = {}) {
  const finalUrl = cacheBust ? appendCacheBust(url) : url;
  const res = await fetch(finalUrl, {
    credentials: "omit",
    mode: "cors",
    ...fetchOpts,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status} ${res.statusText})`);
  }
  return res.text();
}

function appendCacheBust(url) {
  const u = new URL(url, location.href);
  u.searchParams.set("_", Date.now().toString());
  return u.toString();
}

/**
 * Load YAML and HTML, merge, return final HTML
 * @param {string} yamlPath
 * @param {string} htmlPath
 * @param {{cacheBust?: boolean, yamlFetch?: object, htmlFetch?: object}} [opts]
 * @returns {Promise<string>}
 */
export async function LoadYamlHtmlAndConvert(yamlPath, htmlPath, opts = {}) {
  const [yml, html] = await Promise.all([
    fetchText(yamlPath, { cacheBust: !!opts.cacheBust, ...(opts.yamlFetch || {}) }),
    fetchText(htmlPath, { cacheBust: !!opts.cacheBust, ...(opts.htmlFetch || {}) }),
  ]);

  return convertYamlToHtml(yml, html);
}
