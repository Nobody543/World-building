/* ══════════════════════════════════════════════════════════
   WORLD.JS — central data store. No frameworks, no deps.
   ══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'worldbuilder_v2';

const DEFAULT_WORLD = {
  name: "The Shattered Realms",
  factions: [
    { id:"f1", name:"The Iron Compact",   type:"Empire",    color:"#C4613A", ruler_id:"c1", territories:["r1"], allies:[], enemies:["f2"], description:"A militaristic empire built on conquest and iron discipline. Controls the vast Ashfields through military force." },
    { id:"f2", name:"The Verdant Circle", type:"Covenant",  color:"#5BA89A", ruler_id:"c2", territories:["r2"], allies:["f3"], enemies:["f1"], description:"An ancient covenant of druids and forest peoples, older than any empire. They answer to no throne." },
    { id:"f3", name:"The Amber Guild",    type:"Mercantile",color:"#E8C87A", ruler_id:"c3", territories:["r3"], allies:["f2"], enemies:[], description:"The wealthiest organisation in the known world. Has a deal with every faction and loyalty to none." }
  ],
  locations: [
    { id:"r1", name:"The Ashfields",       type:"Region",   description:"Vast plains of grey ash left by an ancient cataclysm. Haunted by ash-wraiths at night.", faction_id:"f1", x:28, y:55, lore:["Once fertile farmland, scorched in the Burning.","The ash never settles — something stirs beneath."] },
    { id:"r2", name:"Thornwood Deep",      type:"Forest",   description:"An ancient forest so dense that sunlight barely reaches the floor. The trees remember everything.", faction_id:"f2", x:62, y:28, lore:["Home to trees older than recorded history.","The forest shifts — paths that existed yesterday are gone today."] },
    { id:"r3", name:"Port Aurentum",       type:"City",     description:"A glittering port city built on trade and secrets. No war has ever touched its walls — only money.", faction_id:"f3", x:52, y:68, lore:["Founded 400 years ago by the first Guild Master.","The city's founding charter contains a clause no-one will discuss."] },
    { id:"r4", name:"The Shattered Peaks", type:"Mountain", description:"A jagged range torn apart by some ancient force. Dragons nest in the highest crags.", faction_id:null, x:74, y:18, lore:["The peaks were once a single great mountain.","Something moves in the deep passes at night."] }
  ],
  characters: [
    { id:"c1", name:"Maren Ashcroft",        role:"Warlord",     faction_id:"f1", location_id:"r1", bio:"Commander of the Iron Compact's legions. Ruthless, brilliant, haunted by a choice made long ago. Earned her rank at seventeen.", story_beats:[{chapter:"Ch. 1", location_id:"r1", note:"Receives a mysterious envoy at dawn."}] },
    { id:"c2", name:"Sylveth of the Roots",  role:"Elder Druid", faction_id:"f2", location_id:"r2", bio:"Ancient druid who remembers the world before the Burning. Speaks little, sees everything. Age is unknown.", story_beats:[{chapter:"Ch. 1", location_id:"r2", note:"Senses a disturbance in the deep roots."}] },
    { id:"c3", name:"Darro Quint",           role:"Guild Master", faction_id:"f3", location_id:"r3", bio:"The shrewdest merchant alive. Has a deal with every faction and loyalty to none. Always smiling.", story_beats:[{chapter:"Ch. 1", location_id:"r3", note:"Auctions a mysterious artefact."}] }
  ],
  deities: [
    { id:"d1", name:"The Ashen Lord",   domain:"Death, Memory",   alignment:"Neutral", description:"God of the dead and keeper of all memory. Depicted as a tall figure in grey robes carrying a lantern.", myths:["It was the Ashen Lord who caused the Burning to prevent something worse."], worshippers:["f1"] },
    { id:"d2", name:"Verdis",           domain:"Nature, Growth",  alignment:"Good",    description:"The great mother of all living things. No temples — only sacred groves. Her voice is the wind.", myths:["Verdis wept for seven days when the first tree was cut for war. From her tears the deep rivers formed."], worshippers:["f2"] },
    { id:"d3", name:"The Unnamed Coin", domain:"Luck, Commerce",  alignment:"Neutral", description:"A faceless deity whose favour is bought, never prayed for. No image exists of this god.", myths:["The Unnamed Coin simply appeared in people's pockets one day. No-one knows where it came from."], worshippers:["f3"] }
  ],
  events: [
    { id:"e1", date:"-400", era:"Age of Fire",    title:"The Burning",              description:"An unknown cataclysm scorched the great plains, turning them to ash. All records from before are lost or destroyed.", factions:[], characters:[], location_id:"r1" },
    { id:"e2", date:"-200", era:"Age of Roots",   title:"The First Covenant",       description:"The forest peoples united under Verdis to protect Thornwood from the spreading ash and the armies that followed.", factions:["f2"], characters:[], location_id:"r2" },
    { id:"e3", date:"0",    era:"Present Age",    title:"The Guild's Founding",     description:"Darro Quint's ancestor founded Port Aurentum and signed trade pacts with both powers — a miracle of diplomacy.", factions:["f3"], characters:["c3"], location_id:"r3" },
    { id:"e4", date:"12",   era:"Present Age",    title:"The Iron Compact Forms",   description:"Maren Ashcroft unites the warring Ashfield clans under a single banner of iron, declaring herself Warlord.", factions:["f1"], characters:["c1"], location_id:"r1" }
  ],
  mythology: [
    { id:"m1", title:"The Creation Song",        type:"Creation Myth",  deity_ids:[],         description:"Before the world, there was only the Chord — a perfect vibration in the void. When it broke, the shards became earth, water, sky, and fire. Each shard carried a memory of the whole." },
    { id:"m2", title:"The War of Three Lights",  type:"Epic Legend",    deity_ids:["d1","d2"], description:"A war between the sun, the moon, and a third light now forgotten. The forgotten light was cast down and became the first dragon. It sleeps still." },
    { id:"m3", title:"The Sleeper Beneath",      type:"Prophecy",       deity_ids:["d1"],      description:"Something ancient sleeps under the Shattered Peaks. When it wakes, the world will be remade — or unmade. The prophecy is deliberately unclear on which." }
  ]
};

/* ── STORE ─────────────────────────────────────────────── */
const World = {
  _data: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? JSON.parse(raw) : this._clone(DEFAULT_WORLD);
    } catch(e) {
      this._data = this._clone(DEFAULT_WORLD);
    }
    return this._data;
  },

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data)); } catch(e) {}
  },

  get(key) {
    if (!this._data) this.load();
    return this._data[key];
  },

  set(key, value) {
    if (!this._data) this.load();
    this._data[key] = value;
    this.save();
  },

  add(col, item) {
    if (!this._data) this.load();
    if (!item.id) item.id = this._uid();
    this._data[col].push(item);
    this.save();
    return item;
  },

  update(col, id, patch) {
    if (!this._data) this.load();
    const idx = this._data[col].findIndex(x => x.id === id);
    if (idx === -1) return null;
    Object.assign(this._data[col][idx], patch);
    this.save();
    return this._data[col][idx];
  },

  remove(col, id) {
    if (!this._data) this.load();
    this._data[col] = this._data[col].filter(x => x.id !== id);
    this.save();
  },

  find(col, id) {
    if (!this._data) this.load();
    return this._data[col]?.find(x => x.id === id) || null;
  },

  factionName(id)  { return this.find('factions', id)?.name || '—'; },
  locationName(id) { return this.find('locations', id)?.name || '—'; },
  factionColor(id) { return this.find('factions', id)?.color || '#4A6050'; },
  charName(id)     { return this.find('characters', id)?.name || '—'; },

  exportJSON() {
    const name = (this._data.name || 'world').replace(/\s+/g,'_');
    const blob = new Blob([JSON.stringify(this._data, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '_backup.json';
    a.click();
  },

  importJSON(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => {
        try { this._data = JSON.parse(e.target.result); this.save(); res(this._data); }
        catch(err) { rej(err); }
      };
      r.readAsText(file);
    });
  },

  resetToDefault() {
    this._data = this._clone(DEFAULT_WORLD);
    this.save();
  },

  _uid()      { return Date.now().toString(36) + Math.random().toString(36).slice(2,5); },
  _clone(obj) { return JSON.parse(JSON.stringify(obj)); }
};

