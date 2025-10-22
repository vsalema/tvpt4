/*
 * json-playlist.js — prise en charge des playlists JSON & méta‑listes
 *
 * ➤ Intégration : placez ce fichier APRÈS `scriptiptv.js` dans la page.
 *    <script src="https://vsalema.github.io/tvpt4/js/scriptiptv.js" defer></script>
 *    <script src="/js/json-playlist.js" defer></script>
 *
 * ➤ Utilisation :
 *   - Option .json dans vos <select> OU coller une URL .json dans "Lire une URL".
 *   - Accepte : {meta,categories,channels}, tableau direct de chaînes, ou
 *     méta‑listes { playlists: [{ name, url }...] } (chaque URL .m3u sera chargée via loadSource).
 */

(() => {
  'use strict';

  // ===== Helpers & éléments =====
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const el = {
    player: document.getElementById('player'),
    nowbar: document.getElementById('nowbar'),
    channelLogo: document.getElementById('channelLogo'),
    nowPlaying: document.getElementById('nowPlaying'),
    nowUrl: document.getElementById('nowUrl'),
    zapTitle: document.getElementById('zapTitle'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),

    // Catégories
    cat: document.getElementById('categorySelect'),
    cat2: document.getElementById('categorySelect2'),
    inlineCat: document.getElementById('inlineCategorySelect'),

    // Listes
    list: document.getElementById('channelList'),
    list2: document.getElementById('channelList2'),
    inlineList: document.getElementById('inlineChannelList'),

    // Recherches
    search: document.getElementById('search'),
    search2: document.getElementById('search2'),
    inlineSearch: document.getElementById('inlineSearch'),

    // Sources + boutons
    sourceSel: document.getElementById('sourceSelect'),
    sourceSel2: document.getElementById('sourceSelect2'),
    btnLoadM3U: document.getElementById('btnLoadM3U'),
    btnLoadM3U2: document.getElementById('btnLoadM3U2'),

    inputUrl: document.getElementById('inputUrl'),
    btnPlay: document.getElementById('btnPlay'),
  };

  let vjs = null;
  try { vjs = window.videojs ? window.videojs('player') : null; } catch (e) {}

  const state = {
    meta: {},
    channels: [],
    categories: [],
    filtered: [],
    index: -1,
  };

  const isJsonUrl = (url) => /\.json(\?|#|$)/i.test(url || '');

  // ===== Détection de type =====
  function guessType(url) {
    if (!url) return '';
    // Playlist M3U (à charger via loadSource, pas jouable directement)
    if (/\.m3u(\?|#|$)/i.test(url) && !/\.m3u8(\?|#|$)/i.test(url)) return 'm3u-list';
    if (/^yt:|youtube\.com|youtu\.be/i.test(url)) return 'youtube';
    if (/\.m3u8(\?|#|$)/i.test(url)) return 'hls';
    if (/\.mpd(\?|#|$)/i.test(url)) return 'dash';
    if (/\.mp4(\?|#|$)/i.test(url)) return 'mp4';
    if (/\.mp3(\?|#|$)/i.test(url)) return 'mp3';
    return '';
  }

  function srcForPlayer(ch) {
    if (ch.type === 'm3u-list') return null; // non jouable
    if (ch.type === 'youtube') return { src: ch.url.replace(/^yt:/i, ''), type: 'video/youtube' };
    if (ch.type === 'dash') return { src: ch.url, type: 'application/dash+xml' };
    if (ch.type === 'hls') return { src: ch.url, type: 'application/x-mpegURL' };
    if (ch.type === 'mp4') return { src: ch.url, type: 'video/mp4' };
    if (ch.type === 'mp3') return { src: ch.url, type: 'audio/mpeg' };
    return { src: ch.url };
  }

  // ===== Catégories =====
  function buildCategories(channels, catsList) {
    const byLabel = new Map();
    (Array.isArray(catsList) ? catsList : []).forEach((c) => {
      const id = c.id || (c.label || '').toLowerCase().trim();
      if (id) byLabel.set(id, { id, label: c.label || id });
    });
    channels.forEach((c) => {
      const id = (c.category || 'Autres').toString();
      const key = id.toLowerCase();
      if (!byLabel.has(key)) byLabel.set(key, { id: key, label: c.category || 'Autres' });
    });
    return [
      { id: '*', label: 'Toutes' },
      ...Array.from(byLabel.values()).sort((a, b) => a.label.localeCompare(b.label, 'fr')),
    ];
  }

  // ===== Parsing JSON =====
  function parseJsonPlaylist(obj) {
    // 1) Natif { meta, categories, channels } ou tableau direct
    const meta0 = obj?.meta || {};
    const cats0 = Array.isArray(obj?.categories) ? obj.categories : [];
    let channels0 = [];
    if (Array.isArray(obj?.channels)) channels0 = obj.channels;
    else if (Array.isArray(obj)) channels0 = obj; // variante courte

    const toChannel = (c, i) => ({
      id: c.id || `ch_${i}`,
      name: c.name || c.title || c.channel || c.label,
      url: c.url || c.src || c.link || c.stream || c.stream_url || c.play || c.playurl,
      logo: c.logo || c.icon || c.image || c.poster || '',
      category: c.category || c.group || c.cat || c.genre || c.type || 'Autres',
      group: c.group || c.country || '',
      type: c.type || guessType(c.url || c.src || c.link || c.stream || c.stream_url || c.play || c.playurl),
      headers: c.headers || {},
      _raw: c,
    });

    if (channels0.length) {
      const channels = channels0
        .filter((c) => c && (c.url || c.src || c.link || c.stream || c.stream_url || c.play || c.playurl) && (c.name || c.title || c.channel || c.label))
        .map(toChannel);
      const categories = buildCategories(channels, cats0);
      return { meta: meta0, channels, categories };
    }

    // 2) Méta‑listes & variantes courantes
    const buckets = [];

    // a) { playlists: [ { name/title, url/link, logo, category } ] }
    if (Array.isArray(obj?.playlists)) {
      buckets.push({ key: 'playlists', items: obj.playlists });
    }

    // b) Objet avec tableaux par clé (catégories implicites)
    if (obj && !Array.isArray(obj) && typeof obj === 'object') {
      const objectArrays = Object.entries(obj).filter(([k, v]) => Array.isArray(v));
      if (objectArrays.length && !obj.meta && !obj.channels && !obj.categories && !obj.playlists) {
        objectArrays.forEach(([k, arr]) => {
          arr.forEach((item) => buckets.push({ key: k, items: [{ ...item, category: item.category || k }] }));
        });
      }
    }

    // c) { groups/categories: [{ label/name, items|channels: [...] }] }
    const groups = obj?.groups || obj?.Categories || obj?.categories;
    if (Array.isArray(groups)) {
      groups.forEach((g) => {
        const label = g.label || g.name || g.title || 'Autres';
        const items = Array.isArray(g.items) ? g.items : Array.isArray(g.channels) ? g.channels : [];
        if (items.length) buckets.push({ key: label, items: items.map((it) => ({ ...it, category: it.category || label })) });
      });
    }

    // d) { items | list | streams | lives }
    const generic = obj?.items || obj?.list || obj?.streams || obj?.lives;
    if (Array.isArray(generic)) buckets.push({ key: 'Autres', items: generic });

    // Normalisation
    const flat = buckets.flatMap((b) => (b.items || []).map((c) => ({ ...c, category: c.category || b.key })));
    const channels = flat
      .filter((c) => (c.url || c.src || c.link || c.stream || c.stream_url || c.play || c.playurl) && (c.name || c.title || c.channel || c.label))
      .map(toChannel);

    const meta = obj?.meta || {};
    const categories = buildCategories(channels, obj?.categories || []);
    return { meta, channels, categories };
  }

  // ===== Rendu UI =====
  function renderCategories() {
    const options = state.categories.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
    [el.cat, el.cat2, el.inlineCat].forEach((sel) => { if (sel) sel.innerHTML = options; });
  }

  function filterChannels() {
    const q = (el.search?.value || el.search2?.value || el.inlineSearch?.value || '').trim().toLowerCase();
    const cat = el.cat?.value || el.cat2?.value || el.inlineCat?.value || '*';
    state.filtered = state.channels.filter((c) => {
      const inCat = cat === '*' || (c.category || '').toString().toLowerCase() === cat;
      if (!q) return inCat;
      const hay = `${c.name} ${c.group} ${c.category} ${c.url}`.toLowerCase();
      return inCat && hay.includes(q);
    });
  }

  function renderChannelLists() {
    filterChannels();
    const makeItem = (ch, idx) => {
      const logo = ch.logo ? `<img src="${ch.logo}" class="me-2" alt="" style="width:24px;height:24px;object-fit:contain">` : '';
      const badge = ch.type === 'm3u-list' ? '<span class="badge text-bg-secondary ms-2">M3U</span>' : '';
      return `<button class="list-group-item list-group-item-action d-flex align-items-center" data-idx="${idx}">${logo}<span class="flex-grow-1 text-truncate">${ch.name}</span>${badge}</button>`;
    };
    const html = state.filtered.map(makeItem).join('') || `<div class="text-muted small p-2">Aucune chaîne</div>`;
    [el.list, el.list2, el.inlineList].forEach((list) => list && (list.innerHTML = html));

    qsa('[data-idx]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        const idx = Number(ev.currentTarget.getAttribute('data-idx'));
        playByFilteredIndex(idx);
      });
    });

    el.zapTitle && (el.zapTitle.textContent = state.filtered[currentIndexInFiltered()]?.name || '—');
  }

  function currentIndexInFiltered() {
    const id = state.channels[state.index]?.id;
    return state.filtered.findIndex((c) => c.id === id);
  }

  function playByFilteredIndex(idx) {
    const ch = state.filtered[idx];
    if (!ch) return;
    const realIndex = state.channels.findIndex((c) => c.id === ch.id);
    playAt(realIndex);
  }

  // ===== Lecture =====
  function playAt(index) {
    const ch = state.channels[index];
    if (!ch) return;
    state.index = index;

    // Playlist M3U → déléguer à loadSource (charge et remplit les chaînes)
    if (ch.type === 'm3u-list') {
      if (typeof window.loadSource === 'function') {
        window.loadSource(ch.url);
      } else {
        alert('Entrée de type playlist M3U — impossible de la jouer directement.');
      }
      return;
    }

    const src = srcForPlayer(ch);

    if (vjs) {
      vjs.src(src);
      vjs.play().catch(() => {});
    } else if (el.player) {
      if (src && typeof src === 'object') el.player.src = src.src || '';
      else el.player.src = (src && src.src) || ch.url || '';
      el.player.play?.().catch(() => {});
    }

    // NOWBAR
    if (el.nowbar) el.nowbar.classList.remove('d-none');
    if (el.channelLogo) {
      if (ch.logo) { el.channelLogo.src = ch.logo; el.channelLogo.classList.remove('d-none'); }
      else { el.channelLogo.src = ''; el.channelLogo.classList.add('d-none'); }
    }
    el.nowPlaying && (el.nowPlaying.textContent = ch.name || 'Lecture');
    el.nowUrl && (el.nowUrl.textContent = ch.url || '');
    el.zapTitle && (el.zapTitle.textContent = ch.name || '—');
  }

  // ===== Chargement JSON =====
  async function loadJsonFromUrl(url) {
    const resp = await fetch(url, { credentials: 'omit' });
    const text = await resp.text();
    const obj = JSON.parse(text);
    const parsed = parseJsonPlaylist(obj);
    state.meta = parsed.meta;
    state.channels = parsed.channels;
    state.categories = parsed.categories;
    renderCategories();
    renderChannelLists();
    playAt(0);
  }

  // ===== Intégration UI existante =====
  function wireNav() {
    el.btnPrev && el.btnPrev.addEventListener('click', () => {
      const i = currentIndexInFiltered();
      const prev = i > 0 ? i - 1 : state.filtered.length - 1;
      playByFilteredIndex(prev);
    });
    el.btnNext && el.btnNext.addEventListener('click', () => {
      const i = currentIndexInFiltered();
      const next = i >= 0 ? (i + 1) % state.filtered.length : 0;
      playByFilteredIndex(next);
    });

    [el.search, el.search2, el.inlineSearch].forEach((inp) => inp && inp.addEventListener('input', renderChannelLists));
    [el.cat, el.cat2, el.inlineCat].forEach((sel) => sel && sel.addEventListener('change', renderChannelLists));

    // Bouton "Lire" — accepte aussi une URL .json
    el.btnPlay && el.btnPlay.addEventListener('click', () => {
      const v = el.inputUrl?.value?.trim();
      if (!v) return;
      if (isJsonUrl(v)) loadJsonFromUrl(v);
      else {
        const ch = { id: 'single', name: v, url: v, type: guessType(v) };
        state.channels = [ch];
        state.categories = [{ id: '*', label: 'Toutes' }];
        renderCategories();
        renderChannelLists();
        playAt(0);
      }
    });
  }

  function interceptSourceButtons() {
    const handle = (ev, sel) => {
      const url = sel?.value;
      if (url && isJsonUrl(url)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        loadJsonFromUrl(url).catch((err) => alert('Échec du chargement JSON: ' + err.message));
      }
    };
    el.btnLoadM3U && el.btnLoadM3U.addEventListener('click', (ev) => handle(ev, el.sourceSel), true);
    el.btnLoadM3U2 && el.btnLoadM3U2.addEventListener('click', (ev) => handle(ev, el.sourceSel2), true);
  }

  // Import .json via bouton "Importer"
  const importInput = document.getElementById('importFile');
  if (importInput) {
    importInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!/\.json$/i.test(file.name)) return; // laisser l'autre logique gérer les backups
      try {
        const text = await file.text();
        const obj = JSON.parse(text);
        if (Array.isArray(obj.channels) || Array.isArray(obj) || Array.isArray(obj.playlists)) {
          e.stopImmediatePropagation();
          const parsed = parseJsonPlaylist(obj);
          state.meta = parsed.meta;
          state.channels = parsed.channels;
          state.categories = parsed.categories;
          renderCategories();
          renderChannelLists();
          playAt(0);
        }
      } catch (err) {
        console.error(err);
        alert('Fichier JSON invalide.');
      }
    }, true);
  }

  // ===== Init =====
  wireNav();
  interceptSourceButtons();

  // API debug
  window.IPTV_JSON = {
    load: loadJsonFromUrl,
    parse: parseJsonPlaylist,
    state: () => ({ ...state }),
  };
})();

/*
====================
Exemples de playlists
====================

1) Schéma complet
------------------
{
  "meta": { "name": "France — Démo", "updated": "2025-10-22" },
  "categories": [
    { "id": "tnt", "label": "TNT" },
    { "id": "info", "label": "Infos" }
  ],
  "channels": [
    {
      "id": "fr2",
      "name": "France 2",
      "url": "https://example.com/fr2/index.m3u8",
      "logo": "https://example.com/logos/fr2.png",
      "category": "tnt",
      "type": "hls"
    },
    {
      "id": "bfm",
      "name": "BFM TV (YouTube)",
      "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      "logo": "https://example.com/logos/bfm.png",
      "category": "info",
      "type": "youtube"
    }
  ]
}

2) Variante courte (tableau de chaînes)
--------------------------------------
[
  { "name": "Chill Radio", "url": "https://example.com/live/stream.mp3" },
  { "name": "Demo VOD", "url": "https://example.com/videos/trailer.mp4" }
]

3) Méta‑liste (comme ton fichier)
---------------------------------
{
  "playlists": [
    { "name": "France TV 🇫🇷", "url": "https://…/france.m3u" },
    { "name": "Sports", "url": "https://…/sports.m3u" }
  ]
}
*/
