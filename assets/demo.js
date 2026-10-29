/* Famulus Academic · the animated demo on the landing page.

   One use case at a time plays as a short loop on a drawn iPhone: tap the microphone of a group card → speak
   (photos if the use case has them) → "Beenden" → the recording goes to the Famulus server (protected local
   Nemotron engine) and comes back as a document → a result of the template → the group as a book → share as PDF.

   The template names and result labels come from the app's own catalogue (build.py embeds them as
   <script id="fd-data">); the sample texts below are demo content written for this page.

   Idiom of the landings2026 guide player: gold tap ripple, caption with a gold edge, play/step controls, starts
   when it is in view and stops when it leaves; under prefers-reduced-motion nothing moves by itself, the steps are
   still pictures turned with the buttons.  ?fd=<case>&s=<step> opens a case at a step (for screenshots). */
(function () {
  'use strict';
  const root = document.getElementById('fd');
  if (!root) return;
  const CAT = JSON.parse(document.getElementById('fd-data').textContent);
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const P = new URLSearchParams(location.search);

  // ---------- small helpers ----------
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const L = (de, en) => `<span data-l="de">${de}</span><span data-l="en">${en || de}</span>`;
  const I = {
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h9"/></svg>',
    find: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 5.5V19"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4M6 11v9h12v-9"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M4 7l8 6 8-6"/></svg>',
    msg: '<svg viewBox="0 0 24 24"><path d="M4 6h16v10H9l-4 3v-3H4z"/></svg>',
    air: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="1.6"/><path d="M8.5 16.5a5 5 0 1 1 7 0M5.8 19.2a8.8 8.8 0 1 1 12.4 0"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M3.5 7.5h6l2 2h9v9.5h-17z"/></svg>',
  };
  // drawn photos: a slide, a sketch on paper
  const FIG = {
    folie: '<svg viewBox="0 0 160 90"><rect width="160" height="90" fill="#14213d"/><rect x="10" y="10" width="62" height="6" rx="2" fill="#c9a227"/>' +
      '<text x="16" y="42" font-family="Georgia,serif" font-size="13" fill="#fffdf8">p → q</text><text x="16" y="58" font-family="Georgia,serif" font-size="13" fill="#fffdf8">p</text>' +
      '<line x1="14" y1="64" x2="70" y2="64" stroke="#c9a227" stroke-width="1.4"/><text x="16" y="79" font-family="Georgia,serif" font-size="13" fill="#fffdf8">q</text>' +
      '<rect x="92" y="30" width="54" height="4" rx="2" fill="#5b6b88"/><rect x="92" y="42" width="44" height="4" rx="2" fill="#5b6b88"/><rect x="92" y="54" width="50" height="4" rx="2" fill="#5b6b88"/></svg>',
    skizze: '<svg viewBox="0 0 160 90"><rect width="160" height="90" fill="#f6f1e4"/><g fill="none" stroke="#2b3a57" stroke-width="2" stroke-linecap="round">' +
      '<rect x="14" y="24" width="36" height="36" rx="3"/><rect x="62" y="24" width="36" height="36" rx="3"/><rect x="110" y="24" width="36" height="36" rx="3"/>' +
      '<path d="M50 42h12M98 42h12" stroke="#b8921f"/><path d="M32 70c30 14 66 14 96 0" stroke="#b8921f" stroke-dasharray="4 4"/></g>' +
      '<circle cx="32" cy="42" r="5" fill="#2b3a57"/></svg>',
  };

  // ---------- the use cases (texts are demo content; labels come from the catalogue) ----------
  const CASES = [
    {
      id: 'vorlesung', group: 'Einführung in die Logik', unit: 'Vorlesung', units: 'Vorlesungen', date: '29. Okt. 2026', dur: '1:28:40',
      prev: [['Vorlesung 1 · Was ist Logik?', '15. Okt. 2026'], ['Vorlesung 2 · Aussagen', '22. Okt. 2026']],
      title: 'Gültige Schlüsse', voices: 1, photo: 'folie', speak: L('Vortragen, Folien fotografieren', 'Lecture, photograph the slides'),
      lines: [{ sec: 'Gültige Schlüsse' }, { ts: '0:04', t: 'Heute fragen wir, wann ein Argument gültig ist.' }, { fig: 'folie' },
        { ts: '12:30', t: 'Gültig ist es, wenn die Wahrheit der Prämissen die Wahrheit der Konklusion garantiert.' }],
      pick: 'Lernfragen',
      result: () => `<div class="fd-q st"><b>1</b><span>Wann ist ein Argument gültig?</span></div>
        <div class="fd-q st"><b>2</b><span>Was zeigt der Modus ponens auf Folie 3?</span></div>
        <div class="fd-q st"><b>3</b><span>Was folgt, wenn eine Prämisse falsch ist?</span></div>`,
      chapters: ['Was ist Logik?', 'Aussagen', 'Gültige Schlüsse'],
    },
    {
      id: 'gespraech', group: 'Projektrunde', unit: 'Gespräch', units: 'Gespräche', date: '29. Okt. 2026', dur: '0:42:15',
      prev: [['Gespräch 1 · Auftakt', '8. Okt. 2026'], ['Gespräch 2 · Gliederung', '15. Okt. 2026']],
      title: 'Zeitplan', voices: 2, speak: L('Sprechen – Stimmen getrennt', 'Talk – voices kept apart'),
      lines: [{ sec: 'Zeitplan' }, { spk: 'Person A' }, { ts: '0:03', t: 'Wo stehen wir mit dem Antrag?' }, { spk: 'Person B' },
        { ts: '0:09', t: 'Der Entwurf ist fertig, es fehlen noch die Kosten.' }, { spk: 'Person A' }, { ts: '0:17', t: 'Die Kosten rechne ich bis Freitag.' }],
      pick: 'Vereinbarungen',
      result: () => `<table class="fd-tb"><tr><th>Wer</th><th>Was</th><th>Bis</th></tr>
        <tr class="st"><td>Person A</td><td>Kosten berechnen</td><td>Freitag</td></tr>
        <tr class="st"><td>Person B</td><td>Entwurf versenden</td><td>Montag</td></tr>
        <tr class="st"><td>Person A, B</td><td>Antrag abschließen</td><td>15. Nov.</td></tr></table>`,
      chapters: ['Auftakt', 'Gliederung', 'Zeitplan'],
    },
    {
      id: 'ideen', group: 'Ausstellung', unit: 'Memo', units: 'Memos', date: '29. Okt. 2026', dur: '0:01:12',
      prev: [['Memo 1 · Der Raum', '20. Okt. 2026'], ['Memo 2 · Das Begleitbuch', '24. Okt. 2026']],
      title: 'Drei Räume', voices: 1, photo: 'skizze', speak: L('Sprechen, Foto dazu', 'Speak, add a photo'),
      lines: [{ sec: 'Drei Räume' }, { ts: '0:05', t: 'Idee: Der Rundgang beginnt mit einem einzigen Objekt im dunklen Raum.' }, { fig: 'skizze' },
        { ts: '0:31', t: 'Auf der Skizze drei Räume, ein Weg führt durch alle hindurch.' }],
      pick: 'Ideenkarten',
      result: () => `<div class="fd-idea st"><b>Ein Objekt im Dunkeln</b><span>Der Rundgang beginnt mit einem einzigen Objekt.</span></div>
        <div class="fd-idea st"><b>Drei Räume, ein Weg</b><span>Die Skizze ordnet die Räume zu einem Rundgang.</span></div>`,
      chapters: ['Der Raum', 'Das Begleitbuch', 'Drei Räume'],
    },
    {
      id: 'kueche', group: 'Küche', unit: 'Memo', units: 'Rezepte', date: '29. Okt. 2026', dur: '0:01:48', tab: 'Notiz',
      prev: [['Memo 1 · Kürbisrisotto', '12. Okt. 2026'], ['Memo 2 · Apfelkuchen', '19. Okt. 2026']],
      title: 'Linsensuppe', voices: 1, speak: L('Beim Kochen sprechen', 'Speak while cooking'),
      lines: [{ sec: 'Linsensuppe' }, { ts: '0:02', t: 'Heute die Linsensuppe: zweihundert Gramm Berglinsen, eine Zwiebel, zwei Karotten.' },
        { ts: '0:21', t: 'Erst die Zwiebel in Olivenöl glasig anschwitzen, dann das Gemüse dazu.' },
        { ts: '0:44', t: 'Linsen rein, mit einem Liter Brühe aufgießen und vierzig Minuten köcheln lassen.' }],
      pick: 'Rezeptkarte',
      result: () => `<div class="fd-rc"><h4>Linsensuppe</h4><span class="fd-pill">Zeit 40 Minuten</span>
        <div class="fd-rk">ZUTATEN</div>
        <div class="fd-ing st"><b>200 g</b><span>Berglinsen</span></div><div class="fd-ing st"><b>1</b><span>Zwiebel</span></div>
        <div class="fd-ing st"><b>2</b><span>Karotten</span></div><div class="fd-ing st"><b>1 l</b><span>Brühe</span></div></div>`,
      chapters: ['Kürbisrisotto', 'Apfelkuchen', 'Linsensuppe'],
    },
  ].filter(c => CAT[c.id]);
  if (!CASES.length) return;

  // ---------- the frame ----------
  root.classList.toggle('rm', RM);
  const tabs = h('div', 'fd-tabs'); tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Nutzungsweisen');
  const win = h('div', 'fd-win'); win.id = 'fd-panel'; win.setAttribute('role', 'tabpanel');
  const stage = h('div', 'fd-stage');
  const steps = h('ol', 'fd-steps');
  const cap = h('div', 'fd-cap'); cap.setAttribute('aria-live', 'polite');
  const phone = h('div', 'fd-phone');
  const scr = h('div', 'fd-scr'); scr.setAttribute('aria-hidden', 'true');
  phone.append(scr);
  const srvcol = h('div', 'fd-srvcol');
  const link = h('div', 'fd-link', '<span class="fd-pk"></span>');
  const srv = h('div', 'fd-srv', `<div class="fd-srv-h"><svg viewBox="0 0 34 34"><rect x="4" y="5" width="26" height="9" rx="2"/><rect x="4" y="18" width="26" height="9" rx="2"/>
    <circle class="led" cx="9" cy="9.5" r="1.6"/><circle class="led" cx="9" cy="22.5" r="1.6"/><path d="M15 9.5h10M15 22.5h10"/></svg>
    <div class="fd-srv-t">Famulus-Server<small>${L('geschützte lokale Nemotron-Engine', 'protected local Nemotron engine')}</small></div></div>
    <div class="fd-srv-doc"></div>
    <div class="fd-srv-clk"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5"/><path class="hand" d="M8 8V4"/></svg>${L('wenige Minuten', 'a few minutes')}</div>`);
  srvcol.append(link, srv);
  stage.append(steps, cap, phone, srvcol);
  const ctrl = h('div', 'fd-ctrl');
  const PLAY = '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9.5-5.5z"/></svg>', PAUSE = '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>';
  const bPrev = h('button', 'fd-btn', '‹'), bPlay = h('button', 'fd-btn play', PLAY), bNext = h('button', 'fd-btn', '›');
  [bPrev, bPlay, bNext].forEach(b => (b.type = 'button'));
  bPrev.setAttribute('aria-label', 'Schritt zurück'); bNext.setAttribute('aria-label', 'Schritt vor');
  const track = h('div', 'fd-track', '<div class="fd-fill"></div>'); const fill = track.firstChild;
  ctrl.append(bPrev, bPlay, bNext, track);
  win.append(stage, ctrl);
  root.append(tabs, win);

  CASES.forEach((c, k) => {
    const meta = CAT[c.id];
    const b = h('button', 'fd-tab', `<svg viewBox="0 0 24 24" aria-hidden="true">${meta.icon}</svg>${L(esc(meta.short), esc(meta.short_en))}<span class="fd-tp"></span>`);
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'fd-panel'); b.id = 'fd-tab-' + c.id;
    b.onclick = () => { userPaused = false; select(k, 0, !RM); };
    b.onkeydown = e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault(); const n = (k + d + CASES.length) % CASES.length; tabs.children[n].focus(); select(n, 0, !RM && !userPaused);
    };
    tabs.append(b);
  });

  // ---------- the screens of one use case ----------
  function screens(c) {
    const meta = CAT[c.id];
    const items = meta.item.slice();
    const tab = c.tab || items[0];
    const chips = [tab].concat(items.filter(x => x !== tab));
    const book = meta.group[0] || 'Buch';
    const n = c.prev.length + 1;
    const row = (t, d, badge, cls) => `<div class="fd-row ${cls || ''}"><div><b>${esc(t)}</b><small>${esc(d)}</small></div>${badge}</div>`;
    const lines = c.lines.map(x => x.sec ? `<div class="fd-sec st">${esc(x.sec)}</div>` :
      x.spk ? `<div class="fd-spk st">${esc(x.spk.toUpperCase())}</div>` :
      x.fig ? `<div class="fd-fig st">${FIG[x.fig]}</div>` :
      `<p class="fd-ln st"><code>${x.ts}</code>${esc(x.t)}</p>`).join('');
    const voices = c.voices === 2 ? '<span class="fd-vo">A</span><span class="fd-vo">B</span>' : `<span class="fd-vo">${I.person}</span>`;
    scr.innerHTML = `
    <div class="fd-sb"><span>9:41</span><i></i></div>
    <section class="fd-v v-groups">
      <div class="fd-top"><span class="fd-ib">${I.gear}</span><span class="fd-ib">${I.plus}</span></div>
      <div class="fd-h1">Gruppen</div>
      <div class="fd-card"><div class="fd-k">${esc(meta.label)}</div>
        <div class="fd-ct">${esc(c.group)}</div><div class="fd-cm">${c.prev.length} ${esc(c.units)}</div>
        <div class="fd-mic"><span class="t-mic">${I.mic}</span>${esc(c.unit)} ${n}</div>
        <div class="fd-cr">${items.concat(meta.group).map(esc).join(' · ')}</div></div>
      <div class="fd-card"><div class="fd-k">${esc((CAT.notizen && CAT.notizen.label) || 'Notizen')}</div><div class="fd-ct">Unterwegs</div><div class="fd-cm">5 Memos</div></div>
    </section>
    <section class="fd-v v-rec fd-rec">
      <div class="fd-photos"></div>
      <div class="fd-timer">0:00</div>
      <div class="fd-wave">${'<i></i>'.repeat(17)}</div>
      <div class="fd-rl">Aufnahme läuft</div>
      <div class="fd-voices">${voices}</div>
      <div class="fd-rbtns"><div class="fd-rrow ${c.photo ? '' : 'one'}">${c.photo ? `<div class="fd-rb t-cam">${I.cam}Foto</div>` : ''}<div class="fd-rb">${I.pause}Pause</div></div>
        <div class="fd-end t-end">Beenden</div></div>
      <div class="fd-flash"></div>
    </section>
    <section class="fd-v v-group">
      <div class="fd-top"><span class="fd-ib">${I.back}</span><span class="fd-ib">${I.book}</span></div>
      <div class="fd-h1">${esc(c.group)}</div>
      <div class="fd-banner"><span class="fd-chk">${I.check}</span><div><b>${esc(c.unit)} ${n} gespeichert · ${c.dur.replace(/^0:0?/, '')}</b>Geht an den Famulus-Server</div></div>
      <div class="fd-recbtn">${I.mic}${esc(c.unit)} ${n + 1} aufnehmen</div>
      <div class="fd-bookbtn t-book">${I.book}Als Buch lesen</div>
      <div class="fd-lh">${esc(c.units)}</div>
      <div class="fd-rows">${c.prev.map(p => row(p[0], p[1], '<span class="fd-badge">Fertig</span>')).join('')}
        ${row(`${c.unit} ${n}`, c.date + ' · ' + c.dur.replace(/^0:0?/, ''), '<span class="fd-badge wait"><span class="fd-spin"></span>Wird verarbeitet</span>', 'new t-row')}</div>
    </section>
    <section class="fd-v v-doc fd-doc">
      <div class="fd-nav">${I.back}<div><b>${esc(c.title)}</b><small>${esc(c.unit)} ${n} · ${esc(c.date)}</small></div>${I.find}</div>
      <div class="fd-body">
        <div class="fd-k d-k">${esc(tab)}</div><div class="fd-dt">${esc(c.title)}</div><div class="fd-ds">${esc(c.unit)} ${n} · ${esc(c.date)}</div>
        <div class="fd-chips">${chips.map((x, i) => `<span class="fd-chip ${i ? '' : 'on'}" data-r="${esc(x)}">${esc(x)}</span>`).join('')}</div>
        <div class="fd-pane on p-tx">${lines}</div>
        <div class="fd-pane p-res">${c.result()}</div>
      </div>
    </section>
    <section class="fd-v v-book fd-doc">
      <div class="fd-nav">${I.back}<div><b>${esc(book)}</b><small>${esc(c.group)}</small></div>${I.find}</div>
      <div class="fd-body">
        <div class="fd-k">Aus der ganzen Gruppe</div><div class="fd-dt">${esc(book)}</div><div class="fd-ds">${esc(c.group)} · aus ${n} Aufnahmen</div>
        <div class="fd-bar"><span class="fd-k">Inhalt</span><span class="fd-share t-share">${I.share}Teilen</span></div>
        ${c.chapters.map((x, i) => `<div class="fd-chap st"><b>${i + 1}</b><span>${esc(x)}</span><small>${esc(c.unit)} ${i + 1}</small></div>`).join('')}
      </div>
    </section>
    <div class="fd-sheet"><div class="fd-shh"><span class="fd-pdf"></span><div><b>${esc(book)} · ${esc(c.group)}</b><small>PDF-Dokument</small></div></div>
      <div class="fd-apps"><div><i>${I.mail}</i>Mail</div><div><i>${I.msg}</i>Nachrichten</div><div><i>${I.air}</i>AirDrop</div><div><i>${I.file}</i>Dateien</div></div></div>
    <div class="fd-tap"></div>`;
    // the drawing on the server: a heading, then lines with time stamps (speaker lines for a conversation)
    const doc = srv.querySelector('.fd-srv-doc');
    doc.innerHTML = '<i class="hd" data-w="55%"></i>' + [78, 64, 85, 52, 70, 60].map((w, i) =>
      `<div class="row"><i class="ts" data-w="14%"></i><i data-w="${w - 14}%"></i></div>`).join('');
    return { pick: c.pick && chips.includes(c.pick) ? c.pick : chips[1] || chips[0], book };
  }

  // ---------- the timeline ----------
  const $ = s => scr.querySelector(s);
  function show(name) {
    let seen = false;
    scr.querySelectorAll('.fd-v').forEach(v => {
      const on = v.classList.contains('v-' + name);
      v.classList.toggle('on', on);
      v.classList.toggle('past', !on && !seen);
      if (on) seen = true;
    });
    $('.fd-sb').classList.toggle('lt', name === 'rec');
  }
  function stagger(ctx, sel, t0, gap) { scr.querySelectorAll(sel).forEach((e, i) => ctx.at(t0 + i * gap, () => e.classList.add('in'))); }

  function plan(c, info) {
    const meta = CAT[c.id];
    const pick = info.pick, book = info.book;
    return [
      { cap: L('Mikrofon der Gruppe tippen', 'Tap the group’s microphone'), dur: 2300, run(x) {
        show('groups'); x.tap('.t-mic', 1500, () => {}); } },
      { cap: c.speak, dur: c.photo ? 4400 : 3600, run(x) {
        x.at(0, () => { show('rec'); $('.v-rec').classList.add('live'); });
        const tm = $('.fd-timer'), end = c.photo ? 4200 : 3400, total = c.dur.split(':').reduce((acc, v) => acc * 60 + +v, 0);   // the clock runs fast to the real length
        for (let k = 0; k <= 16; k++) x.at(200 + k * (end - 200) / 16, () => { const s = Math.round(k / 16 * total), hh = Math.floor(s / 3600), mm = Math.floor(s / 60) % 60, ss = String(s % 60).padStart(2, '0');
          tm.textContent = hh ? `${hh}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`; });
        const vo = scr.querySelectorAll('.fd-vo');
        [400, 1300, 2200, 3000].forEach((t, i) => x.at(t, () => vo.forEach((v, j) => v.classList.toggle('sp', j === i % vo.length))));
        if (c.photo) x.tap('.t-cam', 2400, () => {
          $('.fd-flash').classList.remove('go'); void $('.fd-flash').offsetWidth; $('.fd-flash').classList.add('go');
          const ph = h('span', 'fd-ph', FIG[c.photo]); $('.fd-photos').append(ph); x.at(60, () => ph.classList.add('in'));
        });
      } },
      { cap: L('Beenden', 'Stop'), dur: 2000, run(x) {
        x.tap('.t-end', 700, () => { $('.v-rec').classList.remove('live'); scr.querySelectorAll('.fd-vo').forEach(v => v.classList.remove('sp')); });
        x.at(1100, () => { show('group'); });
        x.at(1400, () => { $('.fd-banner').classList.add('in'); $('.t-row').classList.add('in'); });
      } },
      { cap: L('Famulus-Server · Nemotron-Engine', 'Famulus server · Nemotron engine'), dur: 4200, run(x) {
        x.at(0, () => { link.classList.remove('back'); link.classList.add('send'); });
        x.at(800, () => srv.classList.add('on', 'work'));
        srv.querySelectorAll('.fd-srv-doc i').forEach((e, i) => x.at(1000 + i * 150, () => (e.style.width = e.dataset.w)));
        x.at(3100, () => { srv.classList.remove('work'); link.classList.remove('send'); void link.offsetWidth; link.classList.add('back'); });
        x.at(3900, () => {
          $('.fd-banner').classList.remove('in');
          $('.t-row .fd-badge').className = 'fd-badge'; $('.t-row .fd-badge').textContent = 'Fertig';
          $('.t-row b').textContent = `${c.unit} ${c.prev.length + 1} · ${c.title}`;
          srv.classList.remove('on');
        });
      } },
      { cap: L('Wortnah, mit Zeitmarken – dann: ' + esc(pick), 'Close to the words, time-stamped – then: ' + esc(meta.en[pick] || pick)), dur: 5400, run(x) {
        x.tap('.t-row', 700, () => {});
        x.at(1100, () => show('doc'));
        stagger(x, '.p-tx .st', 1400, 260);
        x.at(2500, () => {                            // bring the chip of the result into view (the row scrolls, as in the app)
          const row = $('.fd-chips'), chip = $(`.fd-chip[data-r="${pick}"]`);
          if (row && chip) row.scrollTo({ left: Math.max(0, chip.offsetLeft - row.offsetLeft - row.clientWidth / 3), behavior: x.instant ? 'auto' : 'smooth' });
        });
        x.tap(`.fd-chip[data-r="${pick}"]`, 3500, () => {
          scr.querySelectorAll('.fd-chip').forEach(e => e.classList.toggle('on', e.dataset.r === pick));
          $('.p-tx').classList.remove('on'); $('.p-res').classList.add('on'); $('.d-k').textContent = pick;
        });
        stagger(x, '.p-res .st', 3700, 260);
      } },
      { cap: L('Die ganze Gruppe als Buch: ' + esc(book), 'The whole group as a book: ' + esc(meta.en[book] || book)), dur: 3800, run(x) {
        x.at(0, () => show('group'));
        x.tap('.t-book', 1100, () => {});
        x.at(1500, () => show('book'));
        stagger(x, '.v-book .fd-chap', 1800, 280);
      } },
      { cap: L('Als PDF teilen', 'Share as PDF'), dur: 3200, run(x) {
        x.tap('.t-share', 800, () => {});
        x.at(1100, () => $('.fd-sheet').classList.add('in'));
      } },
    ];
  }

  // ---------- the player ----------
  let ci = 0, si = 0, steps_ = [], timers = [], playing = false, userPaused = false, visible = false, t0 = 0, raf = 0;
  const tap = () => $('.fd-tap');
  function ctx(instant) {
    const x = {
      instant,
      at(ms, fn) { if (instant) fn(); else timers.push(setTimeout(fn, ms)); },
      tap(sel, ms, fn) {
        if (instant) { fn(); return; }
        x.at(Math.max(0, ms - 750), () => {
          const t = $(sel), f = tap(); if (!t) return;
          const a = scr.getBoundingClientRect(), b = t.getBoundingClientRect();
          f.style.left = (b.left - a.left + b.width / 2) + 'px'; f.style.top = (b.top - a.top + b.height / 2) + 'px'; f.classList.add('on');
        });
        x.at(ms, () => {
          const t = $(sel), f = tap(); if (!t) return;
          f.classList.add('down'); t.classList.add('press');
          const r = h('div', 'fd-rip'); r.style.left = f.style.left; r.style.top = f.style.top; scr.append(r); setTimeout(() => r.remove(), 700);
          setTimeout(() => { f.classList.remove('down'); t.classList.remove('press'); }, 160);
          fn();
        });
        x.at(ms + 450, () => tap().classList.remove('on'));
      },
    };
    return x;
  }
  function clear() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }

  function select(k, s, play) {
    clear();
    ci = k; const c = CASES[ci];
    [...tabs.children].forEach((b, j) => { b.setAttribute('aria-selected', String(j === ci)); b.tabIndex = j === ci ? 0 : -1; b.querySelector('.fd-tp').style.width = '0'; });
    srv.classList.remove('on', 'work'); link.classList.remove('send', 'back');
    const info = screens(c);
    steps_ = plan(c, info);
    steps.innerHTML = '';
    steps_.forEach((st, j) => {
      const li = h('li'); const b = h('button', 'fd-step', `<b>${j + 1}</b><span>${st.cap}</span>`); b.type = 'button';
      b.onclick = () => go(j, playing); li.append(b); steps.append(li);
    });
    go(s || 0, play);
  }
  // a step: the steps before it are put in place at once, the step itself plays (or stands still)
  function go(s, play) {
    clear();
    s = Math.max(0, Math.min(s, steps_.length - 1));
    // rebuild from the start of the case so every state is exact
    steps_ = plan(CASES[ci], screens(CASES[ci]));
    srv.classList.remove('on', 'work'); link.classList.remove('send', 'back');
    for (let j = 0; j < s; j++) steps_[j].run(ctx(true));
    link.classList.remove('send', 'back');
    srv.querySelectorAll('.fd-srv-doc i').forEach(e => (e.style.width = s > 3 ? e.dataset.w : '0'));
    si = s;
    [...steps.querySelectorAll('.fd-step')].forEach((b, j) => {
      b.classList.toggle('on', j === s); b.classList.toggle('done', j < s);
      if (j === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    cap.innerHTML = `<span>${s + 1}/${steps_.length} · ${steps_[s].cap}</span>`;
    playing = !!play;
    bPlay.innerHTML = playing ? PAUSE : PLAY; bPlay.setAttribute('aria-label', playing ? 'Anhalten' : 'Abspielen');
    steps_[s].run(ctx(!playing));
    if (!playing) {                                   // a still picture: the step's end state, the finger hidden
      tap().classList.remove('on'); link.classList.remove('send', 'back'); srv.classList.toggle('on', s === 3); progress(s, 1); return;
    }
    t0 = performance.now();
    const tick = () => { progress(s, Math.min(1, (performance.now() - t0) / steps_[s].dur)); raf = requestAnimationFrame(tick); };
    tick();
    timers.push(setTimeout(() => {
      if (s + 1 < steps_.length) go(s + 1, true);
      else timers.push(setTimeout(() => select((ci + 1) % CASES.length, 0, true), 600));   // auto-advance to the next use case
    }, steps_[s].dur));
  }
  function progress(s, f) {
    const total = steps_.reduce((a, x) => a + x.dur, 0);
    const done = steps_.slice(0, s).reduce((a, x) => a + x.dur, 0) + f * steps_[s].dur;
    const p = (100 * done / total).toFixed(1) + '%';
    fill.style.width = p; const tp = tabs.children[ci].querySelector('.fd-tp'); if (tp) tp.style.width = p;
  }
  bPlay.onclick = () => { if (playing) { userPaused = true; go(si, false); } else { userPaused = false; go(si >= steps_.length - 1 ? 0 : si, true); } };
  bPrev.onclick = () => go(si - 1, false);
  bNext.onclick = () => go(si + 1, false);

  // start: ?fd=<case>&s=<step> for a fixed picture; otherwise the first case, playing once it is in view
  const want = CASES.findIndex(c => c.id === P.get('fd'));
  const s0 = parseInt(P.get('s') || '', 10);
  const fixed = want >= 0 && !isNaN(s0);
  select(want >= 0 ? want : 0, fixed ? s0 : (RM ? 4 : 0), false);
  if (RM || fixed) return;
  const resume = () => { if (visible && !userPaused && !playing && !document.hidden) go(si, true); };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.intersectionRatio >= 0.35;
      if (visible) resume(); else if (playing) go(si, false);
    }), { threshold: [0, 0.35, 0.7] }).observe(win);
  } else { visible = true; resume(); }
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) go(si, false); else resume(); });
})();