/* ── NAV ────────────────────────────────────────────────── */
function renderSidebar(activePage) {
  World.load();
  const d = World._data;

  const links = [
    { id:'index',      label:'Dashboard',  icon:'⌂', href:'index.html',      count:null },
    { id:'map',        label:'Map',         icon:'◈', href:'map.html',        count:d.locations.length },
    { id:'factions',   label:'Factions',    icon:'⚑', href:'factions.html',   count:d.factions.length },
    { id:'characters', label:'Characters',  icon:'◉', href:'characters.html', count:d.characters.length },
    { id:'history',    label:'History',     icon:'⧗', href:'history.html',    count:d.events.length },
    { id:'mythology',  label:'Mythology',   icon:'✦', href:'mythology.html',  count:d.mythology.length + d.deities.length },
    { id:'story',      label:'Story',       icon:'◎', href:'story.html',      count:null },
  ];

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <span class="sidebar-glyph">◈</span>
      <span class="sidebar-world-name" id="sidebarWorldName">${d.name}</span>
      <span class="sidebar-tagline">World Builder</span>
    </div>
    <nav class="sidebar-nav">
      <span class="nav-section-label">Navigate</span>
      ${links.map(l => `
        <a href="${l.href}" class="nav-link${activePage===l.id?' active':''}">
          <span class="nav-icon">${l.icon}</span>
          ${l.label}
          ${l.count !== null ? `<span class="nav-count">${l.count}</span>` : ''}
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-factions">
      <span class="faction-strip-label">Factions</span>
      <div class="faction-strip" id="sidebarFactions">
        ${d.factions.map(f => `
          <div class="faction-strip-item">
            <span class="faction-dot" style="background:${f.color}"></span>
            <span>${f.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.prepend(sidebar);
}

/* ── MODAL HELPERS ──────────────────────────────────────── */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function onBackdrop(id) {
  const el = document.getElementById(id);
  el?.addEventListener('click', e => { if(e.target===el) closeModal(id); });
}

/* ── TOAST ──────────────────────────────────────────────── */
function toast(msg, type='ok') {
  const el = document.createElement('div');
  el.className = 'toast' + (type==='error'?' error':'');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ── SELECT HELPERS ─────────────────────────────────────── */
function factionOptions(selected='', includeNone=true) {
  const opts = includeNone ? [`<option value="">— None —</option>`] : [];
  World.get('factions').forEach(f => {
    opts.push(`<option value="${f.id}" ${selected===f.id?'selected':''}>${f.name}</option>`);
  });
  return opts.join('');
}

function locationOptions(selected='', includeNone=true) {
  const opts = includeNone ? [`<option value="">— None —</option>`] : [];
  World.get('locations').forEach(l => {
    opts.push(`<option value="${l.id}" ${selected===l.id?'selected':''}>${l.name}</option>`);
  });
  return opts.join('');
}

function characterOptions(selected='', includeNone=true) {
  const opts = includeNone ? [`<option value="">— None —</option>`] : [];
  World.get('characters').forEach(c => {
    opts.push(`<option value="${c.id}" ${selected===c.id?'selected':''}>${c.name}</option>`);
  });
  return opts.join('');
}

/* ── COLOUR TAG BY TYPE ─────────────────────────────────── */
function typeTag(type) {
  const map = {
    'Region':'tag-dim','Forest':'tag-teal','City':'tag-parch','Mountain':'tag-dim',
    'Empire':'tag-coral','Covenant':'tag-teal','Mercantile':'tag-parch',
    'Creation Myth':'tag-violet','Epic Legend':'tag-parch','Prophecy':'tag-coral','Myth':'tag-violet',
  };
  return `<span class="tag ${map[type]||'tag-dim'}">${type}</span>`;
}

World.load();
