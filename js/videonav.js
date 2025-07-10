let channels = [];

    let filtered = [];

    async function loadPlaylist() {

      const url = document.getElementById('playlist-url').value.trim();

      if (!url) return alert('Please enter a playlist URL');

      try {

        const res = await fetch(url);

        const text = await res.text();

        channels = parseM3U(text);

        populateCategories();

        renderChannels();

        if (channels.length) playChannel(channels[0].url);

      } catch (e) {

        alert('Error loading playlist: ' + e.message);

      }

    }

    function parseM3U(text) {

      const lines = text.split('\n');

      const parsed = [];

      for (let i = 0; i < lines.length; i++) {

        const infoLine = lines[i].trim();

        if (infoLine.startsWith('#EXTINF')) {

          const url = lines[i + 1]?.trim();

          if (!url || !url.startsWith('http')) continue;

          let name = 'Unknown Channel';

          const commaIndex = infoLine.lastIndexOf(',');

          if (commaIndex !== -1 && commaIndex < infoLine.length - 1) {

            name = infoLine.slice(commaIndex + 1).trim();

          }

          // Fallback to tvg-name if name is still unknown

          if (!name || name === 'Unknown Channel') {

            const nameAttr = infoLine.match(/tvg-name="(.*?)"/);

            if (nameAttr) name = nameAttr[1].trim();

          }

          const logoMatch = infoLine.match(/tvg-logo="(.*?)"/);

          const groupMatch = infoLine.match(/group-title="(.*?)"/);

          const logo = logoMatch ? logoMatch[1] : '';

          const group = groupMatch ? groupMatch[1] : 'Other';

          parsed.push({ name, url, logo, group });

        }

      }

      return parsed;

    }

    function populateCategories() {

      const select = document.getElementById('category-filter');

      const groups = [...new Set(channels.map(c => c.group))].sort();

      select.innerHTML = `<option value="all">All Categories</option>`;

      groups.forEach(group => {

        const opt = document.createElement('option');

        opt.value = group;

        opt.textContent = group;

        select.appendChild(opt);

      });

    }

    function renderChannels() {

      const container = document.getElementById('channel-list');

      container.innerHTML = '';

      const searchVal = document.getElementById('search').value.toLowerCase();

      const groupFilter = document.getElementById('category-filter').value;

      filtered = channels.filter(c => {

        const matchSearch = c.name.toLowerCase().includes(searchVal);

        const matchGroup = groupFilter === 'all' || c.group === groupFilter;

        return matchSearch && matchGroup;

      });

      document.getElementById('channel-count').innerText = `${filtered.length} channel(s) found`;

      for (const ch of filtered) {

        const div = document.createElement('div');

        div.className = 'lix list-group';

        div.onclick = () => playChannel(ch.url);

        const img = document.createElement('img');

        img.src = ch.logo || 'https://via.placeholder.com/50x35?text=TV';

        const span = document.createElement('span');

        span.textContent = ch.name;

        div.appendChild(img);

        div.appendChild(span);

        container.appendChild(div);

      }

    }

    function playChannel(url) {

      const video = document.getElementById('player');

      if (Hls.isSupported()) {

        if (window.hls) window.hls.destroy();

        const hls = new Hls();

        hls.loadSource(url);

        hls.attachMedia(video);

        window.hls = hls;

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {

        video.src = url;

      } else {

        alert("This browser doesn't support HLS.");

      }

    }